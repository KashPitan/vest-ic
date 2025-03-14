import { z } from "zod";

export const TagsSchema = z
  .array(z.object({ value: z.string(), label: z.string() }))
  .min(1, "At least one tag is required");
