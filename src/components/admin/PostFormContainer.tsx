import type { AdminViewProps } from "payload";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import React from "react";
import { CreatePostForm } from "./PostForm";
import { getTagDropdownOptions } from "@/data-access-layer/tags";

export const PostFormContainer: React.FC<AdminViewProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const tagOptions = await getTagDropdownOptions();
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
        <CreatePostForm tagOptions={tagOptions} />
      </Gutter>
    </DefaultTemplate>
  );
};

export default PostFormContainer;
