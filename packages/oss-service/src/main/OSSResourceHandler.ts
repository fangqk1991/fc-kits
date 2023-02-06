import { _OSSResource } from './models/extensions/_OSSResource'
import assert from '@fangcha/assert'
import { OSSResourceModel, OSSStatus, ResourceMetadata } from '../common/models'
import { OSSUtils } from '@fangcha/ali-oss'

export class OSSResourceHandler {
  public readonly resource!: _OSSResource
  public readonly ossUtils!: OSSUtils

  constructor(resource: _OSSResource, ossUtils: OSSUtils) {
    this.resource = resource
    this.ossUtils = ossUtils
  }

  public visitURL() {
    return this.ossUtils.signatureURL(this.resource.ossKey)
  }

  public getUploadMetadata() {
    const resource = this.resource
    return this.ossUtils.generateUploadMetadata(resource.ossKey, resource.size)
  }

  public getResourceUploadMetadata(): ResourceMetadata {
    const resource = this.resource
    return {
      resourceId: resource.resourceId,
      ossMetadata: this.getUploadMetadata(),
    }
  }

  public async markSucc() {
    const resource = this.resource
    assert.ok(
      await this.ossUtils.downloadClient().checkExists(resource.ossKey),
      '文件信息获取失败，文件可能尚未上传成功'
    )
    resource.fc_edit()
    // TODO: GET MIME Type
    resource.ossStatus = OSSStatus.Success
    await resource.updateToDB()
  }

  public modelForClient() {
    const resource = this.resource
    const data = resource.fc_pureModel() as OSSResourceModel
    data.url = this.visitURL()
    return data
  }

  public async downloadFile() {
    const resource = this.resource
    return await this.ossUtils.autoDownload(resource.ossKey)
  }

  async getFilePath(): Promise<string> {
    return await this.downloadFile()
  }
}
