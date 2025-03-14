import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { CreatePostFormSchema } from "@/components/admin/CreatePostForm";

const payload = await getPayload({ config });

// add zod validation
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, slug, content, excerpt, tags } =
      CreatePostFormSchema.parse(data);

    // Create the post
    const post = await payload.create({
      collection: "posts",
      data: {
        title,
        slug,
        content,
        excerpt,
      },
    });

    // create the tags association
    await Promise.all(
      tags.map(({ value }) =>
        payload.create({
          collection: "postTags",
          data: {
            post_id: post.id,
            tag_id: parseInt(value),
          },
        })
      )
    );

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
