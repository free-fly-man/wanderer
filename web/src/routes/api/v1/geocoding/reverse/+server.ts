import { json, type RequestEvent } from "@sveltejs/kit";
import { fetchGeocodingReverse } from "$lib/server/nominatim";

export async function GET(event: RequestEvent) {
    const lat = event.url.searchParams.get("lat");
    const lon = event.url.searchParams.get("lon");
    if (!lat || !lon) {
        return json({ message: "Missing query parameter: lat or lon" }, { status: 400 });
    }

    if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
        return json({ message: "Invalid query parameter: lat or lon" }, { status: 400 });
    }

    try {
        const response = await fetchGeocodingReverse(event, Number(lat), Number(lon));
        const payload = await response.json();
        return json(payload);
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const detail = {
            name: err.name,
            message: err.message,
            cause: err.cause instanceof Error ? err.cause.message : err.cause,
        };
        console.error("Geocoding reverse request failed", detail);
        return json({ message: "Geocoding request failed", detail }, { status: 502 });
    }
}
