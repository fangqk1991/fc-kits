import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'event_id',
  'visitor',
  'create_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'event_id',
  'visitor',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'event_id',
  'visitor',
  'create_time',
]

const dbOptions = {
  table: 'event_log',
  primaryKey: '',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __EventLog extends FeedBase {
  /**
   * @description [char(32)] event_id，SQL 外键 -> stat_event.event_id
   */
  public eventId!: string
  /**
   * @description [varchar(127)] 访问者
   */
  public visitor!: string
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
    this.visitor = ''
  }

  public fc_propertyMapper() {
    return {
      eventId: 'event_id',
      visitor: 'visitor',
      createTime: 'create_time',
    }
  }
}
