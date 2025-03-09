import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "slug",
      type: "text",
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "excerpt",
      type: "text",
    },
  ],
};
