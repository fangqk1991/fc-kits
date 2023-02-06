import { FCDatabase } from 'fc-sql'
import { _OSSResource } from './models/extensions/_OSSResource'
import { AliOSSOptions, OSSUtils, UploadSignatureOptions } from '@fangcha/ali-oss'
import assert from '@fangcha/assert'
import { OSSResourceHandler } from './OSSResourceHandler'
import { OSSResourceParams, ResourceTaskModel, ResourceTaskStatus } from '../common/models'
import { _ResourceTask } from './models/extensions/_ResourceTask'
import { _UserResourceTask } from './models/extensions/_UserResourceTask'
import { TaskHandlerProtocol } from './ResourceTaskHandler'
import { MyDownloader } from './MyDownloader'

interface Options {
  visitor: AliOSSOptions
  uploader: AliOSSOptions
  uploadSignature: UploadSignatureOptions
  remoteRootDir: string
  downloadRootDir: string
}

interface OSSTools {
  ossUtils: OSSUtils
  remoteUploadDir: string
  downloadRootDir: string
}

export interface OssServiceOptions {
  database: FCDatabase
  defaultOssOptions: Options
  optionsMapper?: { [ossBucket: string]: Options }
  taskMapper?: { [taskType: string]: { new (params?: any): TaskHandlerProtocol } }
  downloadRootDir?: string
  skipSpecDocItem?: boolean
}

class _OSSService {
  public version = 0
  private _toolsMapper: { [p: string]: OSSTools } = {}
  private _options!: OssServiceOptions

  public init(options: OssServiceOptions) {
    this._options = options

    const database = options.database
    _OSSResource.setDatabase(database)
    _ResourceTask.setDatabase(database)
    _UserResourceTask.setDatabase(database)

    this.setDefaultOSSTools(options.defaultOssOptions)
    if (options.optionsMapper) {
      Object.keys(options.optionsMapper).forEach((bucket) => {
        this.setOSSTools(bucket, options.optionsMapper![bucket])
      })
    }

    return this
  }

  public setDatabase(database: FCDatabase) {
    _OSSResource.setDatabase(database)
    _ResourceTask.setDatabase(database)
    _UserResourceTask.setDatabase(database)
    return this
  }

  public setDefaultOSSTools(options: Options) {
    return this.setOSSTools('_default', options)
  }

  public setOSSTools(toolsKey: string, options: Options) {
    const remoteUploadDir = `${options.remoteRootDir}/uploads`

    const ossUtils = new OSSUtils()
    ossUtils.initUploader(options.uploader, remoteUploadDir)
    ossUtils.initDownloader(options.visitor, options.downloadRootDir)
    ossUtils.initSignatureOptions(options.uploadSignature)
    this._toolsMapper[toolsKey] = {
      ossUtils: ossUtils,
      remoteUploadDir: remoteUploadDir,
      downloadRootDir: options.downloadRootDir,
    }
    return this
  }

  public getTools(toolsKey = '_default') {
    const tools = this._toolsMapper[toolsKey]
    assert.ok(!!tools, `OSSTools[${toolsKey}] 未被初始化`, 500)
    return tools
  }

  public getClass_OSSResource(database: FCDatabase): typeof _OSSResource {
    class OSSResource extends _OSSResource {}
    OSSResource.setDatabase(database)
    return OSSResource
  }

  public async findResource(resourceId: string) {
    const clazz = this.getClass_OSSResource(this._options.database)
    return (await clazz.findWithUid(resourceId))!
  }

  public getResourceHandler(resource: _OSSResource) {
    return new OSSResourceHandler(resource, OSSService.getTools(resource.bucketName).ossUtils)
  }

  public makePureParams(params: OSSResourceParams): OSSResourceParams {
    assert.ok(!!params.bucketName, 'Params Error: bucketName invalid')
    assert.ok(!!params.size, 'Params Error: size invalid')
    return {
      bucketName: params.bucketName,
      ossKey: params.ossKey,
      uploader: params.uploader,
      size: params.size,
      mimeType: params.mimeType || '',
    }
  }

  public getTaskHandlerClazz(taskType: string) {
    assert.ok(!!this._options.taskMapper, `taskMapper 未被初始化`, 500)
    const clazz = this._options.taskMapper![taskType]
    assert.ok(!!clazz, `taskMapper[${taskType}] 任务未定义`, 500)
    return clazz
  }

  public getDownloader() {
    assert.ok(!!this._options.downloadRootDir, `downloadRootDir 未被初始化`, 500)
    return new MyDownloader(this._options.downloadRootDir!)
  }

  public fillDownloadUrl(task: ResourceTaskModel) {
    if (task.taskStatus === ResourceTaskStatus.Success && task.ossKey) {
      const ossTools = OSSService.getTools(task.bucketName)
      const options = {}
      if (task.fileName) {
        options['response'] = {
          'content-disposition': `attachment; filename=${encodeURIComponent(task.fileName)}`,
        }
      }
      task.downloadUrl = ossTools.ossUtils.signatureURL(task.ossKey, options)
    }
    return task
  }
}

export const OSSService = new _OSSService()
