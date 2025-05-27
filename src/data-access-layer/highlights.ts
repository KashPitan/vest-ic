import { db } from "@/db";
import {
  highlights,
  posts,
  postTags as postTagsSchema,
  tags as tagsSchema,
} from "@/db/schema";
import { eq, notInArray } from "drizzle-orm";
import { sql, desc } from "drizzle-orm";

const HIGHLIGHT_LIMIT = 4;

export const getHighlightedPosts = async () => {
  // Get all highlights with their posts
  const docs = await db
    .select({
      highlight: highlights,
      post: posts,
    })
    .from(highlights)
    .innerJoin(posts, eq(highlights.postId, posts.id))
    .limit(HIGHLIGHT_LIMIT);

  if (docs.length === 0) return [];

  // Map to match the previous structure (with tags)
  const highlightedPostsWithTags = await Promise.all(
    docs.map(async ({ highlight, post }) => {
      // Use a drizzle select query to get tags for the post
      const postTags = await db
        .select()
        .from(posts)
        .where(eq(posts.id, post.id))
        .leftJoin(postTagsSchema, eq(posts.id, postTagsSchema.postId))
        .leftJoin(tagsSchema, eq(postTagsSchema.tagId, tagsSchema.id));

      // Extract tags from the join result
      const tags =
        postTags.filter((row) => row.tags).map((row) => row.tags) ?? [];

      return {
        ...highlight,
        post: {
          ...post,
          tags,
        },
      };
    }),
  );

  const highlightedPosts = highlightedPostsWithTags;

  const postIds = highlightedPosts.map((h) => h.postId);

  // If we don't have enough highlighted posts, get recent posts
  if (highlightedPosts.length < HIGHLIGHT_LIMIT) {
    const recentPosts = await db
      .select()
      .from(posts)
      .where(notInArray(posts.id, postIds))
      .leftJoin(tagsSchema, eq(posts.id, postTagsSchema.postId))
      .limit(HIGHLIGHT_LIMIT - highlightedPosts.length)
      .orderBy(desc(posts.createdAt));

    return [...highlightedPosts.map((h) => h.post), ...recentPosts];
  }

  return highlightedPosts.map((h) => h.post);
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
