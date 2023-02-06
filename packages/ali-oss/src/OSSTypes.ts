export interface AliOSSOptions {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  secure?: boolean // instruct OSS client to use HTTPS (secure: true) or HTTP (secure: false) protocol.
}

export interface UploadSignatureOptions {
  accessKeyId: string
  accessKeySecret: string
  bucketURL: string
  timeout: number // 单位: 秒
}

export interface AliUploadParams {
  OSSAccessKeyId: string
  policy: string
  Signature: string
  key: string
  success_action_status: 200
}

export interface AliUploadMetadata {
  url: string
  params: AliUploadParams
}
