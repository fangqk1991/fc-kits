import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'invoice_oid',
  'expense_type_code',
  'expense_type_name',
  'invoice_status',
  'reimbursement_oid',
  'reimbursement_name',
  'amount',
  'created_date',
  'last_modified_date',
  'extras_info',
  'reload_time',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'invoice_oid',
  'expense_type_code',
  'expense_type_name',
  'invoice_status',
  'reimbursement_oid',
  'reimbursement_name',
  'amount',
  'created_date',
  'last_modified_date',
  'extras_info',
  'reload_time',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'expense_type_code',
  'expense_type_name',
  'invoice_status',
  'reimbursement_oid',
  'reimbursement_name',
  'amount',
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
  table: 'hly_invoice',
  primaryKey: ['invoice_oid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_Invoice extends FeedBase {
  /**
   * @description [char(36)]
   */
  public invoiceOid!: string | null
  /**
   * @description [varchar(32)]
   */
  public expenseTypeCode!: string
  /**
   * @description [text]
   */
  public expenseTypeName!: string
  /**
   * @description [varchar(16)] HLY_InvoiceStatus
   */
  public invoiceStatus!: string
  /**
   * @description [char(36)]
   */
  public reimbursementOid!: string | null
  /**
   * @description [text]
   */
  public reimbursementName!: string
  /**
   * @description [double] 总金额
   */
  public amount!: number
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
    this.invoiceOid = null
    this.expenseTypeName = ''
    this.invoiceStatus = ''
    this.reimbursementOid = null
    this.reimbursementName = ''
    this.createdDate = null
    this.lastModifiedDate = null
    this.extrasInfo = ''
    this.reloadTime = '2000-01-01 00:00:00'
  }

  public fc_propertyMapper() {
    return {
      invoiceOid: 'invoice_oid',
      expenseTypeCode: 'expense_type_code',
      expenseTypeName: 'expense_type_name',
      invoiceStatus: 'invoice_status',
      reimbursementOid: 'reimbursement_oid',
      reimbursementName: 'reimbursement_name',
      amount: 'amount',
      createdDate: 'created_date',
      lastModifiedDate: 'last_modified_date',
      extrasInfo: 'extras_info',
      reloadTime: 'reload_time',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
