import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "content",
      type: "text",
      required: true,
    },
    {
      name: "excerpt",
      type: "text",
      required: true,
    },
    {
      name: "releaseDate",
      type: "date",
    },
    {
      name: "displayImageUrl",
      type: "text",
      required: false,
    },
    {
      type: "join",
      on: "post_id",
      collection: "postTags",
      name: "tags",
    },
  ],
};
