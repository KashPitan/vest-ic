import type { CollectionConfig } from "payload";

export const PostTags: CollectionConfig = {
  slug: "postTags",
  fields: [
    {
      name: "post_id",
      type: "relationship",
      relationTo: "posts",
    },
    {
      name: "tag_id",
      type: "relationship",
      relationTo: "tags",
    },
  ],
};
