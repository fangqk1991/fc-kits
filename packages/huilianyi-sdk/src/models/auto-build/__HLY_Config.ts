import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'config_key',
  'config_data_str',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'config_key',
  'config_data_str',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'config_data_str',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'hly_config',
  primaryKey: ['config_key'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export default class __HLY_Config extends FeedBase {
  /**
   * @description [char(36)]
   */
  public configKey!: string
  /**
   * @description [mediumtext] JSON 字符串
   */
  public configDataStr!: string
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
    this.configDataStr = ''
  }

  public fc_propertyMapper() {
    return {
      configKey: 'config_key',
      configDataStr: 'config_data_str',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
