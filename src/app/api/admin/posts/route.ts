import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

const payload = await getPayload({ config });

const CreatePostRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, "Excerpt is required"),
  tags: z.array(z.number()).min(1, "At least one tag is required"),
});

export async function POST(request: Request) {
  const transactionID = (await payload.db.beginTransaction()) as string;

  try {
    const data = await request.json();
    const { title, slug, content, excerpt, tags } =
      CreatePostRequestSchema.parse(data);

    const post = await payload.create({
      collection: "posts",
      data: {
        title,
        slug,
        content,
        excerpt,
      },
      req: { transactionID },
    });

    // create the tags association
    await Promise.all(
      tags.map((value) =>
        payload.create({
          collection: "postTags",
          data: {
            post_id: post.id,
            tag_id: value,
          },
          req: { transactionID },
        })
      )
    );

    await payload.db.commitTransaction(transactionID);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
