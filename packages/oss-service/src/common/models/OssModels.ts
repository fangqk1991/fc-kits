import { OSSProvider } from './OSSProvider'
import { OSSStatus } from './OSSStatus'

export interface OssFileInfo {
  ossKey: string
  mimeType: string
  size: number
  url?: string
}

export interface OssRawParams {
  fileHash: string
  mimeType: string
  fileExt: string
  fileSize: number
}

export interface OssTypicalParams extends OssRawParams {
  bucketName: string
  ossZone: string
  fileHash: string
  mimeType: string
  fileExt: string
  fileSize: number
}

export interface OSSResourceParams {
  bucketName: string
  ossKey: string
  size: number
  uploader: string
  mimeType?: string
}

export interface OSSResourceModel extends OSSResourceParams {
  resourceId: string
  provider: OSSProvider
  mimeType: string
  ossStatus: OSSStatus
  createTime: string
  updateTime: string
  url: string
}

export interface ResourceMetadata {
  resourceId: string
  ossMetadata: {
    url: string
    params: {
      OSSAccessKeyId: string
      policy: string
      Signature: any
      key: string
      success_action_status: number
    }
  }
}

export type MetadataBuildProtocol = (params: OssTypicalParams) => Promise<ResourceMetadata>
export type OssResourceStatusMarkProtocol = (resourceId: string) => Promise<OSSResourceModel>
