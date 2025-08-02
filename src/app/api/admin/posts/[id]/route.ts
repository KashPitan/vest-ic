import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { posts, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { deleteFromBlob, uploadImageToBlob } from "@/lib/blob";
import { isAdmin } from "@/lib/validateRequest";

const UpdatePostRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  displayImage: z.string().optional(),
  oldDisplayImageUrl: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await isAdmin();
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
      displayImageUrl = await uploadImageToBlob(
        displayImage,
        `posts/${slug}/${environmentString}display-image-${Date.now()}.jpg`,
      );
    }

    if (oldDisplayImageUrl) {
      await deleteFromBlob(oldDisplayImageUrl);
    }

    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    });

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
        .where(eq(posts.id, id))
        .returning();

      if (!updatedPost) {
        throw new Error("Post not found");
      }

      // Delete existing tag associations
      await tx.delete(postTags).where(eq(postTags.postId, id));

      // Create new tag associations
      await tx.insert(postTags).values(
        tags.map((tagId) => ({
          postId: id,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await isAdmin();
    // Get the post first to check if it exists and get the display image URL
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the post and its associated data in a transaction
    const result = await db.transaction(async (tx) => {
      // Delete post-tag associations
      await tx.delete(postTags).where(eq(postTags.postId, id));

      // Delete the post
      const [deletedPost] = await tx
        .delete(posts)
        .where(eq(posts.id, id))
        .returning();

      return deletedPost;
    });

    // Delete the display image from blob storage if it exists
    if (post.displayImageUrl) {
      await deleteFromBlob(post.displayImageUrl);
    }

    return NextResponse.json({ success: true, post: result });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
