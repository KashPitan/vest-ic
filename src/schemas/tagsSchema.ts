import { z } from "zod";

export const TagsSchema = z
  .array(z.object({ id: z.number(), tag_name: z.string() }))
  .min(1, "At least one tag is required");
