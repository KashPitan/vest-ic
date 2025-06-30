import { db } from "@/db";
import { tags } from "@/db/schema";
import { TagsSchema, TagDropdownOption } from "@/types/schemas/tags";

export const getTags = async () => {
  const allTags = await db.select().from(tags).orderBy(tags.tagName);
  return { data: allTags };
};

export const getTagDropdownOptions = async (): Promise<TagDropdownOption[]> => {
  try {
    const { data } = await getTags();
    const tagsData = TagsSchema.parse(data);
    return tagsData.map(({ tagName, id }) => ({ value: id, label: tagName }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};
