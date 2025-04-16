import { getPayload, Where } from "payload";
import config from "@payload-config";
import { PaginatedData } from "@/types/PaginatedData";
import { Post } from "../../payload-types";
import { z } from "zod";

interface SearchParams {
  page?: number;
  sort?: string;
  tags?: string;
}

const payload = await getPayload({ config });

const PAGE_LIMIT = 3;

const SearchParamsSchema = z.object({
  page: z.coerce.number().min(1, "Page must be non zero").optional(),
  tags: z.string().optional(),
});

export const getPosts = async (searchParams?: SearchParams) => {
  const { tags, page } = SearchParamsSchema.parse(searchParams || {});
  const where: Where = {};
  if (tags) {
    const tagIds = tags.split(",");
    const tagsQuery = {
      in: tagIds,
    };
    const { docs, hasNextPage, hasPrevPage, totalDocs } = await payload.find({
      collection: "postTags",
      limit: PAGE_LIMIT,
      where: {
        tag_id: tagsQuery,
      },
      select: {
        post_id: true,
      },
      page,
      depth: 1,
    });
    const posts = docs.map((d) => d.post_id as Post);
    const postIds = posts.map((p) => p.id);
    const distinctPostsIds = new Set(postIds);
    const data: Post[] = [];
    distinctPostsIds.forEach((postId) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        data.push(post);
      }
    });
    const response: PaginatedData<Post> = {
      data,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      totalDocs: totalDocs,
    };
    return response;
  }
  const { docs, hasNextPage, hasPrevPage, totalDocs } = await payload.find({
    collection: "posts",
    limit: PAGE_LIMIT,
    sort: "-createdAt", // are these automatically indexed?
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    },
    page,
  });
  const response: PaginatedData<Post> = {
    data: docs,
    hasNextPage: hasNextPage,
    hasPrevPage: hasPrevPage,
    totalDocs: totalDocs,
  };
  return response;
};
