"use client";
import MultiSelect, { Option } from "@/components/admin/MultiSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/public/Pagination";
import { SearchParams } from "@/lib/SearchParams";
import Link from "next/link";
import { useState } from "react";
import {
  ReadonlyURLSearchParams,
  redirect,
  useSearchParams,
} from "next/navigation";
import { Post, Tag } from "@/db/schema";

const TAGS_QUERY_PARAMETER = "tags";
const PAGE_QUERY_PARAMETER = "page";

const getDefaultSelectedTags = (
  currentSearchParams: ReadonlyURLSearchParams,
  tags: Tag[],
) => {
  const defaultSelectedTags: Option[] = [];
  const searchParams = new SearchParams(currentSearchParams);
  const tagValues = searchParams.getQueryValue(TAGS_QUERY_PARAMETER);

  if (tagValues) {
    tagValues.forEach((id) => {
      const tag = tags.find((t) => t.id === id);
      if (tag) defaultSelectedTags.push({ value: tag.id, label: tag.tagName });
    });
  }
  return defaultSelectedTags;
};

export const InsightsListView = ({
  posts,
  tags,
  hasNext,
  hasPrevious,
}: {
  posts: Post[];
  tags: Tag[];
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  const currentSearchParams = useSearchParams();
  const defaultSelectedTags: Option[] = getDefaultSelectedTags(
    currentSearchParams,
    tags,
  );
  const [selectedTags, setSelectedTags] =
    useState<Option[]>(defaultSelectedTags);

  const searchByTags = () => {
    const urlSearchParams = new SearchParams(currentSearchParams.toString());
    if (selectedTags.length) {
      const tagIds = selectedTags.map((t) => t.value);
      urlSearchParams.setQueryValue(TAGS_QUERY_PARAMETER, tagIds);
    } else {
      urlSearchParams.removeParam(TAGS_QUERY_PARAMETER);
    }
    urlSearchParams.removeParam(PAGE_QUERY_PARAMETER);
    const searchParams = urlSearchParams.getSearchParams();
    const url = searchParams ? `/insights?${searchParams}` : "/insights";
    redirect(url);
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    const urlSearchParams = new SearchParams(currentSearchParams.toString());
    urlSearchParams.removeParam(TAGS_QUERY_PARAMETER);
    urlSearchParams.removeParam(PAGE_QUERY_PARAMETER);
  };

  return (
    <>
      <div className="flex mb-8">
        <MultiSelect
          selected={selectedTags}
          onChange={setSelectedTags}
          options={tags.map((t) => ({ value: t.id, label: t.tagName }))}
          placeholder="Type here..."
          className="mr-4 h-[58px]"
        />
        <div className="flex  gap-4">
          <Button
            className=" bg-flat-gold hover:bg-opacity-75 text-black h-[58px] w-[150px]"
            onClick={searchByTags}
          >
            Search
          </Button>
          <Button
            size="sm"
            onClick={handleClearAll}
            className="p-1 text-xs bg-pure-white/10 backdrop-blur-[10px] hover:bg-pure-white/30 h-[58px] w-[150px]"
            disabled={selectedTags.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      <ul className="mb-8">
        {posts.map(({ id, title, slug, createdAt }) => (
          <li key={id}>
            <Link
              href={`/insights/${slug}`}
              className="text-orange-500 hover:text-orange-700"
            >
              {title}
            </Link>
            {createdAt && (
              <h3 className="text-pure-white">
                This insight was created on {createdAt.toDateString()}
              </h3>
            )}

            <Separator />
          </li>
        ))}
      </ul>
      <Pagination hasNext={hasNext} hasPrevious={hasPrevious} />
    </>
  );
};
