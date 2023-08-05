import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'uid',
  'role_match_type',
  'role_list_str',
  'city_match_type',
  'city_list_str',
  'amount',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'uid',
  'role_match_type',
  'role_list_str',
  'city_match_type',
  'city_list_str',
  'amount',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'role_match_type',
  'role_list_str',
  'city_match_type',
  'city_list_str',
  'amount',
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
  table: 'hly_allowance_rule',
  primaryKey: ['uid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_AllowanceRule extends FeedBase {
  /**
   * @description [char(32)] UUID
   */
  public uid!: string
  /**
   * @description [varchar(20)]
   */
  public roleMatchType!: string
  /**
   * @description [text]
   */
  public roleListStr!: string
  /**
   * @description [varchar(20)]
   */
  public cityMatchType!: string
  /**
   * @description [text]
   */
  public cityListStr!: string
  /**
   * @description [double] 金额
   */
  public amount!: number
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
    this.roleMatchType = ''
    this.roleListStr = ''
    this.cityMatchType = ''
    this.cityListStr = ''
  }

  public fc_propertyMapper() {
    return {
      uid: 'uid',
      roleMatchType: 'role_match_type',
      roleListStr: 'role_list_str',
      cityMatchType: 'city_match_type',
      cityListStr: 'city_list_str',
      amount: 'amount',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
