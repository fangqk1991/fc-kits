import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'user_oid',
  'employee_id',
  'staff_role',
  'company_code',
  'full_name',
  'email',
  'base_city',
  'without_allowance',
  'department_oid',
  'department_path',
  'staff_status',
  'entry_date',
  'leaving_date',
  'group_oids_str',
  'group_codes_str',
  'group_names_str',
  'extras_info',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'user_oid',
  'employee_id',
  'staff_role',
  'company_code',
  'full_name',
  'email',
  'base_city',
  'without_allowance',
  'department_oid',
  'department_path',
  'staff_status',
  'entry_date',
  'leaving_date',
  'group_oids_str',
  'group_codes_str',
  'group_names_str',
  'extras_info',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'staff_role',
  'company_code',
  'full_name',
  'email',
  'base_city',
  'without_allowance',
  'department_oid',
  'department_path',
  'staff_status',
  'entry_date',
  'leaving_date',
  'group_oids_str',
  'group_codes_str',
  'group_names_str',
  'extras_info',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'entry_date',
  'leaving_date',
  'create_time',
  'update_time',
]
const _gbkCols: string[] = [
  // prettier-ignore
  'full_name',
  'base_city',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'user_oid',
  'employee_id',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'full_name',
  'email',
]

const dbOptions = {
  table: 'hly_staff',
  primaryKey: ['user_oid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
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
   * @description [enum('Normal','Manager')] 员工类型
   */
  public staffRole!: string
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
   * @description [varchar(64)]
   */
  public baseCity!: string
  /**
   * @description [tinyint] 不发放出差补贴
   */
  public withoutAllowance!: number
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
   * @description [text]
   */
  public groupOidsStr!: string
  /**
   * @description [text]
   */
  public groupCodesStr!: string
  /**
   * @description [text]
   */
  public groupNamesStr!: string
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
    this.staffRole = 'Normal'
    this.companyCode = null
    this.fullName = ''
    this.email = null
    this.baseCity = ''
    this.withoutAllowance = 0
    this.departmentOid = null
    this.departmentPath = ''
    this.entryDate = null
    this.leavingDate = null
    this.groupOidsStr = ''
    this.groupCodesStr = ''
    this.groupNamesStr = ''
    this.extrasInfo = ''
  }

  public fc_propertyMapper() {
    return {
      userOid: 'user_oid',
      employeeId: 'employee_id',
      staffRole: 'staff_role',
      companyCode: 'company_code',
      fullName: 'full_name',
      email: 'email',
      baseCity: 'base_city',
      withoutAllowance: 'without_allowance',
      departmentOid: 'department_oid',
      departmentPath: 'department_path',
      staffStatus: 'staff_status',
      entryDate: 'entry_date',
      leavingDate: 'leaving_date',
      groupOidsStr: 'group_oids_str',
      groupCodesStr: 'group_codes_str',
      groupNamesStr: 'group_names_str',
      extrasInfo: 'extras_info',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
