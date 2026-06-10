import { amapRouteRequest } from '$lib/server/valhalla';
import { json, type RequestEvent } from "@sveltejs/kit";

/**
 * @swagger
 * /api/v1/valhalla/route:
 *   post:
 *     summary: Get route data
 *     description: Queries Amap (高德) route planning service, returns Valhalla-compatible response
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
 *         description: Route data (Valhalla-compatible format)
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
        const result = await amapRouteRequest(data);
        return json(result);
    } catch (error: any) {
        console.error("Route planning failed", error);
        return json({ message: "Route planning failed", detail: error?.message }, { status: 502 });
    }
}
