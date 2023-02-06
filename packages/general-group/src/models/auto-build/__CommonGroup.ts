import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'group_id',
  'app',
  'name',
  'space',
  'obj_key',
  'group_level',
  'remarks',
  'version',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'group_id',
  'app',
  'name',
  'space',
  'obj_key',
  'group_level',
  'remarks',
  'version',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'app',
  'name',
  'space',
  'obj_key',
  'group_level',
  'remarks',
  'version',
]

const dbOptions = {
  table: 'common_group',
  primaryKey: 'group_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __CommonGroup extends FeedBase {
  /**
   * @description [char(63)] 组 ID，具备唯一性
   */
  public groupId!: string
  /**
   * @description [varchar(31)] 应用标识符
   */
  public app!: string
  /**
   * @description [varchar(127)] 组名
   */
  public name!: string
  /**
   * @description [varchar(127)] 组所处的空间
   */
  public space!: string
  /**
   * @description [varchar(63)] 标识键
   */
  public objKey!: string
  /**
   * @description [varchar(127)] 字段类型: 枚举值见 GroupLevel 定义
   */
  public groupLevel!: string
  /**
   * @description [varchar(255)] 备注
   */
  public remarks!: string
  /**
   * @description [int] 版本号
   */
  public version!: number
  /**
   * @description [timestamp] 创建时间: ISO8601 字符串
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间: ISO8601 字符串
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
    this._reloadOnAdded = true
    this._reloadOnUpdated = true
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.app = ''
    this.name = ''
    this.space = ''
    this.objKey = ''
    this.remarks = ''
    this.version = 0
  }

  public fc_propertyMapper() {
    return {
      groupId: 'group_id',
      app: 'app',
      name: 'name',
      space: 'space',
      objKey: 'obj_key',
      groupLevel: 'group_level',
      remarks: 'remarks',
      version: 'version',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
