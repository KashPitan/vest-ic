import { NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { categorySchema } from "@/types/schemas/tags";

const updateTagSchema = z.object({
  tagName: z
    .string()
    .min(2, "Tag name must be at least 2 characters")
    .max(50, "Tag name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Tag name can only contain letters, numbers, spaces, and hyphens",
    ),
  category: categorySchema,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, id),
    });

    if (!tag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { message: "Failed to fetch tag" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    console.log(body);
    // Validate request body
    const result = updateTagSchema.safeParse(body);
    if (!result.success) {
      console.log(result.error.errors);
      return NextResponse.json(
        { message: "Invalid request body", errors: result.error.errors },
        { status: 400 },
      );
    }
    console.log(result.data);
    const { tagName, category } = result.data;

    // Check if tag already exists (excluding current tag)
    const existingTag = await db.query.tags.findFirst({
      where: eq(tags.tagName, tagName),
    });

    if (existingTag && existingTag.id !== id) {
      return NextResponse.json(
        { message: "A tag with this name already exists" },
        { status: 409 },
      );
    }

    // Update tag
    const [updatedTag] = await db
      .update(tags)
      .set({
        tagName,
        category,
        updatedAt: new Date(),
      })
      .where(eq(tags.id, id))
      .returning();

    if (!updatedTag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { message: "Failed to update tag" },
      { status: 500 },
    );
  }
}
