export const OssApis = {
  OssResourcePrepare: {
    method: 'POST',
    route: '/api/v0/oss/bucket/:bucketName/zone/:ossZone/resource',
    description: '准备 OSS 上传需要的相关信息',
  },
  OssResourceStatusMark: {
    method: 'PUT',
    route: '/api/v0/oss/resource/:resourceId',
    description: '标记 OSS 资源已上传',
  },
}
