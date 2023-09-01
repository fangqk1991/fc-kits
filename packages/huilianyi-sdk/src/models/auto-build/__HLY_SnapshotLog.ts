import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'target_month',
  'record_count',
  'version',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'target_month',
  'record_count',
  'version',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'record_count',
  'version',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]
const _gbkCols: string[] = [
  // prettier-ignore
]
const _exactSearchCols: string[] = [
  // prettier-ignore
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
]

const dbOptions = {
  table: 'hly_snapshot_log',
  primaryKey: ['target_month'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_SnapshotLog extends FeedBase {
  /**
   * @description [char(7)] 快照月份 yyyy-MM
   */
  public targetMonth!: string
  /**
   * @description [int] 记录数量
   */
  public recordCount!: number
  /**
   * @description [int] 版本号
   */
  public version!: number
  /**
   * @description [timestamp] 创建时间
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间
   */
  public updateTime!: string

  protected static _staticDBOptions: DBProtocolV2
  protected static _staticDBObserver?: DBObserver

  public static setDatabase(database: FCDatabase, dbObserver?: DBObserver) {
    this.addStaticOptions({ database: database }, dbObserver)
  }

  public static setStaticProtocol(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static addStaticOptions(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, this._staticDBOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static _onStaticDBOptionsUpdate(_protocol: DBProtocolV2) {}

  public constructor() {
    super()
    this.setDBProtocolV2(this.constructor['_staticDBOptions'])
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.version = 0
  }

  public fc_propertyMapper() {
    return {
      targetMonth: 'target_month',
      recordCount: 'record_count',
      version: 'version',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
