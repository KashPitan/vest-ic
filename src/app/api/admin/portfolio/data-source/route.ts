import { NextRequest, NextResponse } from "next/server";
import { updateEdgeConfigItems } from "@/lib/edge-config";

export const runtime = "edge";

/**
 * POST handler:
 * updates the Edge Config key 'currentPortfolioDataSource' to the selected file name.
 *
 * Note: The Vercel Edge Config SDK (@vercel/edge-config) does NOT support writing/updating values.
 *       All writes must be performed via the Vercel REST API.
 *       See: https://vercel.com/docs/storage/edge-config/using-edge-config#writing-data-to-edge-configs
 */
export async function POST(req: NextRequest) {
  // Handle Edge Config update (must use REST API, not SDK)
  try {
    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json(
        { error: "Missing file name." },
        { status: 400 },
      );
    }
    const edgeConfigId = process.env.EDGE_CONFIG_ID;
    const vercelToken = process.env.VERCEL_TOKEN;
    if (!edgeConfigId || !vercelToken) {
      return NextResponse.json(
        { error: "Missing Edge Config ID or Vercel API token." },
        { status: 500 },
      );
    }
    const items = [
      {
        operation: "create",
        key: "currentPortfolioDataSource",
        value: fileName,
      },
    ];
    const data = await updateEdgeConfigItems(items);
    if (data.status !== "ok") {
      return NextResponse.json(
        { error: data.error || "Failed to update Edge Config." },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update Edge Config." },
      { status: 500 },
    );
  }
}
