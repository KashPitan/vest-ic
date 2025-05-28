import { db } from "@/db";
import { highlights, posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql, desc } from "drizzle-orm";

const HIGHLIGHT_LIMIT = 4;

export const getHighlightedPosts = async () => {
  const highlightedPosts = await db
    .select({
      post: posts,
    })
    .from(posts)
    .leftJoin(highlights, eq(posts.id, highlights.postId))
    .limit(HIGHLIGHT_LIMIT);

  if (highlightedPosts.length === 0) return [];

  const highlightedPostIds = highlightedPosts.map((h) => h.post.id);

  // If we don't have enough highlighted posts, get recent posts
  if (highlightedPosts.length < HIGHLIGHT_LIMIT) {
    const recentPostsWithTags = await db
      .select({
        post: posts,
      })
      .from(posts)
      .leftJoin(highlights, eq(posts.id, highlights.postId))
      .limit(HIGHLIGHT_LIMIT - highlightedPosts.length)
      .orderBy(desc(posts.createdAt));

    // Filter out recent posts that are already in highlightedPostsWithTagsIds
    const filteredRecentPostsWithTags = recentPostsWithTags.filter(
      (r) => !highlightedPostIds.includes(r.post.id),
    );

    return [...highlightedPosts, ...filteredRecentPostsWithTags];
  }

  return highlightedPosts;
};

export const isPostHighlighted = async (postId: string) => {
  const highlight = await db
    .select()
    .from(highlights)
    .where(eq(highlights.postId, postId))
    .then((rows) => rows[0]);

  const totalHighlights = await db
    .select({ count: sql<number>`count(*)` })
    .from(highlights);

  return {
    isHighlight: Boolean(highlight),
    canHighlight: totalHighlights[0].count < HIGHLIGHT_LIMIT,
  };
};
