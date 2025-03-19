import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  fields: [
    {
      name: "tag_name",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};
