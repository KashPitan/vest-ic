"use client";
import {
    Pagination as ShadCnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PAGE_QUERY_NAME = 'page';

export const Pagination = ({ hasNext, hasPrevious }: { hasNext: boolean, hasPrevious: boolean }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const pageParamNumber = searchParams.get('page') || '1';
    const currentPageNumber = Number.parseInt(pageParamNumber);
    const previousPageNumber = `${currentPageNumber - 1}`;
    const nextPageNumber = `${currentPageNumber + 1}`;
    const createQueryString = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(PAGE_QUERY_NAME, value);
            const href = `${pathname}?${params.toString()}`;
            return href;
        },
        [pathname, searchParams]
    )
    return (
        <ShadCnPagination>
            <PaginationContent>
                {hasPrevious &&
                    <>
                        <PaginationItem>
                            <PaginationPrevious href={createQueryString(previousPageNumber)} />
                        </PaginationItem><PaginationItem>
                            <PaginationLink href={createQueryString(previousPageNumber)}>{previousPageNumber}</PaginationLink>
                        </PaginationItem>
                    </>}
                <PaginationItem>
                    <PaginationLink href={createQueryString(pageParamNumber)} isActive>
                        {pageParamNumber}
                    </PaginationLink>
                </PaginationItem>
                {hasNext &&
                    <>
                        <PaginationItem>
                            <PaginationLink href={createQueryString(nextPageNumber)}>{nextPageNumber}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href={createQueryString(nextPageNumber)} />
                        </PaginationItem>
                    </>}
            </PaginationContent>
        </ShadCnPagination>
    )
}