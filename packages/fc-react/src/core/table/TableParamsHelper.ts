export interface TablePageOptions {
  pageNumber?: number
  pageSize?: number
  sortKey?: string
  sortDirection?: 'ascend' | 'descend' | 'ascending' | 'descending' | ''
}

export interface TableDataParams {
  _offset: number
  _length: number
  _sortKey: string
  _sortDirection: string
}

export class TableParamsHelper {
  public static extractPageDataParams(realSettings: TablePageOptions) {
    const pageNumber = realSettings.pageNumber
    const pageSize = realSettings.pageSize
    const params: Partial<TableDataParams> = {}
    if (pageNumber && pageSize) {
      params._offset = (pageNumber - 1) * pageSize
    }
    if (pageSize) {
      params._length = pageSize
    }
    if (realSettings.sortKey) {
      params._sortKey = realSettings.sortKey
      params._sortDirection = realSettings.sortDirection
    }
    if (params._sortDirection) {
      if (['ascend', 'descend'].includes(params._sortDirection)) {
        params._sortDirection = `${params._sortDirection}ing`
      }
    }
    return params
  }

  public static transferQueryParams(queryParams: {}) {
    const pageNumber = queryParams['pageNumber']
    const pageSize = queryParams['pageSize']
    const params: Partial<TableDataParams> = {}
    if (pageNumber && pageSize) {
      params._offset = (pageNumber - 1) * pageSize
    }
    if (pageSize) {
      params._length = pageSize
    }
    if (queryParams['sortKey']) {
      params._sortKey = queryParams['sortKey']
      params._sortDirection = queryParams['sortDirection']
    }
    if (params._sortDirection) {
      if (['ascend', 'descend'].includes(params._sortDirection)) {
        params._sortDirection = `${params._sortDirection}ing`
      }
    }
    return {
      ...queryParams,
      ...params,
    }
  }
}
