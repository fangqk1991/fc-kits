import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'uid',
  'business_code',
  'target_month',
  'applicant_oid',
  'applicant_name',
  'company_oid',
  'company_name',
  'title',
  'start_time',
  'end_time',
  'days_count',
  'amount',
  'detail_items_str',
  'use_custom',
  'custom_data_str',
  'extras_info',
  'is_pretty',
  'is_verified',
  'version',
  'pay_amount',
  'snap_hash',
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
  'company_oid',
  'company_name',
  'title',
  'start_time',
  'end_time',
  'days_count',
  'amount',
  'detail_items_str',
  'extras_info',
  'is_pretty',
  'is_verified',
  'version',
  'pay_amount',
  'snap_hash',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'business_code',
  'target_month',
  'applicant_oid',
  'applicant_name',
  'company_oid',
  'company_name',
  'title',
  'start_time',
  'end_time',
  'days_count',
  'amount',
  'detail_items_str',
  'use_custom',
  'custom_data_str',
  'extras_info',
  'is_pretty',
  'is_verified',
  'version',
  'pay_amount',
  'snap_hash',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'start_time',
  'end_time',
  'create_time',
  'update_time',
]
const _gbkCols: string[] = [
  // prettier-ignore
  'applicant_name',
  'company_name',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'business_code',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'applicant_name',
  'company_name',
]

const dbOptions = {
  table: 'hly_travel_allowance',
  primaryKey: ['uid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_TravelAllowance extends FeedBase {
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
   * @description [char(36)]
   */
  public companyOid!: string | null
  /**
   * @description [text]
   */
  public companyName!: string
  /**
   * @description [text]
   */
  public title!: string
  /**
   * @description [timestamp] 开始时间
   */
  public startTime!: string | null
  /**
   * @description [timestamp] 结束时间
   */
  public endTime!: string | null
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
   * @description [tinyint] 是否使用自定义数据
   */
  public useCustom!: number
  /**
   * @description [mediumtext] 自定义补贴数据
   */
  public customDataStr!: string
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
   * @description [int] 版本号
   */
  public version!: number
  /**
   * @description [double] 支付金额
   */
  public payAmount!: number
  /**
   * @description [char(32)] uid + days_count + amount MD5
   */
  public snapHash!: string
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
    this.companyOid = null
    this.companyName = ''
    this.title = ''
    this.startTime = null
    this.endTime = null
    this.daysCount = 0
    this.amount = 0
    this.detailItemsStr = ''
    this.useCustom = 0
    this.customDataStr = ''
    this.extrasInfo = ''
    this.isPretty = 0
    this.isVerified = 0
    this.version = 0
    this.payAmount = 0
    this.snapHash = ''
  }

  public fc_propertyMapper() {
    return {
      uid: 'uid',
      businessCode: 'business_code',
      targetMonth: 'target_month',
      applicantOid: 'applicant_oid',
      applicantName: 'applicant_name',
      companyOid: 'company_oid',
      companyName: 'company_name',
      title: 'title',
      startTime: 'start_time',
      endTime: 'end_time',
      daysCount: 'days_count',
      amount: 'amount',
      detailItemsStr: 'detail_items_str',
      useCustom: 'use_custom',
      customDataStr: 'custom_data_str',
      extrasInfo: 'extras_info',
      isPretty: 'is_pretty',
      isVerified: 'is_verified',
      version: 'version',
      payAmount: 'pay_amount',
      snapHash: 'snap_hash',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
