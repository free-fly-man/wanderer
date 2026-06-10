import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";

// ============================================================
// 高德 POI 搜索适配器（替代 Overpass API）
// 用于地图兴趣点（POI）图层显示
// 环境变量: AMAP_KEY — 高德开放平台 Web 服务 API Key
// ============================================================

const AMAP_API_BASE = "https://restapi.amap.com/v3";
const AMAP_MAX_RETRIES = 2;
const AMAP_RATE_LIMIT_MS = 100; // ~10 QPS

let lastAmapCall = 0;

function getAmapKey(): string {
    const key = env.AMAP_KEY;
    if (!key) {
        throw new Error("AMAP_KEY environment variable is not set");
    }
    return key;
}

// --------------- GCJ-02 ↔ WGS-84 坐标转换 ---------------

const PI = Math.PI;
const A_SEMI = 6378245.0;
const EE = 0.00669342162296594323;

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

function gcj02ToWgs84(lng: number, lat: number): [number, number] {
    if (outOfChina(lng, lat)) return [lng, lat];
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((A_SEMI * (1 - EE)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (A_SEMI / sqrtMagic * Math.cos(radLat) * PI);
    return [lng - dLng, lat - dLat];
}

function wgs84ToGcj02(lng: number, lat: number): [number, number] {
    if (outOfChina(lng, lat)) return [lng, lat];
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((A_SEMI * (1 - EE)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (A_SEMI / sqrtMagic * Math.cos(radLat) * PI);
    return [lng + dLng, lat + dLat];
}

// --------------- POI 名称 → 高德类型编码映射 ---------------
// 参考高德 POI 分类: https://lbs.amap.com/api/webservice/download

const POI_TYPE_MAP: Record<string, string> = {
    // 餐饮 (Food & Drinks)
    "bakery": "050301",
    "grocery-store": "060400|060200",
    "food-drinks": "050100|050200|050300|050400|050500",
    // 设施 (Amenities)
    "toilets": "200300|200301",
    "water": "150500|150501",
    "shower": "200400",
    "shelter": "120000|120100",
    "gas-station": "010100|010101|010102",
    "parking": "150900|150901|150904",
    "garage": "030000|030100|030200",
    // 景点 (Tourism)
    "attraction": "110000|110100|110200",
    "viewpoint": "110200|110201",
    "hotel": "100100|100101|100102|100103|100104|100200",
    "campsite": "110203|100600",
    "hut": "100105|110202",
    "picnic": "110105|110106",
    // 户外 (Hiking)
    "summit": "110200",
    "mountain-pass": "110200",
    "climbing": "080301|110200",
    // 骑行 (Cycling)
    "bicycle-parking": "150906|150900",
    "bicycle-rental": "150700",
    "bicycle-shop": "030400|030401",
    // 交通 (Public Transport)
    "railway-station": "150200|150201",
    "subway-stop": "150500|150501",
    "tram-stop": "150600",
    "bus-stop": "150700|150701|150702",
    "ferry": "150300|150301",
};

// --------------- 速率限制与请求 ---------------

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
            throw new Error(`Amap POI search failed: ${url}`, { cause: error });
        }
    }
}

// --------------- 主函数：POI 搜索 ---------------

export async function fetchPoiSearch(
    event: RequestEvent,
    lat: number,
    lon: number,
    types: string[],
    radius: number,
): Promise<Response> {
    const key = getAmapKey();

    // WGS-84 → GCJ-02（高德要求 GCJ-02 坐标输入）
    const [gcjLng, gcjLat] = wgs84ToGcj02(lon, lat);

    // 将 POI 名称映射为高德类型编码并合并
    const amapTypes: string[] = [];
    for (const typeName of types) {
        const code = POI_TYPE_MAP[typeName];
        if (code) {
            // 每个类型编码可能含 | 分隔多个子类型
            code.split("|").forEach(c => {
                if (c && !amapTypes.includes(c)) amapTypes.push(c);
            });
        }
    }

    if (amapTypes.length === 0) {
        return new Response(JSON.stringify({ elements: [] }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    const params = new URLSearchParams({
        key,
        location: `${gcjLng.toFixed(6)},${gcjLat.toFixed(6)}`,
        types: amapTypes.join("|"),
        radius: String(Math.min(Math.max(Math.round(radius), 100), 50000)),
        offset: "25",
        page: "1",
        extensions: "all",
        output: "json",
    });

    const data = await amapFetch(`${AMAP_API_BASE}/place/around?${params.toString()}`);

    if (data.status !== "1" || !data.pois?.length) {
        return new Response(JSON.stringify({ elements: [] }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    // 构建反向映射：高德类型编码 → POI 查询名称列表
    const typeToQueries: Record<string, string[]> = {};
    for (const queryName of types) {
        const code = POI_TYPE_MAP[queryName];
        if (!code) continue;
        for (const c of code.split("|")) {
            if (!typeToQueries[c]) typeToQueries[c] = [];
            typeToQueries[c].push(queryName);
        }
    }

    // 将高德 POI 转换为 OverpassElement 格式
    const elements: any[] = [];

    for (const poi of data.pois) {
        const [poiLng, poiLat] = poi.location.split(",").map(Number);
        const [wgsLng, wgsLat] = gcj02ToWgs84(poiLng, poiLat);

        // 确定此 POI 匹配哪些查询类别
        const matchedQueries = new Set<string>();
        if (typeToQueries[poi.type]) {
            typeToQueries[poi.type].forEach(q => matchedQueries.add(q));
        }
        // 回退：通过 typecode 前缀匹配
        if (matchedQueries.size === 0 && poi.typecode) {
            const prefix = poi.typecode.substring(0, 2);
            for (const [queryName, code] of Object.entries(POI_TYPE_MAP)) {
                if (!types.includes(queryName)) continue;
                if (code.split("|").some(c => c.startsWith(prefix))) {
                    matchedQueries.add(queryName);
                }
            }
        }

        // 构建兼容 OSM tags 的对象（供 belongsToQuery 匹配）
        const tags: Record<string, string> = {
            name: poi.name || "",
            amenity: poi.type || "",
        };
        for (const q of matchedQueries) {
            tags[q] = "yes";
        }

        elements.push({
            id: parseInt(poi.id) || Math.floor(Math.random() * 1e8),
            lat: wgsLat,
            lon: wgsLng,
            type: "node",
            tags,
        });
    }

    return new Response(JSON.stringify({ elements }), {
        headers: { "Content-Type": "application/json" },
    });
}
