export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginatedDto<TData> {
  items: TData[];
  meta: PaginationMeta;
}
