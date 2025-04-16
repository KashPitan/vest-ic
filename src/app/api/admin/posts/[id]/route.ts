import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { deleteFromBlob, uploadToBlob } from "@/lib/blob";

const payload = await getPayload({ config });

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
  { params }: { params: { id: string } }
) {
  const transactionID = (await payload.db.beginTransaction()) as string;

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
        `posts/${slug}/${environmentString}display-image-${Date.now()}.jpg`
      );
    }

    if (oldDisplayImageUrl) {
      await deleteFromBlob(oldDisplayImageUrl);
    }

    const cleanContent = sanitizeHtml(content);
    const post = await payload.update({
      collection: "posts",
      id: params.id,
      data: {
        title,
        slug,
        content: cleanContent,
        excerpt,
        displayImageUrl,
      },
      req: { transactionID },
    });

    // Delete existing tag associations
    await payload.delete({
      collection: "postTags",
      where: {
        post_id: { equals: params.id },
      },
      req: { transactionID },
    });

    // Create new tag associations
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

    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
