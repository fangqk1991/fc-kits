import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'task_key',
  'resource_id',
  'provider',
  'bucket_name',
  'oss_key',
  'mime_type',
  'size',
  'task_type',
  'file_name',
  'current',
  'total',
  'task_status',
  'error_message',
  'raw_params_str',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'task_key',
  'resource_id',
  'provider',
  'bucket_name',
  'oss_key',
  'mime_type',
  'size',
  'task_type',
  'file_name',
  'current',
  'total',
  'task_status',
  'error_message',
  'raw_params_str',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'resource_id',
  'provider',
  'bucket_name',
  'oss_key',
  'mime_type',
  'size',
  'task_type',
  'file_name',
  'current',
  'total',
  'task_status',
  'error_message',
  'raw_params_str',
  'create_time',
]

const dbOptions = {
  table: 'resource_task',
  primaryKey: 'task_key',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __ResourceTask extends FeedBase {
  /**
   * @description [char(32)] 任务 Key
   */
  public taskKey!: string
  /**
   * @description [char(32)] 资源唯一 ID
   */
  public resourceId!: string
  /**
   * @description [enum('Aliyun')] 服务商
   */
  public provider!: string
  /**
   * @description [varchar(127)] Bucket Name
   */
  public bucketName!: string
  /**
   * @description [text] OSS Key
   */
  public ossKey!: string
  /**
   * @description [varchar(127)] MIME Type
   */
  public mimeType!: string
  /**
   * @description [bigint] 文件大小(B)
   */
  public size!: number
  /**
   * @description [varchar(127)] 任务类型
   */
  public taskType!: string
  /**
   * @description [varchar(127)] 文件名
   */
  public fileName!: string
  /**
   * @description [bigint] 当前已完成
   */
  public current!: number
  /**
   * @description [bigint] 总数
   */
  public total!: number
  /**
   * @description [enum('Pending','Processing','Success','Fail')] 任务状态，ResourceTaskStatus
   */
  public taskStatus!: string
  /**
   * @description [text] 错误信息
   */
  public errorMessage!: string
  /**
   * @description [text] 任务原始参数
   */
  public rawParamsStr!: string
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
    this.resourceId = ''
    this.provider = 'Aliyun'
    this.bucketName = ''
    this.ossKey = ''
    this.mimeType = ''
    this.size = 0
    this.taskType = ''
    this.fileName = ''
    this.current = 0
    this.total = 0
    this.taskStatus = 'Pending'
    this.errorMessage = ''
    this.rawParamsStr = ''
  }

  public fc_propertyMapper() {
    return {
      taskKey: 'task_key',
      resourceId: 'resource_id',
      provider: 'provider',
      bucketName: 'bucket_name',
      ossKey: 'oss_key',
      mimeType: 'mime_type',
      size: 'size',
      taskType: 'task_type',
      fileName: 'file_name',
      current: 'current',
      total: 'total',
      taskStatus: 'task_status',
      errorMessage: 'error_message',
      rawParamsStr: 'raw_params_str',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
