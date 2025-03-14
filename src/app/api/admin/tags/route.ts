import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

export async function GET() {
  try {
    // Fetch tags from the collection
    const tags = await payload.find({
      collection: "tags",
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
