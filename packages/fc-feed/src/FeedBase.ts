import { DBProtocolV2, DBSpec, DBTools, SQLSearcher, Transaction } from 'fc-sql'
import { FCModel } from 'fc-model'
import { FeedSearcher } from './FeedSearcher'
import * as assert from 'assert'
import { SearcherTools } from './SearcherTools'

interface PageDataV3<T> {
  // 偏移量
  offset: number
  // 当前结果数据（items）长度
  length: number
  // 满足请求筛选条件的数据总长度
  totalCount: number
  // 返回数据实体
  items: T[]
}

interface MapProtocol {
  [p: string]: any
}

export interface DBObserver {
  onAdd(newFeed: FeedBase): Promise<void>
  onUpdate(newFeed: FeedBase, changedMap: any, oldData?: any): Promise<void>
  onDelete(oldFeed: FeedBase): Promise<void>
}

export interface FilterOptions {
  _sortKey?: string
  _sortDirection?: string
  _offset?: number
  _length?: number
  [p: string]: any
}

interface Params {
  [p: string]: number | string
}

export class FeedBase extends FCModel {
  protected _dataBackup: { [p: string]: any } | null = null
  protected _reloadOnAdded = false
  protected _reloadOnUpdated = false
  public dbObserver?: DBObserver

  constructor() {
    super()
  }

  private updateAutoIncrementInfo(lastInsertId: number) {
    const dbSpec = this.dbSpec()
    if (lastInsertId > 0 && dbSpec.primaryKeys().length === 1) {
      const mapper = this.fc_propertyMapper()
      for (const propertyKey in mapper) {
        if (mapper[propertyKey] === dbSpec.primaryKey) {
          const _this = this as any
          if (_this[propertyKey] === null || _this[propertyKey] === undefined) {
            _this[propertyKey] = lastInsertId
          }
          break
        }
      }
    }
  }

  private _dbSpec!: DBSpec
  private _dbProtocolV2!: DBProtocolV2

  setDBProtocolV2(protocol: DBProtocolV2) {
    this._dbProtocolV2 = protocol
    this._dbSpec = new DBSpec(this._dbProtocolV2)
  }

  updateDBProtocolV2(extras: Partial<DBProtocolV2>) {
    this._dbProtocolV2 = Object.assign({}, this._dbProtocolV2, extras)
    this._dbSpec = new DBSpec(this._dbProtocolV2)
  }

  dbSpec(): DBSpec {
    if (!this._dbSpec) {
      assert.ok(!!this._dbProtocolV2, '_dbProtocolV2 must be not empty')
      this._dbSpec = new DBSpec(this._dbProtocolV2)
    }
    return this._dbSpec
  }

  /**
   * @description Return primary-key, when th db-protocol has multi-primary-keys, method will use ',' join the keys then return.
   */
  fc_uidStr(): string {
    const data = this.fc_encode()
    const dbSpec = this.dbSpec()
    return dbSpec
      .primaryKeys()
      .map((key: string): string => `${data[key]}`)
      .join(',')
  }

  /**
   * @deprecated Use addToDB instead
   * @description Insert model data to database.
   */
  async fc_add() {
    await this.addToDB()
  }

  /**
   * @description Use the editing mode
   */
  fc_edit(): void {
    this._dataBackup = this.fc_encode()
  }

  _checkKeyChanged(key: string): boolean {
    if (this._dataBackup) {
      const propertyMap = this.fc_propertyMapper()
      for (const p in propertyMap) {
        const k = propertyMap[p]
        if (key === k) {
          if (this._dataBackup[key] && this._dataBackup[key] !== (this as MapProtocol)[k]) {
            return true
          }
          break
        }
      }
    }
    return false
  }

  /**
   * @deprecated Use updateToDB instead.
   * @description Must use fc_edit before fc_update, changes in editing mode will be pass to database, (Should match primary key).
   */
  async fc_update(options: { [p: string]: any } = {}) {
    assert.ok(!!this._dataBackup, 'You must use fc_edit before fc_update!')

    const propertyMap = this.fc_propertyMapper()
    for (const property in propertyMap) {
      const jsonKey = propertyMap[property]
      if (jsonKey in options) {
        ;(this as MapProtocol)[property] = options[jsonKey]
      }
    }
    return this.updateToDB()
  }

  /**
   * @deprecated Use deleteFromDB instead.
   * @description Delete record in database, (Should match primary key).
   */
  async fc_delete(): Promise<void> {
    await this.deleteFromDB()
  }

  public async addToDB(transaction?: Transaction) {
    const data = this.fc_encode()
    const tools = new DBTools(this.dbSpec(), transaction)
    const performer = tools.makeAdder(data)
    const lastInsertId = await performer.execute()
    this.updateAutoIncrementInfo(lastInsertId)
    if (this._reloadOnAdded) {
      await this.reloadDataFromDB(transaction)
    }
    if (this.dbObserver) {
      await this.dbObserver.onAdd(this)
    }
  }

  public async strongAddToDB(transaction?: Transaction) {
    const data = this.fc_encode()
    const tools = new DBTools(this.dbSpec(), transaction)
    await tools.strongAdd(data)
    if (this._reloadOnAdded) {
      await this.reloadDataFromDB(transaction)
    }
    if (this.dbObserver) {
      await this.dbObserver.onAdd(this)
    }
  }

  public async weakAddToDB(transaction?: Transaction) {
    const data = this.fc_encode()
    const tools = new DBTools(this.dbSpec(), transaction)
    await tools.weakAdd(data)
    if (this._reloadOnAdded) {
      await this.reloadDataFromDB(transaction)
    }
    if (this.dbObserver) {
      await this.dbObserver.onAdd(this)
    }
  }

  public async updateToDB(transaction?: Transaction) {
    assert.ok(!!this._dataBackup, 'You must use fc_edit before fc_update!')

    const dataBackup = this._dataBackup as { [p: string]: any }
    const data = this.fc_encode()
    const params: { [p: string]: any } = {}
    const editedMap: { [p: string]: any } = {}

    for (const key of Object.keys(data)) {
      const value = data[key]
      if (!(key in dataBackup)) {
        continue
      }
      if (dataBackup[key] === value) {
        continue
      }

      params[key] = value
      editedMap[key] = {
        before: dataBackup[key],
        after: value,
      }
    }

    const dbSpec = this.dbSpec()
    dbSpec.primaryKeys().forEach((key: string): void => {
      params[key] = data[key]
    })
    const tools = new DBTools(dbSpec, transaction)
    const performer = tools.makeModifier(params)
    await performer.execute()
    if (this._reloadOnUpdated) {
      await this.reloadDataFromDB(transaction)
    }
    if (this.dbObserver) {
      await this.dbObserver.onUpdate(this, editedMap, this._dataBackup)
    }
    this._dataBackup = null
    return editedMap
  }

  public async deleteFromDB(transaction?: Transaction) {
    const data = this.fc_encode()
    const tools = new DBTools(this.dbSpec(), transaction)
    const performer = tools.makeRemover(data)
    await performer.execute()
    if (this.dbObserver) {
      await this.dbObserver.onDelete(this)
    }
  }

  /**
   * @description Return a FeedSearcher for current model class.
   * @param params
   */
  fc_searcher(params: FilterOptions = {}) {
    const searcher = new FeedSearcher(this)
    const dbSpec = this.dbSpec()
    SearcherTools.injectConditions(searcher.processor(), {
      colsMapper: this.fc_propertyMapper(),
      params: params,
      gbkCols: dbSpec.gbkCols(),
      exactSearchCols: dbSpec.exactSearchCols(),
      fuzzySearchCols: dbSpec.fuzzySearchCols(),
      timestampTypeCols: dbSpec.timestampTypeCols(),
    })
    return searcher
  }

  /**
   * @description Reload data from database
   */
  public async reloadDataFromDB(transaction?: Transaction) {
    const feed = await this.findFeedInDB(transaction)
    if (feed) {
      this.fc_generate(feed.fc_encode())
    }
    return this
  }

  public cleanFilterParams(params: { [p: string]: any }) {
    const retData = Object.assign({}, params)
    const mapper = this.fc_propertyMapper()
    for (const key in params) {
      if (!(key in mapper)) {
        delete retData[key]
      }
    }
    return retData
  }

  public async checkExistsInDB(transaction?: Transaction) {
    return !!(await this.findFeedInDB(transaction))
  }

  public async findFeedInDB(transaction?: Transaction) {
    const data = this.fc_encode()
    const params: any = {}
    this.dbSpec()
      .primaryKeys()
      .forEach((key: string): void => {
        params[key] = data[key]
      })
    const clazz = this.constructor as any
    return (await clazz.findOne(params, transaction)) as FeedBase | undefined
  }

  public toString() {
    return `${this.constructor.name}: ${JSON.stringify(this.fc_pureModel(), null, 2)}`
  }

  public static dbSearcher(params: { [p: string]: number | string } = {}, transaction?: Transaction) {
    const feed = new this() as FeedBase
    const tools = new DBTools(feed.dbSpec(), transaction)
    return tools.makeSearcher(params)
  }
  /**
   * @description Like findWithUid, but it will throw an error if object does not exist.
   */
  public static async prepareWithUid<T extends FeedBase>(
    this: { new (): T },
    uid: string | number,
    transaction?: Transaction
  ): Promise<T> {
    const obj = await (this as any).findWithUid(uid, transaction)
    assert.ok(!!obj, `${this.constructor.name}: object not found.`)
    return obj
  }

  public static async findWithUid<T extends FeedBase>(
    this: { new (): T },
    uid: string | number,
    transaction?: Transaction
  ): Promise<T | undefined> {
    const feed = new this() as FeedBase
    const dbSpec = feed.dbSpec()
    assert.ok(dbSpec.primaryKeys().length === 1, 'PrimaryKey must be single item in this case.')
    const params: { [p: string]: any } = {}
    params[dbSpec.primaryKey] = uid
    return (this as any).findOne(params, transaction)
  }

  /**
   * @description Like findOne, but it will throw an error if object does not exist.
   */
  public static async prepareOne<T extends FeedBase>(
    this: { new (): T },
    params: Params,
    transaction?: Transaction
  ): Promise<T> {
    const obj = await (this as any).findOne(params, transaction)
    assert.ok(!!obj, `${this.constructor.name}: object not found.`)
    return obj
  }

  public static async findOne<T extends FeedBase>(
    this: { new (): T },
    params: Params,
    transaction?: Transaction
  ): Promise<T | undefined> {
    assert.ok(typeof params === 'object', `params must be an object.`)
    const feed = new this() as T
    const tools = new DBTools(feed.dbSpec(), transaction)
    const searcher = tools.makeSearcher(params)
    const data = await searcher.querySingle()
    if (data) {
      feed.fc_generate(data)
      return feed
    }
    return undefined
  }

  public static async count(params: Params = {}, transaction?: Transaction) {
    const feed = new this() as FeedBase
    const tools = new DBTools(feed.dbSpec(), transaction)
    const searcher = tools.makeSearcher(params)
    return searcher.queryCount()
  }

  public toJSON(): MapProtocol {
    return this.fc_pureModel()
  }

  public static limitParams(filterParams: FilterOptions = {}) {
    const clazz = this as any as typeof FeedBase
    filterParams._offset = filterParams._offset || 0
    filterParams._length = Math.min(filterParams._length || clazz.PAGE_LENGTH_DEFAULT, clazz.PAGE_LENGTH_CEIL)
  }

  public static PAGE_LENGTH_DEFAULT = 10
  public static PAGE_LENGTH_CEIL = 1000
  public static async getPageResult<Model = any>(
    filterParams: FilterOptions = {},
    ignoreLimit = false
  ): Promise<PageDataV3<Model>> {
    const searcher = this.makeFeedSearcher(filterParams, ignoreLimit)
    const items = await searcher.queryJsonFeeds<Model>()
    return {
      offset: Number(filterParams._offset),
      length: items.length,
      totalCount: await searcher.queryCount(),
      items: items,
    }
  }

  public static async getPageResultV2<Model = any>(
    filterParams: FilterOptions = {},
    customHandler?: (searcher: FeedSearcher<FeedBase>) => void
  ): Promise<PageDataV3<Model>> {
    const searcher = this.makeFeedSearcher(filterParams)
    if (customHandler) {
      customHandler(searcher)
    }
    const items = await searcher.queryJsonFeeds<Model>()
    return {
      offset: Number(filterParams._offset),
      length: items.length,
      totalCount: await searcher.queryCount(),
      items: items,
    }
  }

  public static makeFeedSearcher(filterParams: FilterOptions = {}, ignoreLimit = false) {
    const feed = new this() as FeedBase
    const clazz = this as any as typeof FeedBase
    clazz.limitParams(filterParams)
    const searcher = feed.fc_searcher(filterParams)
    if (ignoreLimit) {
      searcher.processor().setLimitInfo(0, -1)
    }
    return searcher
  }

  public static async getAggregationData<T = any>(options: {
    columns: string[]
    groupByKeys?: string[]
    filterParams?: FilterOptions
    customHandler?: (searcher: SQLSearcher) => void
    transaction?: Transaction
  }) {
    const groupByKeys = options.groupByKeys || []
    const feed = new this() as FeedBase
    const searcher = feed.fc_searcher(options.filterParams)
    const processor = searcher.processor()
    processor.setColumns(options.columns)
    processor.setGroupByKeys(groupByKeys)
    if (options.transaction) {
      processor.transaction = options.transaction
    }
    if (options.customHandler) {
      options.customHandler(processor)
    }
    return (await processor.queryList()) as T[]
  }
}
