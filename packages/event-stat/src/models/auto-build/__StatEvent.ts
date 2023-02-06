import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'event_id',
  'event_type',
  'content',
  'create_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'event_id',
  'event_type',
  'content',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'event_type',
  'content',
  'create_time',
]

const dbOptions = {
  table: 'stat_event',
  primaryKey: 'event_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __StatEvent extends FeedBase {
  /**
   * @description [char(32)] 事件唯一 ID
   */
  public eventId!: string
  /**
   * @description [varchar(64)] 事件类型
   */
  public eventType!: string
  /**
   * @description [text] 事件内容
   */
  public content!: string
  /**
   * @description [timestamp] 创建时间
   */
  public createTime!: string

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
    this.eventType = 'Hyperlink'
    this.content = ''
  }

  public fc_propertyMapper() {
    return {
      eventId: 'event_id',
      eventType: 'event_type',
      content: 'content',
      createTime: 'create_time',
    }
  }
}
