import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'user_oid',
  'employee_id',
  'company_code',
  'full_name',
  'email',
  'department_oid',
  'department_path',
  'staff_status',
  'entry_date',
  'leaving_date',
  'extras_info',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'user_oid',
  'employee_id',
  'company_code',
  'full_name',
  'email',
  'department_oid',
  'department_path',
  'staff_status',
  'entry_date',
  'leaving_date',
  'extras_info',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'company_code',
  'full_name',
  'email',
  'department_oid',
  'department_path',
  'staff_status',
  'entry_date',
  'leaving_date',
  'extras_info',
]

const dbOptions = {
  table: 'hly_staff',
  primaryKey: ['user_oid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __HLY_Staff extends FeedBase {
  /**
   * @description [char(36)]
   */
  public userOid!: string
  /**
   * @description [varchar(64)]
   */
  public employeeId!: string
  /**
   * @description [varchar(20)]
   */
  public companyCode!: string | null
  /**
   * @description [varchar(64)]
   */
  public fullName!: string
  /**
   * @description [varchar(128)]
   */
  public email!: string | null
  /**
   * @description [char(36)]
   */
  public departmentOid!: string | null
  /**
   * @description [text]
   */
  public departmentPath!: string
  /**
   * @description [int] HLY_StaffStatus
   */
  public staffStatus!: number
  /**
   * @description [timestamp]
   */
  public entryDate!: string | null
  /**
   * @description [timestamp]
   */
  public leavingDate!: string | null
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
    this.companyCode = null
    this.fullName = ''
    this.email = null
    this.departmentOid = null
    this.departmentPath = ''
    this.entryDate = null
    this.leavingDate = null
    this.extrasInfo = ''
  }

  public fc_propertyMapper() {
    return {
      userOid: 'user_oid',
      employeeId: 'employee_id',
      companyCode: 'company_code',
      fullName: 'full_name',
      email: 'email',
      departmentOid: 'department_oid',
      departmentPath: 'department_path',
      staffStatus: 'staff_status',
      entryDate: 'entry_date',
      leavingDate: 'leaving_date',
      extrasInfo: 'extras_info',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
