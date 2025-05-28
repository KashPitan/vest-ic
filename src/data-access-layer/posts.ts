import { db } from "@/db";
import { posts, postTags } from "@/db/schema";
import { Post } from "@/db/schema";
import { z } from "zod";
import { inArray, sql, eq, desc } from "drizzle-orm";
import { PaginatedData } from "@/types";

interface SearchParams {
  page?: number;
  sort?: string;
  tags?: string;
}

const PAGE_LIMIT = 3;

const SearchParamsSchema = z.object({
  page: z.coerce.number().min(1, "Page must be non zero").optional(),
  tags: z.string().optional(),
});

export const getPosts = async (searchParams?: SearchParams) => {
  const { tags: tagIds, page = 1 } = SearchParamsSchema.parse(
    searchParams || {},
  );
  const offset = (page - 1) * PAGE_LIMIT;

  if (tagIds) {
    const tagIdArray = tagIds.split(",");

    const postsWithTags = await db
      .select()
      .from(posts)
      .leftJoin(postTags, eq(posts.id, postTags.postId))
      .where(inArray(postTags.tagId, tagIdArray))
      .limit(PAGE_LIMIT)
      .offset(offset);

    const postsData = postsWithTags.map((d) => d.posts);
    const postIds = postsWithTags.map((p) => p.posts.id);
    const distinctPostsIds = new Set(postIds);

    const data: Post[] = [];
    distinctPostsIds.forEach((postId) => {
      const post = postsData.find((p) => p.id === postId);
      if (post) {
        data.push(post);
      }
    });

    const response: PaginatedData<Post> = {
      data,
      hasNextPage: offset + PAGE_LIMIT < data.length,
      hasPrevPage: page > 1,
      totalDocs: data.length,
    };
    return response;
  }

  // Get all posts
  const allPosts = await db
    .select()
    .from(posts)
    .limit(PAGE_LIMIT)
    .offset(offset)
    .orderBy(desc(posts.createdAt));

  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts);

  const response: PaginatedData<Post> = {
    data: allPosts,
    hasNextPage: offset + PAGE_LIMIT < totalCount[0].count,
    hasPrevPage: page > 1,
    totalDocs: totalCount[0].count,
  };
  return response;
};
