import { env } from "$env/dynamic/private";
import { decodePolyline, encodePolyline } from "$lib/util/polyline_util";

// ============================================================
// 高德路径规划 + 高程服务适配器（替代 Valhalla）
// 环境变量: AMAP_KEY — 高德开放平台 Web 服务 API Key
// 前端请求格式与 Valhalla 完全兼容，无需修改前端代码
// ============================================================

const AMAP_API_BASE = "https://restapi.amap.com/v3";
const AMAP_RATE_LIMIT_MS = 100; // ~10 QPS
const AMAP_ELEVATION_BATCH_SIZE = 25; // 高德 getlocationsplit 每次最多 25 个坐标

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

// --------------- 速率限制 ---------------

async function amapRateLimiter() {
    const elapsed = Date.now() - lastAmapCall;
    if (elapsed < AMAP_RATE_LIMIT_MS) {
        await new Promise<void>(r => setTimeout(r, AMAP_RATE_LIMIT_MS - elapsed));
    }
    lastAmapCall = Date.now();
}

// ============================================================
// 路线规划适配器（替代 Valhalla /route）
// ============================================================

const COSTING_TO_AMAP: Record<string, string> = {
    pedestrian: "walking",
    bicycle: "riding",
    auto: "driving",
};

export async function amapRouteRequest(data: any): Promise<any> {
    const key = getAmapKey();

    const locations = data.locations;
    if (!locations || locations.length < 2) {
        throw new Error("At least 2 locations are required");
    }

    const costing = data.costing || "pedestrian";
    const amapMode = COSTING_TO_AMAP[costing];
    if (!amapMode) {
        throw new Error(`Unsupported costing mode: ${costing}`);
    }

    // WGS-84 → GCJ-02
    const origin = locations[0];
    const dest = locations[locations.length - 1];
    const [originGcjLng, originGcjLat] = wgs84ToGcj02(origin.lon, origin.lat);
    const [destGcjLng, destGcjLat] = wgs84ToGcj02(dest.lon, dest.lat);

    const params = new URLSearchParams({
        key,
        origin: `${originGcjLng.toFixed(6)},${originGcjLat.toFixed(6)}`,
        destination: `${destGcjLng.toFixed(6)},${destGcjLat.toFixed(6)}`,
        extensions: "all",
        output: "json",
    });

    // 驾车模式支持策略参数：0=速度优先（时间最短），默认即可
    if (amapMode === "driving") {
        params.set("strategy", "0");
    }

    await amapRateLimiter();
    const resp = await fetch(`${AMAP_API_BASE}/direction/${amapMode}?${params.toString()}`);
    const amapData = await resp.json();

    if (amapData.status !== "1" || !amapData.route?.paths?.length) {
        throw new Error(`Amap route planning failed: ${amapData.info || "no route found"}`);
    }

    const path = amapData.route.paths[0];
    const distanceM = Number(path.distance) || 0;
    const durationS = Number(path.duration) || 0;

    // 合并所有 step 的 polylines，GCJ-02 → WGS-84，重新编码为 Valhalla 兼容格式
    let allPoints: number[][] = [];

    for (const step of (path.steps || [])) {
        if (!step.polylines) continue;
        // 高德 polylines 格式: "lng,lat;lng,lat;..."（可能含多段，以 ; 分隔）
        const segments = step.polylines.split(";");
        for (const seg of segments) {
            if (!seg) continue;
            const parts = seg.split(",");
            if (parts.length < 2) continue;
            const [gcjLng, gcjLat] = parts.map(Number);
            const [wgsLng, wgsLat] = gcj02ToWgs84(gcjLng, gcjLat);
            // encodePolyline 接收 [lon, lat] 格式（与 decodePolyline 输出一致）
            allPoints.push([wgsLng, wgsLat]);
        }
    }

    const shape = encodePolyline(allPoints);

    return {
        trip: {
            locations: locations.map((loc: any, i: number) => ({
                type: "break",
                lat: loc.lat,
                lon: loc.lon,
                original_index: i,
            })),
            legs: [{
                summary: {
                    has_time_restrictions: false,
                    has_toll: false,
                    has_highway: false,
                    has_ferry: false,
                    min_lat: 0,
                    min_lon: 0,
                    max_lat: 0,
                    max_lon: 0,
                    time: durationS,
                    length: distanceM / 1000, // Valhalla 单位为 km
                    cost: 0,
                },
                shape,
            }],
            summary: {
                has_time_restrictions: false,
                has_toll: false,
                has_highway: false,
                has_ferry: false,
                min_lat: 0,
                min_lon: 0,
                max_lat: 0,
                max_lon: 0,
                time: durationS,
                length: distanceM / 1000,
                cost: 0,
            },
            status_message: "Found route between points",
            status: 0,
            units: "kilometers",
            language: "zh-CN",
        },
    };
}

// ============================================================
// 高程/海拔适配器（替代 Valhalla /height）
// ============================================================

export async function amapHeightRequest(encodedPolyline: string): Promise<any> {
    const key = getAmapKey();

    // 解码 Valhalla 格式 polyline → [lon, lat][]
    const points = decodePolyline(encodedPolyline);

    // WGS-84 → GCJ-02
    const gcjCoords = points.map(([lon, lat]) => {
        const [gcjLng, gcjLat] = wgs84ToGcj02(lon, lat);
        return `${gcjLng.toFixed(6)},${gcjLat.toFixed(6)}`;
    });

    // 高德 getlocationsplit 每次最多 25 个坐标，需要分批请求
    const heights: number[] = [];

    for (let i = 0; i < gcjCoords.length; i += AMAP_ELEVATION_BATCH_SIZE) {
        const batch = gcjCoords.slice(i, i + AMAP_ELEVATION_BATCH_SIZE);
        const params = new URLSearchParams({
            key,
            locations: batch.join("|"),
            output: "json",
        });

        await amapRateLimiter();
        const resp = await fetch(`${AMAP_API_BASE}/utils/getlocationsplit?${params.toString()}`);
        const data = await resp.json();

        if (data.status !== "1" || !data.regeos?.length) {
            // 无高程数据时填充 0（境外区域可能出现）
            for (let j = 0; j < batch.length; j++) heights.push(0);
            continue;
        }

        for (const regeo of data.regeos) {
            heights.push(Number(regeo.elevation) || 0);
        }
    }

    return { height: heights };
}
