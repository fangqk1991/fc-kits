import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'hly_id',
  'business_code',
  'application_oid',
  'applicant_oid',
  'applicant_name',
  'company_oid',
  'department_oid',
  'corporation_oid',
  'form_code',
  'form_oid',
  'form_name',
  'submitted_by',
  'title',
  'start_time',
  'end_time',
  'created_date',
  'last_modified_date',
  'extras_info',
  'has_subsidy',
  'match_closed_loop',
  'is_pretty',
  'itinerary_items_str',
  'employee_traffic_items_str',
  'expense_form_codes_str',
  'participant_user_oids_str',
  'ticket_id_list_str',
  'travel_status',
  'reload_time',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'hly_id',
  'business_code',
  'application_oid',
  'applicant_oid',
  'applicant_name',
  'company_oid',
  'department_oid',
  'corporation_oid',
  'form_code',
  'form_oid',
  'form_name',
  'submitted_by',
  'title',
  'start_time',
  'end_time',
  'created_date',
  'last_modified_date',
  'extras_info',
  'has_subsidy',
  'match_closed_loop',
  'is_pretty',
  'itinerary_items_str',
  'employee_traffic_items_str',
  'expense_form_codes_str',
  'participant_user_oids_str',
  'ticket_id_list_str',
  'travel_status',
  'reload_time',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'application_oid',
  'applicant_oid',
  'applicant_name',
  'company_oid',
  'department_oid',
  'corporation_oid',
  'form_code',
  'form_oid',
  'form_name',
  'submitted_by',
  'title',
  'start_time',
  'end_time',
  'created_date',
  'last_modified_date',
  'extras_info',
  'has_subsidy',
  'match_closed_loop',
  'is_pretty',
  'itinerary_items_str',
  'employee_traffic_items_str',
  'expense_form_codes_str',
  'participant_user_oids_str',
  'ticket_id_list_str',
  'travel_status',
  'reload_time',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'start_time',
  'end_time',
  'created_date',
  'last_modified_date',
  'reload_time',
  'create_time',
  'update_time',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'business_code',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'applicant_name',
]

const dbOptions = {
  table: 'hly_travel',
  primaryKey: ['hly_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_Travel extends FeedBase {
  /**
   * @description [bigint unsigned]
   */
  public hlyId!: number
  /**
   * @description [varchar(20)]
   */
  public businessCode!: string
  /**
   * @description [char(36)]
   */
  public applicationOid!: string | null
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
   * @description [char(36)]
   */
  public departmentOid!: string | null
  /**
   * @description [char(36)]
   */
  public corporationOid!: string | null
  /**
   * @description [varchar(32)]
   */
  public formCode!: string | null
  /**
   * @description [char(36)]
   */
  public formOid!: string | null
  /**
   * @description [text]
   */
  public formName!: string
  /**
   * @description [char(36)]
   */
  public submittedBy!: string | null
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
   * @description [tinyint] 是否有补贴数据
   */
  public hasSubsidy!: number
  /**
   * @description [tinyint] 是否满足闭环行程
   */
  public matchClosedLoop!: number
  /**
   * @description [tinyint] 是否为标准情况
   */
  public isPretty!: number
  /**
   * @description [mediumtext] 行程单信息，空 | JSON 字符串
   */
  public itineraryItemsStr!: string
  /**
   * @description [mediumtext] 员工行程票据信息，空 | JSON 字符串
   */
  public employeeTrafficItemsStr!: string
  /**
   * @description [varchar(256)] 关联报销单编号集
   */
  public expenseFormCodesStr!: string
  /**
   * @description [text]
   */
  public participantUserOidsStr!: string
  /**
   * @description [text]
   */
  public ticketIdListStr!: string
  /**
   * @description [int] HLY_TravelStatus
   */
  public travelStatus!: number
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
    this.applicationOid = null
    this.applicantOid = null
    this.applicantName = ''
    this.companyOid = null
    this.departmentOid = null
    this.corporationOid = null
    this.formCode = null
    this.formOid = null
    this.formName = ''
    this.submittedBy = null
    this.title = ''
    this.startTime = null
    this.endTime = null
    this.createdDate = null
    this.lastModifiedDate = null
    this.extrasInfo = ''
    this.hasSubsidy = 0
    this.matchClosedLoop = 0
    this.isPretty = 0
    this.itineraryItemsStr = ''
    this.employeeTrafficItemsStr = ''
    this.expenseFormCodesStr = ''
    this.participantUserOidsStr = ''
    this.ticketIdListStr = ''
    this.reloadTime = '2000-01-01 00:00:00'
  }

  public fc_propertyMapper() {
    return {
      hlyId: 'hly_id',
      businessCode: 'business_code',
      applicationOid: 'application_oid',
      applicantOid: 'applicant_oid',
      applicantName: 'applicant_name',
      companyOid: 'company_oid',
      departmentOid: 'department_oid',
      corporationOid: 'corporation_oid',
      formCode: 'form_code',
      formOid: 'form_oid',
      formName: 'form_name',
      submittedBy: 'submitted_by',
      title: 'title',
      startTime: 'start_time',
      endTime: 'end_time',
      createdDate: 'created_date',
      lastModifiedDate: 'last_modified_date',
      extrasInfo: 'extras_info',
      hasSubsidy: 'has_subsidy',
      matchClosedLoop: 'match_closed_loop',
      isPretty: 'is_pretty',
      itineraryItemsStr: 'itinerary_items_str',
      employeeTrafficItemsStr: 'employee_traffic_items_str',
      expenseFormCodesStr: 'expense_form_codes_str',
      participantUserOidsStr: 'participant_user_oids_str',
      ticketIdListStr: 'ticket_id_list_str',
      travelStatus: 'travel_status',
      reloadTime: 'reload_time',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
