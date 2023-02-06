import { SwaggerDocItem } from '@fangcha/router'
import { OssSpecs } from './OssSpecs'
import { DownloadSpecs } from './DownloadSpecs'

export const OssSpecDocItem: SwaggerDocItem = {
  name: 'OSS 上传 / 下载',
  pageURL: '/api-docs/v1/oss',
  specs: [...OssSpecs, ...DownloadSpecs],
}
