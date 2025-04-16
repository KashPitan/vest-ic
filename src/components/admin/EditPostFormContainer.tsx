import type { AdminViewProps, BasePayload } from "payload";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import { EditPostForm } from "./EditPostForm";
import { downloadFromBlob } from "@/lib/blob";

const getPostFormData = async (id: string, payload: BasePayload) => {
  try {
    const result = await payload.findByID({
      collection: "posts",
      id,
      joins: {
        tags: {},
      },
    });

    const tagIds = result.tags;

    const tagResults = await payload.find({
      collection: "tags",
      where: { id: { in: tagIds } },
      limit: 0,
    });

    const tags = tagResults
      ? tagResults.docs.map((tag) => {
          return {
            value: tag.id,
            label: tag.tag_name,
          };
        })
      : undefined;

    const displayImage = result.displayImageUrl
      ? await downloadFromBlob(result.displayImageUrl)
      : undefined;

    return {
      ...result,
      releaseDate: result.releaseDate ?? undefined,
      displayImage,
      tags,
    };
  } catch (error) {
    console.log(error);
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

  const postFormData = await getPostFormData(id, initPageResult.req.payload);

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
          <EditPostForm post={{ ...postFormData, id }} />
        ) : (
          <p>No Post Found :(</p>
        )}
      </Gutter>
    </DefaultTemplate>
  );
};

export default EditPostFormContainer;
