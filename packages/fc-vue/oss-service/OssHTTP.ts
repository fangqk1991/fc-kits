import { CommonAPI } from '@fangcha/app-request'
import { OSSResourceModel, OssTypicalParams, ResourceMetadata } from '@fangcha/oss-service/lib/common/models'
import { OssApis } from '@fangcha/oss-service/lib/common/apis'
import { MyAxios } from '../basic'

export class OssHTTP {
  public static async getOssResourceMetadata(params: OssTypicalParams): Promise<ResourceMetadata> {
    const request = MyAxios(new CommonAPI(OssApis.OssResourcePrepare, params.bucketName, params.ossZone))
    request.setBodyData(params)
    return request.quickSend()
  }

  public static async markOssResourceSuccess(resourceId: string): Promise<OSSResourceModel> {
    const request = MyAxios(new CommonAPI(OssApis.OssResourceStatusMark, resourceId))
    return await request.quickSend()
  }
}
