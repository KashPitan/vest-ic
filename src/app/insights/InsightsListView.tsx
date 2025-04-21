"use client";
import MultiSelect, { Option } from "@/components/admin/MultiSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/public/Pagination";
import { SearchParams } from "@/lib/SearchParams";
import Link from "next/link";
import { useState } from "react";
import { Post, Tag } from "../../../payload-types";
import {
  ReadonlyURLSearchParams,
  redirect,
  useSearchParams,
} from "next/navigation";

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
    const tagIds = tagValues.map((id) => Number.parseInt(id));
    tagIds.forEach((id) => {
      const tag = tags.find((t) => t.id === id);
      if (tag) defaultSelectedTags.push({ value: tag.id, label: tag.tag_name });
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
  return (
    <>
      <MultiSelect
        selected={selectedTags}
        onChange={setSelectedTags}
        options={tags.map((t) => ({ value: t.id, label: t.tag_name }))}
        placeholder="Search by tags"
        className="text-pure-white"
      />
      <Button className="mb-8" onClick={searchByTags}>
        Search by Tag
      </Button>
      <ul>
        {posts.map(({ id, title, slug, createdAt }) => (
          <li key={id}>
            <Link
              href={`/insights/${slug}`}
              className="text-orange-500 hover:text-orange-700"
            >
              {title}
            </Link>
            <h3 className="text-pure-white">
              This insight was created on {createdAt}
            </h3>
            <Separator />
          </li>
        ))}
      </ul>
      <Pagination hasNext={hasNext} hasPrevious={hasPrevious} />
    </>
  );
};
