import { ReadonlyURLSearchParams } from "next/navigation";

const TAGS_QUERY_PARAMETER = 'tags';
const PAGE_QUERY_PARAMETER = 'page';

export class SearchParams {
    private urlSearchParams: URLSearchParams;

    constructor(searchParams: string | ReadonlyURLSearchParams) {
        this.urlSearchParams = new URLSearchParams(searchParams);
    }

    getTagIds = () => {
        const tagsInUrl = this.urlSearchParams.get(TAGS_QUERY_PARAMETER);
        if (tagsInUrl) return tagsInUrl.split(',').map(id => Number.parseInt(id));
    }

    setTagIds = (tagIds: number[]) => {
        const tagsSearchParamValue = tagIds.join(',');
        this.urlSearchParams.set(TAGS_QUERY_PARAMETER, tagsSearchParamValue);
    }

    removeTags = () => {
        this.urlSearchParams.delete(TAGS_QUERY_PARAMETER);
    }

    resetPage = () => {
        this.urlSearchParams.delete(PAGE_QUERY_PARAMETER);
    }

    getSearchParams = () => this.urlSearchParams.toString();
}