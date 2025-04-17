import { getPayload } from "payload";
import config from "@payload-config";
import { TagsSchema, TagDropdownOption } from "@/schemas/tagsSchema";

const payload = await getPayload({ config });

export const getTags = async () => {
  const { docs } = await payload.find({
    collection: "tags",
    pagination: false,
  });
  return { data: docs };
};

export const getTagDropdownOptions = async (): Promise<TagDropdownOption[]> => {
  try {
    const { data } = await getTags();
    const tagsData = TagsSchema.parse(data);
    return tagsData.map(({ tag_name, id }) => ({ value: id, label: tag_name }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};
