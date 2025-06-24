import { z } from "zod";

export const TagsSchema = z
  .array(
    z.object({
      id: z.string().uuid(),
      tagName: z.string(),
      category: z.string(),
    }),
  )
  .min(1, "At least one tag is required");

export type TagDropdownOption = {
  value: string;
  label: string;
};

export const CATEGORIES = ["Cat1", "Cat2", "Cat3", "Cat4"];
export const categorySchema = z.enum(["Cat1", "Cat2", "Cat3", "Cat4"]);
export type Category = z.infer<typeof categorySchema>;
