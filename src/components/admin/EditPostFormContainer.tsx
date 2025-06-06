import type { AdminViewProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import { EditPostForm } from "./EditPostForm";
import { downloadFromBlob } from "@/lib/blob";
import { getTagDropdownOptions } from "@/data-access-layer/tags";
import { isPostHighlighted } from "@/data-access-layer/highlights";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { PostTag, Tag } from "@/db/schema";

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

const getPostFormData = async (
  id: string,
): Promise<PostFormData | undefined> => {
  try {
    // get post with all tags (the type doesn't include the tag object for some reason)
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
      return undefined;
    }

    const tagOptions: TagOption[] = (result.postTags ?? []).map(
      // explicitly typing the tag here, it will always be defined
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

    return {
      ...result,
      releaseDate: result.releaseDate?.toISOString(),
      displayImageUrl: result.displayImageUrl ?? undefined,
      displayImage,
      tags: tagOptions,
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const EditPostFormContainer: React.FC<AdminViewProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const id = params?.segments?.[1];
  if (!id) {
    throw new Error("Post ID is required");
  }

  const postFormData = await getPostFormData(id);
  const tagOptions = await getTagDropdownOptions();
  const highLightOptions = await isPostHighlighted(id);

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        {postFormData ? (
          <EditPostForm
            post={{ ...postFormData, id }}
            tagOptions={tagOptions}
            highLightOptions={highLightOptions}
          />
        ) : (
          <p>No Post Found :(</p>
        )}
      </Gutter>
    </DefaultTemplate>
  );
};

export default EditPostFormContainer;
