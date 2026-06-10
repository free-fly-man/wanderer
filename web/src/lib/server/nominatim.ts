import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";

// ============================================================
// 高德地图地理编码 API 适配器
// 替代原 Nominatim (OpenStreetMap) 服务，响应格式兼容 Nominatim GeoJSON
// 环境变量: AMAP_KEY — 高德开放平台 Web 服务 API Key
// ============================================================

const AMAP_API_BASE = "https://restapi.amap.com/v3";
const AMAP_MAX_RETRIES = 2;
const AMAP_RATE_LIMIT_MS = 100; // ~10 QPS

let lastAmapCall = 0;

function getAmapKey(): string {
    const key = env.AMAP_KEY;
    if (!key) {
        throw new Error("AMAP_KEY environment variable is not set. Get one at https://lbs.amap.com");
    }
    return key;
}

// --------------- GCJ-02 ↔ WGS-84 坐标转换 ---------------

const PI = Math.PI;
const A = 6378245.0; // Krasovsky 椭球体长半轴
const EE = 0.00669342162296594323; // Krasovsky 椭球体偏心率平方

function outOfChina(lng: number, lat: number): boolean {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

function transformLat(x: number, y: number): number {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320.0 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLng(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

/** GCJ-02 → WGS-84 */
function gcj02ToWgs84(lng: number, lat: number): [number, number] {
    if (outOfChina(lng, lat)) return [lng, lat];
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI);
    return [lng - dLng, lat - dLat];
}

/** WGS-84 → GCJ-02 */
function wgs84ToGcj02(lng: number, lat: number): [number, number] {
    if (outOfChina(lng, lat)) return [lng, lat];
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI);
    return [lng + dLng, lat + dLat];
}

// --------------- 速率限制 ---------------

async function amapRateLimiter() {
    const elapsed = Date.now() - lastAmapCall;
    if (elapsed < AMAP_RATE_LIMIT_MS) {
        await new Promise<void>(r => setTimeout(r, AMAP_RATE_LIMIT_MS - elapsed));
    }
    lastAmapCall = Date.now();
}

async function amapFetch(url: string): Promise<any> {
    let attempt = 0;
    while (true) {
        await amapRateLimiter();
        try {
            const resp = await fetch(url);
            return await resp.json();
        } catch (error) {
            if (attempt < AMAP_MAX_RETRIES) { attempt++; continue; }
            throw new Error(`Amap API request failed: ${url}`, { cause: error });
        }
    }
}

// --------------- 高德行政区划 → Nominatim Address 映射 ---------------

function mapAmapAddress(rc: any): Record<string, string> {
    const province: string = rc.province || "";
    const city: string = (Array.isArray(rc.city) ? "" : rc.city) || "";
    const district: string = rc.district || "";
    const township: string = rc.township || "";
    const neighborhood: string = rc.neighborhood?.name || "";

    return {
        road: rc.street || rc.township || "",
        neighbourhood: neighborhood || township,
        suburb: district,
        city: city || province,
        town: township,
        village: rc.towncode ? township : "",
        state: province,
        "ISO3166-2-lvl4": "",
        postcode: rc.adcode || "",
        country: "中国",
        country_code: "cn",
        amenity: "",
        city_district: district,
    };
}

// --------------- 地址类型推断 ---------------

function inferAddressType(level: string): string {
    const levelMap: Record<string, string> = {
        "国家": "country",
        "省": "state",
        "市": "city",
        "区县": "county",
        "乡镇": "town",
        "街道": "street",
        "门牌号": "house_number",
        "兴趣点": "poi",
    };
    return levelMap[level] || "place";
}

// --------------- 正向地理编码（关键词 → 坐标） ---------------

export async function fetchGeocodingSearch(
    event: RequestEvent,
    q: string,
    limit: string | null,
): Promise<Response> {
    const key = getAmapKey();
    const params = new URLSearchParams({
        key,
        keywords: q,
        output: "json",
    });
    if (limit) {
        params.set("offset", limit);
    }

    const data = await amapFetch(`${AMAP_API_BASE}/place/text?${params.toString()}`);

    if (data.status !== "1" || !data.geocodes?.length) {
        return new Response(JSON.stringify({
            type: "FeatureCollection",
            licence: "高德地图",
            features: [],
        }), { headers: { "Content-Type": "application/json" } });
    }

    const features = data.geocodes.map((r: any) => {
        const [gcjLng, gcjLat] = r.location.split(",").map(Number);
        const [wgsLng, wgsLat] = gcj02ToWgs84(gcjLng, gcjLat);
        const address = mapAmapAddress(r);
        const displayParts = [r.formatted_address, r.cityname, r.province].filter(Boolean);

        return {
            type: "Feature",
            properties: {
                place_id: r.id || 0,
                osm_type: "node",
                osm_id: 0,
                place_rank: 0,
                category: "place",
                type: inferAddressType(r.level),
                importance: 0.5,
                addresstype: inferAddressType(r.level),
                name: r.name || "",
                display_name: displayParts.join(", "),
                address,
            },
            bbox: [wgsLng - 0.01, wgsLat - 0.01, wgsLng + 0.01, wgsLat + 0.01],
            geometry: { type: "Point", coordinates: [wgsLng, wgsLat] },
        };
    });

    return new Response(JSON.stringify({
        type: "FeatureCollection",
        licence: "高德地图",
        features,
    }), { headers: { "Content-Type": "application/json" } });
}

// --------------- 逆向地理编码（坐标 → 地址） ---------------

export async function fetchGeocodingReverse(
    event: RequestEvent,
    lat: number,
    lon: number,
): Promise<Response> {
    const key = getAmapKey();
    // WGS-84 → GCJ-02（高德要求 GCJ-02 坐标输入）
    const [gcjLng, gcjLat] = wgs84ToGcj02(lon, lat);

    const params = new URLSearchParams({
        key,
        location: `${gcjLng.toFixed(6)},${gcjLat.toFixed(6)}`,
        radius: "1000",
        extensions: "all",
        output: "json",
    });

    const data = await amapFetch(`${AMAP_API_BASE}/place/around?${params.toString()}`);

    if (data.status !== "1" || !data.pois?.length) {
        return new Response(JSON.stringify({
            type: "FeatureCollection",
            licence: "高德地图",
            features: [],
        }), { headers: { "Content-Type": "application/json" } });
    }

    const poi = data.pois[0];
    const [poiLng, poiLat] = poi.location.split(",").map(Number);
    const [wgsLng, wgsLat] = gcj02ToWgs84(poiLng, poiLat);

    // 从逆地理编码响应构建 Address
    const rc = data.regeocode?.addressComponent || {};
    const address = mapAmapAddress(rc);
    // 用最近 POI 的名称补充 road 字段
    if (!address.road && poi.name) {
        address.road = poi.name;
    }

    const displayName = data.regeocode?.formatted_address || poi.name || "";

    const feature = {
        type: "Feature",
        properties: {
            place_id: poi.id || 0,
            osm_type: "node",
            osm_id: 0,
            place_rank: 0,
            category: poi.type || "place",
            type: "address",
            importance: 0.5,
            addresstype: "address",
            name: poi.name || "",
            display_name: displayName,
            address,
        },
        bbox: [wgsLng - 0.01, wgsLat - 0.01, wgsLng + 0.01, wgsLat + 0.01],
        geometry: { type: "Point", coordinates: [wgsLng, wgsLat] },
    };

    return new Response(JSON.stringify({
        type: "FeatureCollection",
        licence: "高德地图",
        features: [feature],
    }), { headers: { "Content-Type": "application/json" } });
}
