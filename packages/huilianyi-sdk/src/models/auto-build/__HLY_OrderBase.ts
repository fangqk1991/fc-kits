import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'hly_id',
  'user_oid',
  'employee_id',
  'applicant_name',
  'journey_no',
  'business_code',
  'company_oid',
  'order_type',
  'pay_type',
  'order_status',
  'audit_status',
  'created_date',
  'last_modified_date',
  'extras_info',
  'reload_time',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'hly_id',
  'user_oid',
  'employee_id',
  'applicant_name',
  'journey_no',
  'business_code',
  'company_oid',
  'order_type',
  'pay_type',
  'order_status',
  'audit_status',
  'created_date',
  'last_modified_date',
  'extras_info',
  'reload_time',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'user_oid',
  'employee_id',
  'applicant_name',
  'journey_no',
  'business_code',
  'company_oid',
  'order_type',
  'pay_type',
  'order_status',
  'audit_status',
  'created_date',
  'last_modified_date',
  'extras_info',
  'reload_time',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'created_date',
  'last_modified_date',
  'reload_time',
  'create_time',
  'update_time',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'hly_id',
  'business_code',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'applicant_name',
]

const dbOptions = {
  table: 'hly_order_flight',
  primaryKey: ['hly_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_OrderBase extends FeedBase {
  /**
   * @description [bigint unsigned]
   */
  public hlyId!: number
  /**
   * @description [char(36)]
   */
  public userOid!: string
  /**
   * @description [varchar(64)]
   */
  public employeeId!: string | null
  /**
   * @description [text]
   */
  public applicantName!: string
  /**
   * @description [varchar(20)]
   */
  public journeyNo!: string
  /**
   * @description [varchar(20)]
   */
  public businessCode!: string | null
  /**
   * @description [char(36)]
   */
  public companyOid!: string | null
  /**
   * @description [varchar(20)]
   */
  public orderType!: string
  /**
   * @description [varchar(20)]
   */
  public payType!: string
  /**
   * @description [varchar(20)]
   */
  public orderStatus!: string
  /**
   * @description [varchar(20)]
   */
  public auditStatus!: string | null
  /**
   * @description [timestamp]
   */
  public createdDate!: string | null
  /**
   * @description [timestamp]
   */
  public lastModifiedDate!: string | null
  /**
   * @description [mediumtext] 附加信息，空 | JSON 字符串
   */
  public extrasInfo!: string
  /**
   * @description [timestamp]
   */
  public reloadTime!: string
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
    this.userOid = ''
    this.employeeId = null
    this.applicantName = ''
    this.journeyNo = ''
    this.businessCode = null
    this.companyOid = null
    this.payType = ''
    this.auditStatus = null
    this.createdDate = null
    this.lastModifiedDate = null
    this.extrasInfo = ''
    this.reloadTime = '2000-01-01 00:00:00'
  }

  public fc_propertyMapper() {
    return {
      hlyId: 'hly_id',
      userOid: 'user_oid',
      employeeId: 'employee_id',
      applicantName: 'applicant_name',
      journeyNo: 'journey_no',
      businessCode: 'business_code',
      companyOid: 'company_oid',
      orderType: 'order_type',
      payType: 'pay_type',
      orderStatus: 'order_status',
      auditStatus: 'audit_status',
      createdDate: 'created_date',
      lastModifiedDate: 'last_modified_date',
      extrasInfo: 'extras_info',
      reloadTime: 'reload_time',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
