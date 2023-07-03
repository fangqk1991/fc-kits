import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'uid',
  'business_code',
  'target_month',
  'applicant_oid',
  'applicant_name',
  'title',
  'days_count',
  'amount',
  'detail_items_str',
  'extras_info',
  'is_pretty',
  'is_verified',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'uid',
  'business_code',
  'target_month',
  'applicant_oid',
  'applicant_name',
  'title',
  'days_count',
  'amount',
  'detail_items_str',
  'extras_info',
  'is_pretty',
  'is_verified',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'business_code',
  'target_month',
  'applicant_oid',
  'applicant_name',
  'title',
  'days_count',
  'amount',
  'detail_items_str',
  'extras_info',
  'is_pretty',
  'is_verified',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'create_time',
  'update_time',
]

const dbOptions = {
  table: 'hly_allowance_snapshot',
  primaryKey: ['uid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export default class __HLY_AllowanceSnapshot extends FeedBase {
  /**
   * @description [char(32)] business_code + target_month + applicant_oid MD5
   */
  public uid!: string
  /**
   * @description [varchar(20)]
   */
  public businessCode!: string
  /**
   * @description [char(7)] 补贴月份 yyyy-MM
   */
  public targetMonth!: string
  /**
   * @description [char(36)]
   */
  public applicantOid!: string | null
  /**
   * @description [text]
   */
  public applicantName!: string
  /**
   * @description [text]
   */
  public title!: string
  /**
   * @description [double] 补贴天数
   */
  public daysCount!: number
  /**
   * @description [double] 补贴金额
   */
  public amount!: number
  /**
   * @description [mediumtext] 明细，空 | JSON 字符串
   */
  public detailItemsStr!: string
  /**
   * @description [mediumtext] 附加信息，空 | JSON 字符串
   */
  public extrasInfo!: string
  /**
   * @description [tinyint] 是否为标准情况
   */
  public isPretty!: number
  /**
   * @description [tinyint] 是否已核验
   */
  public isVerified!: number
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
    this.applicantOid = null
    this.applicantName = ''
    this.title = ''
    this.daysCount = 0
    this.amount = 0
    this.detailItemsStr = ''
    this.extrasInfo = ''
    this.isPretty = 0
    this.isVerified = 0
  }

  public fc_propertyMapper() {
    return {
      uid: 'uid',
      businessCode: 'business_code',
      targetMonth: 'target_month',
      applicantOid: 'applicant_oid',
      applicantName: 'applicant_name',
      title: 'title',
      daysCount: 'days_count',
      amount: 'amount',
      detailItemsStr: 'detail_items_str',
      extrasInfo: 'extras_info',
      isPretty: 'is_pretty',
      isVerified: 'is_verified',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
