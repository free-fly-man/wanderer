import { json, type RequestEvent } from "@sveltejs/kit";
import { fetchGeocodingSearch } from "$lib/server/nominatim";

export async function GET(event: RequestEvent) {
    const q = event.url.searchParams.get("q");
    if (!q) {
        return json({ message: "Missing query parameter: q" }, { status: 400 });
    }

    const limit = event.url.searchParams.get("limit");
    if (limit !== null && Number.isNaN(Number(limit))) {
        return json({ message: "Invalid query parameter: limit" }, { status: 400 });
    }

    try {
        const response = await fetchGeocodingSearch(event, q, limit);
        const payload = await response.json();
        return json(payload);
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const detail = {
            name: err.name,
            message: err.message,
            cause: err.cause instanceof Error ? err.cause.message : err.cause,
        };
        console.error("Geocoding search request failed", detail);
        return json({ message: "Geocoding request failed", detail }, { status: 502 });
    }
}
