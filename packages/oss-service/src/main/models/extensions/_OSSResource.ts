import __OSSResource from '../auto-build/__OSSResource'
import { OSSProvider, OSSResourceParams, OSSStatus } from '../../../common/models'
import { makeUUID } from '@fangcha/tools'

export class _OSSResource extends __OSSResource {
  provider: OSSProvider
  ossStatus: OSSStatus

  public constructor() {
    super()
    this.provider = OSSProvider.Aliyun
    this.ossStatus = OSSStatus.Pending
  }

  public static async generateOSSResource<T extends _OSSResource>(this: { new (): T }, params: OSSResourceParams) {
    const feed = new this()
    feed.resourceId = makeUUID()
    feed.provider = OSSProvider.Aliyun
    feed.ossStatus = OSSStatus.Pending
    feed.bucketName = params.bucketName
    feed.ossKey = params.ossKey
    feed.mimeType = params.mimeType || ''
    feed.size = params.size
    feed.uploader = params.uploader
    await feed.addToDB()
    return feed
  }
}
