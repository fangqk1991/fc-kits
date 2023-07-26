import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'resource_id',
  'provider',
  'bucket_name',
  'oss_key',
  'mime_type',
  'size',
  'oss_status',
  'uploader',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'resource_id',
  'provider',
  'bucket_name',
  'oss_key',
  'mime_type',
  'size',
  'oss_status',
  'uploader',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'mime_type',
  'size',
  'oss_status',
  'uploader',
]

const dbOptions = {
  table: 'oss_resource',
  primaryKey: 'resource_id',
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
}

export default class __OSSResource extends FeedBase {
  /**
   * @description [char(32)] 资源唯一 ID
   */
  public resourceId!: string
  /**
   * @description [varchar(16)] 服务商
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
   * @description [enum('Pending','Uploading','Success','Fail','Deleted')] 文件状态
   */
  public ossStatus!: string | null
  /**
   * @description [varchar(127)] 上传者
   */
  public uploader!: string
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
    this.provider = 'Aliyun'
    this.bucketName = ''
    this.ossKey = ''
    this.mimeType = ''
    this.size = 0
    this.ossStatus = null
    this.uploader = ''
  }

  public fc_propertyMapper() {
    return {
      resourceId: 'resource_id',
      provider: 'provider',
      bucketName: 'bucket_name',
      ossKey: 'oss_key',
      mimeType: 'mime_type',
      size: 'size',
      ossStatus: 'oss_status',
      uploader: 'uploader',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
