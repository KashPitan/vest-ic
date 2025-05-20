import type { AdminViewProps, BasePayload } from "payload";

import { Gutter } from "@payloadcms/ui";
import React from "react";
import { EditPostForm } from "./EditPostForm";
import { downloadFromBlob } from "@/lib/blob";
import { getTagDropdownOptions } from "@/data-access-layer/tags";
import { isPostHighlighted } from "@/data-access-layer/highlights";
import { CreatePostForm } from "./PostForm";

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
      displayImageUrl: result.displayImageUrl ?? undefined,
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
}) => {
  const tagOptions = await getTagDropdownOptions();
  const id = params?.segments?.at(-1) || '';
  if (isNaN(+id)) {
    return (
      <Gutter>
          <CreatePostForm tagOptions={tagOptions} />
        </Gutter>
    )
  }
  const postFormData = await getPostFormData(id, initPageResult.req.payload);
  
  const highLightOptions = await isPostHighlighted(id)

  return (
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
  );
};

export default EditPostFormContainer;
