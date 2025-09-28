export interface QueryOptions<T = {}> {
  queryParams: T
  setQueryParams: (params: Partial<T>) => void
  updateQueryParams: (params: Partial<T>, replace?: boolean) => void
}
