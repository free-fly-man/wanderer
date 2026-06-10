import { json, type RequestEvent } from "@sveltejs/kit";
import { fetchPoiSearch } from "$lib/server/overpass";

export async function GET(event: RequestEvent) {
    const lat = event.url.searchParams.get("lat");
    const lon = event.url.searchParams.get("lon");
    const types = event.url.searchParams.get("types");
    const radius = event.url.searchParams.get("radius");

    if (!lat || !lon || !types) {
        return json({ message: "Missing query parameter: lat, lon, or types" }, { status: 400 });
    }

    if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
        return json({ message: "Invalid query parameter: lat or lon" }, { status: 400 });
    }

    const typeList = types.split(",").map(t => t.trim()).filter(Boolean);
    const radiusNum = radius ? Number(radius) : 6000;

    try {
        const response = await fetchPoiSearch(event, Number(lat), Number(lon), typeList, radiusNum);
        const payload = await response.json();
        return json(payload);
    } catch (error) {
        console.error("POI search request failed", error);
        return json({ message: "POI search request failed" }, { status: 502 });
    }
}
