import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { posts, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { deleteFromBlob, uploadToBlob } from "@/lib/blob";

const UpdatePostRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  displayImage: z.string().optional(),
  oldDisplayImageUrl: z.string().optional(),
  tags: z.array(z.number()).min(1, "At least one tag is required"),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      tags,
      displayImage,
      oldDisplayImageUrl,
    } = UpdatePostRequestSchema.parse(data);

    let displayImageUrl: string | undefined;

    if (displayImage) {
      const environment = process.env.ENVIRONMENT;
      const environmentString = environment ? environment + "/" : "";
      displayImageUrl = await uploadToBlob(
        displayImage,
        `posts/${slug}/${environmentString}display-image-${Date.now()}.jpg`,
      );
    }

    if (oldDisplayImageUrl) {
      await deleteFromBlob(oldDisplayImageUrl);
    }

    const cleanContent = sanitizeHtml(content);

    // Use Drizzle transaction
    const result = await db.transaction(async (tx) => {
      // Update post
      const [updatedPost] = await tx
        .update(posts)
        .set({
          title,
          slug,
          content: cleanContent,
          excerpt,
          displayImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, params.id))
        .returning();

      if (!updatedPost) {
        throw new Error("Post not found");
      }

      // Delete existing tag associations
      await tx.delete(postTags).where(eq(postTags.postId, params.id));

      // Create new tag associations
      await tx.insert(postTags).values(
        tags.map((tagId) => ({
          postId: params.id,
          tagId: tagId.toString(),
        })),
      );

      return updatedPost;
    });

    return NextResponse.json({ success: true, post: result });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}
