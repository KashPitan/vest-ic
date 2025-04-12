export interface PaginatedData <D = never> {
    data: D[];
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalDocs: number;
}