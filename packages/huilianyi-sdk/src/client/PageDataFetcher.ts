import assert from '@fangcha/assert'

export class PageDataFetcher {
  public static async fetchAllPageItems<T>(handler: (params: { page: number; size: number }) => Promise<T[]>) {
    let items: T[] = []
    let finished = false
    let page = 1
    while (!finished) {
      const pageItems = await handler({
        startDate: '2020-01-01 00:00:00',
        endDate: '2040-12-31 00:00:00',
        page: page,
        size: 100,
      })
      assert.ok(Array.isArray(pageItems), `fetchAllPageItems' handler response error`, 500)
      items = items.concat(pageItems || [])
      if (pageItems.length === 0) {
        finished = true
      } else {
        ++page
      }
    }
    return items
  }

  public static async fetchAllPageItemsV2<T>(
    handler: (params: {
      page: number
      size: number
      lastModifyStartDate: string
      lastModifyEndDate: string
    }) => Promise<T[]>
  ) {
    let items: T[] = []
    let finished = false
    let page = 1
    while (!finished) {
      const pageItems = await handler({
        lastModifyStartDate: '2020-01-01 00:00:00',
        lastModifyEndDate: '2040-12-31 00:00:00',
        page: page,
        size: 100,
      })
      assert.ok(Array.isArray(pageItems), `fetchAllPageItems' handler response error`, 500)
      items = items.concat(pageItems || [])
      if (pageItems.length === 0) {
        finished = true
      } else {
        ++page
      }
    }
    return items
  }
}
