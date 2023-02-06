import * as assert from 'assert'
import { FeedBase } from './FeedBase'
import { FeedSearcher } from './FeedSearcher'

interface Params<T extends FeedBase> {
  searcher: (offset: number, length: number) => FeedSearcher<T>
  onBulkFeedsFetched: (pageData: PageResult<T>) => Promise<void>
  chunkSize?: number
}

interface PageResult<T = any> {
  // 偏移量
  offset: number
  // 当前结果数据（items）长度
  length: number
  // 满足请求筛选条件的数据总长度
  totalCount: number
  // 返回数据实体
  items: T[]
}

export class BulkFeedsHandler<T extends FeedBase> {
  private readonly _params: Params<T>

  public constructor(params: Params<T>) {
    params.chunkSize = params.chunkSize || 10000
    assert.ok(params.chunkSize > 0, 'chunkSize should > 0')
    this._params = params
  }

  public async execute() {
    let offset = 0
    const length = this._params.chunkSize || 10000

    let finished = false
    while (!finished) {
      const searcher = this._params.searcher(offset, length)
      const items = await searcher.queryAllFeeds()
      if (items.length < length) {
        finished = true
      }
      await this._params.onBulkFeedsFetched({
        items: items,
        offset: offset,
        length: items.length,
        totalCount: await searcher.queryCount(),
      })
      offset += length
    }
  }
}
