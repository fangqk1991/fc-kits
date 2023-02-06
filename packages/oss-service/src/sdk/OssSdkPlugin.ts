import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { OssSpecDocItem } from '../specs'
import { OSSService, OssServiceOptions } from '../main'
import { ResourceHandleTask } from '../resque'

export const OssSdkPlugin = (options: OssServiceOptions): AppPluginProtocol => {
  const protocol: AppPluginProtocol = {
    appDidLoad: async () => {
      OSSService.init(options)
    },
    resqueModuleMap: {
      ResourceHandleTask: ResourceHandleTask,
    },
  }
  if (!options.skipSpecDocItem) {
    protocol.specDocItems = [OssSpecDocItem]
  }
  return protocol
}
