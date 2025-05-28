export type Tag = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  tagName: string;
};

export interface PaginatedData<D = never> {
  data: D[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalDocs: number;
}
