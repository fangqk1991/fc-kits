import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'department_oid',
  'department_name',
  'department_path',
  'manager_oid',
  'manager_name',
  'department_parent_oid',
  'department_status',
  'extras_info',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'department_oid',
  'department_name',
  'department_path',
  'manager_oid',
  'manager_name',
  'department_parent_oid',
  'department_status',
  'extras_info',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'department_name',
  'department_path',
  'manager_oid',
  'manager_name',
  'department_parent_oid',
  'department_status',
  'extras_info',
]

const dbOptions = {
  table: 'hly_department',
  primaryKey: ['department_oid'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __HLY_Department extends FeedBase {
  /**
   * @description [char(36)]
   */
  public departmentOid!: string
  /**
   * @description [varchar(64)]
   */
  public departmentName!: string | null
  /**
   * @description [text]
   */
  public departmentPath!: string
  /**
   * @description [char(36)]
   */
  public managerOid!: string | null
  /**
   * @description [varchar(64)]
   */
  public managerName!: string | null
  /**
   * @description [char(36)]
   */
  public departmentParentOid!: string | null
  /**
   * @description [int] HLY_DepartmentStatus
   */
  public departmentStatus!: number
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
    this.departmentName = ''
    this.departmentPath = ''
    this.managerOid = null
    this.managerName = ''
    this.departmentParentOid = null
    this.extrasInfo = ''
  }

  public fc_propertyMapper() {
    return {
      departmentOid: 'department_oid',
      departmentName: 'department_name',
      departmentPath: 'department_path',
      managerOid: 'manager_oid',
      managerName: 'manager_name',
      departmentParentOid: 'department_parent_oid',
      departmentStatus: 'department_status',
      extrasInfo: 'extras_info',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
