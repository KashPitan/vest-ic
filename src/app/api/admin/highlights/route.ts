import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { highlights, posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isPostHighlighted } from "@/data-access-layer/highlights";

const CreateHighlightSchema = z.object({
  post_id: z.string().uuid(),
});

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { post_id } = CreateHighlightSchema.parse(data);

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Check if post exists
      const post = await tx.query.posts.findFirst({
        where: eq(posts.id, post_id),
      });
      if (!post) throw new Error("Post does not exist");

      // Count existing highlights
      const existingHighlights = await tx.query.highlights.findMany();
      if (existingHighlights.length >= 5) {
        throw new Error("Only 5 highlights are allowed");
      }

      // Create new highlight
      const [highlight] = await tx
        .insert(highlights)
        .values({ postId: post_id })
        .returning();

      return highlight;
    });

    return NextResponse.json({ success: true, highlight: result });
  } catch (error) {
    console.error("Error creating highlight:", error);
    return NextResponse.json(
      { error: "Failed to create highlight" },
      { status: 500 },
    );
  }
}

const DeleteHighlightSchema = z.object({
  post_id: z.string().uuid(),
});

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const { post_id } = DeleteHighlightSchema.parse(data);

    const result = await db.transaction(async (tx) => {
      const [deletedHighlight] = await tx
        .delete(highlights)
        .where(eq(highlights.postId, post_id))
        .returning();

      return deletedHighlight;
    });

    return NextResponse.json({ success: true, highlight: result });
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return NextResponse.json(
      { error: "Failed to delete highlight" },
      { status: 500 },
    );
  }
}

const GetHighlightStatusSchema = z.object({
  post_id: z.string().uuid(),
});

// gets highlight data for a post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get("post_id");

    if (!post_id) {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 },
      );
    }

    const { post_id: validatedPostId } = GetHighlightStatusSchema.parse({
      post_id,
    });
    const result = await isPostHighlighted(validatedPostId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking highlight status:", error);
    return NextResponse.json(
      { error: "Failed to check highlight status" },
      { status: 500 },
    );
  }
}
