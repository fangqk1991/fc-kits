import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'job_id',
  'app',
  'queue',
  'task_name',
  'object_id',
  'params_str',
  'task_state',
  'pending_elapsed',
  'perform_elapsed',
  'error_message',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'job_id',
  'app',
  'queue',
  'task_name',
  'object_id',
  'params_str',
  'task_state',
  'pending_elapsed',
  'perform_elapsed',
  'error_message',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'object_id',
  'task_state',
  'pending_elapsed',
  'perform_elapsed',
  'error_message',
]

const dbOptions = {
  table: 'common_job',
  primaryKey: ['job_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __CommonJob extends FeedBase {
  /**
   * @description [varchar(63)] 任务 ID，具备唯一性
   */
  public jobId!: string
  /**
   * @description [varchar(127)] 应用
   */
  public app!: string
  /**
   * @description [varchar(127)] 所处队列
   */
  public queue!: string
  /**
   * @description [varchar(127)] 任务名
   */
  public taskName!: string
  /**
   * @description [varchar(63)] 对象主键 ID
   */
  public objectId!: string
  /**
   * @description [text] 相关参数
   */
  public paramsStr!: string
  /**
   * @description [varchar(127)] 任务状态
   */
  public taskState!: string
  /**
   * @description [bigint] 任务等待耗时，单位：毫秒
   */
  public pendingElapsed!: number
  /**
   * @description [bigint] 任务执行耗时，单位：毫秒
   */
  public performElapsed!: number
  /**
   * @description [text] 错误信息
   */
  public errorMessage!: string
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
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.app = ''
    this.queue = ''
    this.taskName = ''
    this.objectId = ''
    this.paramsStr = ''
    this.taskState = ''
    this.pendingElapsed = 0
    this.performElapsed = 0
    this.errorMessage = ''
  }

  public fc_propertyMapper() {
    return {
      jobId: 'job_id',
      app: 'app',
      queue: 'queue',
      taskName: 'task_name',
      objectId: 'object_id',
      paramsStr: 'params_str',
      taskState: 'task_state',
      pendingElapsed: 'pending_elapsed',
      performElapsed: 'perform_elapsed',
      errorMessage: 'error_message',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
