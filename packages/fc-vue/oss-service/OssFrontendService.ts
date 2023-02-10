import { OssRouteData } from './services/OssRouteData'
import { FrontendPluginProtocol } from '../basic'
import { OssI18n } from './i18n/OssI18n'

interface Params {
  defaultBucketName: string
  defaultOssZone: string
}

class _OssFrontendService implements FrontendPluginProtocol {
  options!: Params

  routes = Object.values(OssRouteData)
  i18nMap = OssI18n

  public init(options: Params) {
    this.options = options
    return this
  }
}

export const OssFrontendService = new _OssFrontendService()
