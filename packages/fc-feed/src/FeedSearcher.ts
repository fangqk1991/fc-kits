import { DBSpec, DBTools, SQLSearcher } from 'fc-sql'
import { FeedBase } from './FeedBase'
import * as assert from 'assert'

export class FeedSearcher<T extends FeedBase> {
  private readonly _searcher: SQLSearcher
  private readonly _dbSpec: DBSpec
  private readonly _model: { new (): T }

  constructor(modelInstance: T) {
    const dbSpec = modelInstance.dbSpec()
    const searcher = dbSpec.database.searcher()
    searcher.setTable(dbSpec.table)
    searcher.setColumns(dbSpec.cols())
    this._searcher = searcher
    this._dbSpec = dbSpec
    this._model = modelInstance.constructor as { new (): T }
  }

  processor(): SQLSearcher {
    return this._searcher
  }

  /**
   * @deprecated Return model instance is recommended, please use queryOne instead.
   * @description Query single object, return an model instance when retFeed = true
   * @param retFeed
   */
  async querySingle(retFeed = true): Promise<undefined | T | { [p: string]: any }> {
    const items = await this.queryList(0, 1, retFeed)
    if (items.length > 0) {
      return items[0]
    }
    return undefined
  }

  /**
   * @deprecated Return model instance is recommended, please use queryAllFeeds instead.
   * @param retFeed {boolean}
   */
  async queryAll(retFeed: boolean = false): Promise<({ [p: string]: any } | T)[]> {
    return this.queryList(-1, -1, retFeed)
  }

  /**
   * @deprecated Return model instance is recommended, please use queryListWithPageInfo instead.
   * @param page {number}
   * @param length {number}
   * @param retFeed {boolean}
   */
  async queryList(page: number, length: number, retFeed: boolean = false): Promise<({ [p: string]: any } | T)[]> {
    this._searcher.setPageInfo(page, length)
    const items = await this._searcher.queryList()
    return this.formatList(items, retFeed)
  }

  formatList(items: {}[], retFeed = false): ({ [p: string]: any } | T)[] {
    return items.map((dic: {}): { [p: string]: any } | T => {
      const obj = new this._model()
      obj.fc_generate(dic)
      return retFeed ? obj : obj.fc_encode()
    })
  }

  /**
   * @description Return record count.
   */
  async queryCount(): Promise<number> {
    return this._searcher.queryCount()
  }

  /**
   * @description Return a model instance.
   */
  async queryOne(): Promise<undefined | T> {
    const items = await this.queryListWithLimitInfo(0, 1)
    if (items.length > 0) {
      return items[0]
    }
    return undefined
  }

  /**
   * @description Return model list, pass page index and lengthPerPage to build limit info, page's first index is 0.
   * @param page {number}
   * @param lengthPerPage {number}
   */
  async queryListWithPageInfo(page: number, lengthPerPage: number): Promise<T[]> {
    this._searcher.setPageInfo(page, lengthPerPage)
    const items = await this._searcher.queryList()
    return this.formatList(items, true) as T[]
  }

  /**
   * @description Return model list, pass offset and length to build limit info.
   * @param offset {number}
   * @param length {number}
   */
  async queryListWithLimitInfo(offset: number, length: number): Promise<T[]> {
    this._searcher.setLimitInfo(offset, length)
    const items = await this._searcher.queryList()
    return this.formatList(items, true) as T[]
  }

  /**
   * @description Return model list
   */
  async queryAllFeeds(): Promise<T[]> {
    const items = await this._searcher.queryList()
    return this.formatList(items, true) as T[]
  }

  /**
   * @description Return model list
   */
  async queryFeeds(): Promise<T[]> {
    const items = await this._searcher.queryList()
    return this.formatList(items, true) as T[]
  }

  /**
   * @deprecated Use FeedBase.prepareOne instead.
   * @description Like findWithParams, but it will throw an error if object does not exist.
   */
  async prepareWithParams(params: {}): Promise<T> {
    const obj = await this.findWithParams(params)
    assert.ok(!!obj, `${this.constructor.name}: object not found.`)
    return obj as T
  }

  /**
   * @deprecated Use FeedBase.findOne instead.
   * @description Find model with { key => value } conditions, and return first object. "checkPrimaryKey = true" means it will check the primaryKeys defined in protocol.
   * @param params
   */
  async findWithParams(params: {}): Promise<T | undefined> {
    const tools = new DBTools(this._dbSpec)
    const data = await tools.makeSearcher(params).querySingle()
    if (data) {
      const obj = new this._model()
      obj.fc_generate(data)
      return obj
    }
    return undefined
  }

  /**
   * @deprecated Use FeedBase.prepareWithUid instead.
   * @description Like findWithUID, but it will throw an error if object does not exist.
   * @param uid {string | number}
   */
  async prepareWithUid(uid: string | number): Promise<T> {
    const obj = await this.findWithUID(uid)
    assert.ok(!!obj, `${this.constructor.name}: object not found.`)
    return obj as T
  }

  /**
   * @deprecated Use FeedBase.findWithUID instead.
   * @description Find Model which single-primary-key
   * @param uid {string | number}
   */
  async findWithUID(uid: string | number): Promise<T | undefined> {
    assert.ok(this._dbSpec.primaryKeys().length === 1, 'PrimaryKey must be single item in this case.')
    const params: { [p: string]: any } = {}
    params[this._dbSpec.primaryKey] = uid
    return this.findWithParams(params)
  }

  async checkExists(params: { [p: string]: any } | string | number): Promise<boolean> {
    if (typeof params !== 'object') {
      assert.ok(this._dbSpec.primaryKeys().length === 1, 'PrimaryKey must be single item in this case.')
      const uid = params
      const params1: { [p: string]: any } = {}
      params1[this._dbSpec.primaryKey] = uid
      params = params1
    }
    const tools = new DBTools(this._dbSpec)
    return (await tools.makeSearcher(params).queryCount()) > 0
  }
}
