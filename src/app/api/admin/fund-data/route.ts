import { NextRequest, NextResponse } from "next/server";
import { uploadToBlob } from "@/lib/blob";
import { isAdmin } from "@/lib/validateRequest";
import { createFundDataAuditRecord } from "@/data-access-layer/fundDataAudit";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    await isAdmin();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Upload file to blob storage under fund-data folder
    const result = await uploadToBlob(file, "fund-data");

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    // Create audit record
    const auditResult = await createFundDataAuditRecord({
      filename: file.name,
    });

    if (!auditResult.success) {
      return NextResponse.json(
        { error: "File uploaded but failed to create audit record" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: result.url,
      auditRecord: auditResult.data,
    });
  } catch (error) {
    console.error("Error uploading fund data:", error);
    return NextResponse.json(
      { error: "Failed to upload fund data" },
      { status: 500 },
    );
  }
}
