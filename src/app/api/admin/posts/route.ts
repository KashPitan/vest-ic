import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { uploadImageToBlob } from "@/lib/blob";
import { db } from "@/db";
import { posts, postTags } from "@/db/schema";
import { desc } from "drizzle-orm";

const CreatePostRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  releaseDate: z.string().optional(),
  displayImage: z.string().optional(),
  tags: z.array(z.string().uuid()).min(1, "At least one tag is required"),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { title, slug, content, excerpt, tags, displayImage, releaseDate } =
      CreatePostRequestSchema.parse(data);

    let displayImageUrl: string | undefined;

    if (displayImage) {
      const environment = process.env.ENVIRONMENT;
      const environmentString = environment ? environment + "/" : "";
      displayImageUrl = await uploadImageToBlob(
        displayImage,
        `posts/${slug}/${environmentString}display-image-${Date.now()}.jpg`,
      );
    }

    const cleanContent = sanitizeHtml(content);

    // Create the post and tags in a transaction
    const result = await db.transaction(async (tx) => {
      // Create the post
      const [post] = await tx
        .insert(posts)
        .values({
          title,
          slug,
          content: cleanContent,
          excerpt,
          releaseDate: releaseDate ? new Date(releaseDate) : undefined,
          displayImageUrl,
        })
        .returning();

      // Create the tags association
      await Promise.all(
        tags.map((tagId) =>
          tx.insert(postTags).values({
            postId: post.id,
            tagId: tagId.toString(),
          }),
        ),
      );

      return post;
    });

    return NextResponse.json({ success: true, post: result });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const fetchedPosts = await db.query.posts.findMany({
      columns: {
        id: true,
        title: true,
        slug: true,
        releaseDate: true,
      },
      orderBy: [desc(posts.createdAt)],
    });

    return NextResponse.json(fetchedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
