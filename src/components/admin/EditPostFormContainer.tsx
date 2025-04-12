import type { AdminViewProps, BasePayload } from "payload";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import PostForm from "./PostForm";
import { Tag } from "../../../payload-types";

const getPostFormData = async (id: string, payload: BasePayload) => {
  try {
    const postData = await payload.findByID({
      collection: "posts",
      id,
    });

    const result = await payload.find({
      collection: "posts",
      where: {
        id: {
          equals: id,
        },
      },
      joins: {
        // postTags: {
        //   limit: 5,
        //   where: {
        //     title: {
        //       equals: "My Post",
        //     },
        //   },
        //   sort: "title",
        // },
      },
    });

    console.log(result);

    const postTagsData = await payload.find({
      collection: "postTags",
      where: {
        post_id: { equals: id },
      },
      select: {
        tag_id: true,
      },
      depth: 1,
    });
    const tags = postTagsData.docs.map((pT) => {
      const tag = pT.tag_id as Tag;
      return {
        value: tag.id,
        label: tag.tag_name,
      };
    });
    return {
      ...postData,
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
        <PostForm post={postFormData} isEdit={true} />
      </Gutter>
    </DefaultTemplate>
  );
};

export default EditPostFormContainer;
