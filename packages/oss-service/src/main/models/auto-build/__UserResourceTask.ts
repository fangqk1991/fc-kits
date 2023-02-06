import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'task_key',
  'user_email',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'task_key',
  'user_email',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'task_key',
  'user_email',
  'create_time',
]

const dbOptions = {
  table: 'user_resource_task',
  primaryKey: ['task_key', 'user_email'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __UserResourceTask extends FeedBase {
  /**
   * @description [char(32)] 任务 Key
   */
  public taskKey!: string
  /**
   * @description [varchar(127)] 用户邮箱
   */
  public userEmail!: string
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
  }

  public fc_propertyMapper() {
    return {
      taskKey: 'task_key',
      userEmail: 'user_email',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
