export interface ResourceTaskParams {
  userEmail: string
  taskType: string
  rawParams: {}
  fileName: string
}

export enum ResourceTaskStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Success = 'Success',
  Fail = 'Fail',
}

export interface ResourceTaskModel {
  taskKey: string
  resourceId: string
  provider: string
  bucketName: string
  ossKey: string
  mimeType: string
  size: number
  taskType: string
  fileName: string
  current: number
  total: number
  taskStatus: ResourceTaskStatus
  errorMessage: string
  rawParamsStr: string
  createTime: string
  updateTime: string
  // Extras
  downloadUrl: string
}
