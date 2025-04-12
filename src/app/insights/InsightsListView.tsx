"use client";
import MultiSelect from "@/components/admin/MultiSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/public/Pagination";
import Link from "next/link";
import { useState } from "react";
import { Post, Tag } from "../../../payload-types";
import { redirect, useSearchParams } from "next/navigation";

export const InsightsListView = ({ posts, tags, hasNext, hasPrevious }: { posts: Post[], tags: Tag[], hasNext: boolean, hasPrevious: boolean}) => {
    const [selectedTags, setSelectedTags] = useState<{ value: number,label: string}[]>([]);
    const currentSearchParams = useSearchParams()
    const searchByTags = () => {
        const urlSearchParams = new URLSearchParams(currentSearchParams.toString());
        if (selectedTags.length) {
            const tagsSearchParamValue = selectedTags.map((t) => t.value).join(',');
            urlSearchParams.set('tags', tagsSearchParamValue);
        } else {
            urlSearchParams.delete('tags');
        }
        const searchParams = urlSearchParams.toString();
        const url = searchParams ? `/insights?${searchParams}` : '/insights';
        redirect(url);
    }
    return (
        <>
            <MultiSelect selected={selectedTags} onChange={setSelectedTags} options={tags.map((t) => ({ value: t.id, label: t.tag_name}))} placeholder="Search by tags" />
            <Button onClick={searchByTags}>Search by Tag</Button>
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
            <Pagination hasNext={hasNext} hasPrevious={hasPrevious} />
        </>
    )
}