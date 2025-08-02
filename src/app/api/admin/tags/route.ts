import { NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
import { eq, desc } from "drizzle-orm";
import * as z from "zod";
import { categorySchema } from "@/types/schemas/tags";
import { isAdmin } from "@/lib/validateRequest";

const createTagSchema = z.object({
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

export async function POST(request: Request) {
  try {
    await isAdmin();
    const body = await request.json();

    // Validate request body
    const result = createTagSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: result.error.errors },
        { status: 400 },
      );
    }

    const { tagName, category } = result.data;

    // Check if tag already exists
    const existingTag = await db.query.tags.findFirst({
      where: eq(tags.tagName, tagName),
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "A tag with this name already exists" },
        { status: 409 },
      );
    }

    // Create new tag
    const [newTag] = await db
      .insert(tags)
      .values({
        tagName,
        category,
      })
      .returning();

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await isAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Tag ID is required" },
        { status: 400 },
      );
    }

    // Delete the tag
    const [deletedTag] = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning();

    if (!deletedTag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(deletedTag, { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await isAdmin();
    const fetchedTags = await db.query.tags.findMany({
      columns: {
        id: true,
        tagName: true,
        category: true,
        createdAt: true,
      },
      orderBy: [desc(tags.createdAt)],
    });

    return NextResponse.json(fetchedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Failed to fetch tags" },
      { status: 500 },
    );
  }
}
