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
  'form_oid',
  'form_code',
  'form_name',
  'submitted_by',
  'cost_type_oid',
  'cost_owner_oid',
  'title',
  'created_date',
  'last_modified_date',
  'extras_info',
  'expense_type',
  'expense_status',
  'total_amount',
  'apply_form_codes_str',
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
  'form_oid',
  'form_code',
  'form_name',
  'submitted_by',
  'cost_type_oid',
  'cost_owner_oid',
  'title',
  'created_date',
  'last_modified_date',
  'extras_info',
  'expense_type',
  'expense_status',
  'total_amount',
  'apply_form_codes_str',
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
  'form_oid',
  'form_code',
  'form_name',
  'submitted_by',
  'cost_type_oid',
  'cost_owner_oid',
  'title',
  'created_date',
  'last_modified_date',
  'extras_info',
  'expense_type',
  'expense_status',
  'total_amount',
  'apply_form_codes_str',
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

const dbOptions = {
  table: 'hly_expense',
  primaryKey: ['hly_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
}

export default class __HLY_Expense extends FeedBase {
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
   * @description [char(36)]
   */
  public formOid!: string | null
  /**
   * @description [varchar(32)]
   */
  public formCode!: string | null
  /**
   * @description [text]
   */
  public formName!: string
  /**
   * @description [char(36)]
   */
  public submittedBy!: string | null
  /**
   * @description [char(36)]
   */
  public costTypeOid!: string | null
  /**
   * @description [char(36)]
   */
  public costOwnerOid!: string | null
  /**
   * @description [text]
   */
  public title!: string
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
   * @description [int] HLY_ExpenseType
   */
  public expenseType!: number
  /**
   * @description [int] HLY_ExpenseStatus
   */
  public expenseStatus!: number
  /**
   * @description [double] 总金额
   */
  public totalAmount!: number
  /**
   * @description [varchar(256)] 关联申请单编号集
   */
  public applyFormCodesStr!: string
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
    this.formOid = null
    this.formCode = null
    this.formName = ''
    this.submittedBy = null
    this.costTypeOid = null
    this.costOwnerOid = null
    this.title = ''
    this.createdDate = null
    this.lastModifiedDate = null
    this.extrasInfo = ''
    this.applyFormCodesStr = ''
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
      formOid: 'form_oid',
      formCode: 'form_code',
      formName: 'form_name',
      submittedBy: 'submitted_by',
      costTypeOid: 'cost_type_oid',
      costOwnerOid: 'cost_owner_oid',
      title: 'title',
      createdDate: 'created_date',
      lastModifiedDate: 'last_modified_date',
      extrasInfo: 'extras_info',
      expenseType: 'expense_type',
      expenseStatus: 'expense_status',
      totalAmount: 'total_amount',
      applyFormCodesStr: 'apply_form_codes_str',
      reloadTime: 'reload_time',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
