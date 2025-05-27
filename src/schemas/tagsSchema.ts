import { z } from "zod";

export const TagsSchema = z
  .array(z.object({ id: z.string().uuid(), tagName: z.string() }))
  .min(1, "At least one tag is required");

export type TagDropdownOption = {
  value: string;
  label: string;
};
