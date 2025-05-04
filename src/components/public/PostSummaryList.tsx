"use client";
import { Post } from "../../../payload-types";
import Link from "next/link";
import { Separator } from "../ui/separator";

type SummaryPost = Omit<Post, 'content'>

export const PostSummaryList = ({ posts }: { posts: SummaryPost[]}) => {
    return (
        <ul>
                        {posts.map(({ id, title, slug, createdAt }) => (
                            <li key={id}>
                                <Link href={`/insights/${slug}`} className="text-orange-500 hover:text-orange-700">{title}</Link>
                                <h3>This insight was created on {createdAt}</h3>
                                <Separator />
                            </li>
                        )
                        )}
                    </ul>
    );
}