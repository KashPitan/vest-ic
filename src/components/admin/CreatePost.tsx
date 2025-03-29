import type { AdminViewProps, BasePayload } from "payload";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import CreatePostForm from "./CreatePostForm";
import { Tag } from "../../../payload-types";

const getPostFormData = async (id: string, payload: BasePayload) => {
  const postData = await payload.findByID({
    collection: 'posts',
    id,
  });
  const postTagsData = await payload.find({
    collection: 'postTags',
    where: {
      post_id: { equals: id }
    },
    select: {
      tag_id: true
    },
    depth: 1
  });
  const tags = postTagsData.docs.map((pT) => {
    const tag = pT.tag_id as Tag;
    return {
      value: tag.id,
      label: tag.tag_name
    }
  });
  return {
    ...postData,
    tags
  }
}

export const CreatePost: React.FC<AdminViewProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const id = params?.segments?.[1];
  const postFormData = id ? await getPostFormData(id, initPageResult.req.payload) : null;
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
        <CreatePostForm post={postFormData} />
      </Gutter>
    </DefaultTemplate>
  );
};

export default CreatePost;
