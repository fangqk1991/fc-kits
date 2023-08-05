import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'group_oid',
  'group_code',
  'group_name',
  'is_enabled',
  'extras_info',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'group_oid',
  'group_code',
  'group_name',
  'is_enabled',
  'extras_info',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'group_code',
  'group_name',
  'is_enabled',
  'extras_info',
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
  table: 'hly_staff_group',
  primaryKey: ['group_oid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_StaffGroup extends FeedBase {
  /**
   * @description [char(36)]
   */
  public groupOid!: string
  /**
   * @description [varchar(32)]
   */
  public groupCode!: string | null
  /**
   * @description [varchar(64)]
   */
  public groupName!: string
  /**
   * @description [tinyint] 是否为标准情况
   */
  public isEnabled!: number
  /**
   * @description [mediumtext] 附加信息，空 | JSON 字符串
   */
  public extrasInfo!: string
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
    this.groupCode = null
    this.groupName = ''
    this.isEnabled = 0
    this.extrasInfo = ''
  }

  public fc_propertyMapper() {
    return {
      groupOid: 'group_oid',
      groupCode: 'group_code',
      groupName: 'group_name',
      isEnabled: 'is_enabled',
      extrasInfo: 'extras_info',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
