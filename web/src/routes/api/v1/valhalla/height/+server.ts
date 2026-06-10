import { amapHeightRequest } from '$lib/server/valhalla';
import { json, type RequestEvent } from "@sveltejs/kit";

/**
 * @swagger
 * /api/v1/valhalla/height:
 *   post:
 *     summary: Get elevation data
 *     description: Queries Amap (高德) elevation service, returns Valhalla-compatible response
 *     tags:
 *       - Valhalla
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Elevation data (Valhalla-compatible format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function POST(event: RequestEvent) {
    try {
        const data = await event.request.json();
        const result = await amapHeightRequest(data.encoded_polyline);
        return json(result);
    } catch (error: any) {
        console.error("Elevation request failed", error);
        return json({ message: "Elevation request failed", detail: error?.message }, { status: 502 });
    }
}
