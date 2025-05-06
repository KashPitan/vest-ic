import type { CollectionConfig } from "payload";

export const Highlights: CollectionConfig = {
  slug: "highlights",
  fields: [
    {
      name: "post_id",
      type: "relationship",
      relationTo: "posts",
      required: true,
      unique: true,
    },
  ],
};
