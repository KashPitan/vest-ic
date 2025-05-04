import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

const payload = await getPayload({ config });

const CreateHighlightSchema = z.object({
  post_id: z.coerce.number(),
});

export async function PUT(request: Request) {
  const transactionID = (await payload.db.beginTransaction()) as string;

  try {
    const data = await request.json();
    const { totalDocs } = await payload.count({
      collection: "highlights",
    });
    if (totalDocs > 4) throw new Error("Only 5 highlights are allowed");
    const { post_id } = CreateHighlightSchema.parse(data);
    const post = await payload.findByID({
      collection: "posts",
      id: post_id,
      disableErrors: true,
    });
    if (!post) throw new Error("Post does not exist");
    const highlight = await payload.create({
      collection: "highlights",
      data: { post_id },
      req: {
        transactionID,
      },
    });
    await payload.db.commitTransaction(transactionID);

    return NextResponse.json({ success: true, highlight });
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create insight" },
      { status: 500 },
    );
  }
}

const DeleteHighlightSchema = z.object({
  post_id: z.coerce.number(),
});

export async function DELETE(request: Request) {
  const transactionID = (await payload.db.beginTransaction()) as string;

  try {
    const data = await request.json();

    const { post_id } = DeleteHighlightSchema.parse(data);
    const highlight = await payload.delete({
      collection: "highlights",
      where: {
        post_id: { equals: post_id },
      },
      req: {
        transactionID,
      },
    });
    await payload.db.commitTransaction(transactionID);

    return NextResponse.json({ success: true, highlight });
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create insight" },
      { status: 500 },
    );
  }
}
