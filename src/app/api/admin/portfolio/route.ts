import { NextRequest, NextResponse } from "next/server";
import { uploadToBlob } from "@/lib/blob";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    const result = await uploadToBlob(file, "portfolio");
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { message: "Failed to fetch tag" },
      { status: 500 },
    );
  }
}
