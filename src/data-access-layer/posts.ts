import { getPayload } from "payload";
import config from "@payload-config";
import { PaginatedData } from "@/types/PaginatedData";
import { Post } from "../../payload-types";

interface SearchParams {
    page?: number;
    sort?: string;
    tags?: string;
}

const payload = await getPayload({ config });

const PAGE_LIMIT = 10;

export const getPosts = async (searchParams?: SearchParams) => {
    if (searchParams?.tags) {
        const tagIds = searchParams.tags.split(',');
        const tagsQuery = {
            in: tagIds
        }
        const { docs, hasNextPage, hasPrevPage, totalDocs } = await payload.find({
            collection: 'postTags',
            limit: PAGE_LIMIT,
            where: {
                tag_id: tagsQuery
            },
            select: {
                post_id: true
            },
            // page: nextPage,
            depth: 1
        });
        const data = docs.map((d) => d.post_id as Post);
        const response: PaginatedData<Post> = { data, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage, totalDocs: totalDocs }
        return response;
    }
    const whereQuery = {};
    const { docs, hasNextPage, hasPrevPage, totalDocs } = await payload.find({
        collection: 'posts',
        limit: PAGE_LIMIT,
        sort: '-createdAt', // are these automatically indexed?
        where: whereQuery,
        select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true
        },
        page: searchParams?.page
    });
    const response: PaginatedData<Post> = { data: docs, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage, totalDocs: totalDocs }
    return response;
}