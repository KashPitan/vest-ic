import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    // List all files in the 'portfolio' folder
    const { blobs } = await list({ prefix: "portfolio/" });
    // Sort by uploadedAt descending (most recent first)
    blobs.sort((a, b) => Number(b.uploadedAt ?? 0) - Number(a.uploadedAt ?? 0));
    // Return just the file names
    const files = blobs.map((blob) =>
      blob.pathname.replace(/^portfolio\//, ""),
    );
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json(
      { error: "Failed to list files." },
      { status: 500 },
    );
  }
}
