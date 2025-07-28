import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { downloadFromBlob } from "@/lib/blob";
import type { PostTag, Tag } from "@/db/schema";
import { isAdmin } from "@/lib/validateRequest";

interface TagOption {
  value: string;
  label: string;
}

interface PostFormData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  releaseDate?: string;
  displayImageUrl?: string;
  displayImage?: string;
  tags?: TagOption[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await isAdmin();
    // get post with all tags
    const result = await db.query.posts.findFirst({
      with: {
        postTags: {
          with: {
            tag: true,
          },
        },
      },
      where: eq(posts.id, id),
    });

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const tagOptions: TagOption[] = (result.postTags ?? []).map(
      (postTag: PostTag & { tag?: Tag }) => {
        return {
          value: postTag.tag?.id ?? "",
          label: postTag.tag?.tagName ?? "",
        };
      },
    );

    const displayImage = result.displayImageUrl
      ? await downloadFromBlob(result.displayImageUrl)
      : undefined;

    const postFormData: PostFormData = {
      ...result,
      releaseDate: result.releaseDate?.toISOString(),
      displayImageUrl: result.displayImageUrl ?? undefined,
      displayImage,
      tags: tagOptions,
    };

    return NextResponse.json(postFormData);
  } catch (error) {
    console.error("Error fetching post form data:", error);
    return NextResponse.json(
      { error: "Failed to fetch post data" },
      { status: 500 },
    );
  }
}
