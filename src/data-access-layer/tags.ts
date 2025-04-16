import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

export const getTags = async () => {
  const { docs } = await payload.find({
    collection: "tags",
    pagination: false,
  });
  return { data: docs };
};
