import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

const HIGHLIGHT_LIMIT = 4;

export const getHighlightedPosts = async () => {
  const { docs } = await payload.find({
    collection: "highlights",
    limit: HIGHLIGHT_LIMIT,
    depth: 0,
  });
  const postIds = docs.map((d) => d.post_id);

  const { docs: highlightedPosts } = await payload.find({
    collection: "posts",
    where: {
      id: {
        in: postIds,
      },
    },
    select: {
      content: false,
    },
  });
  if (highlightedPosts.length < HIGHLIGHT_LIMIT) {
    const { docs: mostRecentPosts } = await payload.find({
      collection: "posts",
      where: {
        id: {
          not_in: postIds,
        },
      },
      sort: "-createdAt",
      select: {
        content: false,
      },
      limit: HIGHLIGHT_LIMIT - highlightedPosts.length,
    });
    const posts = highlightedPosts.concat(mostRecentPosts);
    return posts;
  }
  return highlightedPosts;
};

export const isPostHighlighted = async (id: string) => {
  const highlight = await payload.findByID({
    collection: "highlights",
    id,
    disableErrors: true,
  });
  const { totalDocs } = await payload.count({
    collection: "highlights",
  });
  return {
    isHighlight: Boolean(highlight),
    canHighlight: Boolean(totalDocs < HIGHLIGHT_LIMIT),
  };
};
