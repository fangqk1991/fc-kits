import { AppPluginProtocol } from '../basic'
import { ResqueProtocol } from './ResqueProtocol'
import { FCMaster, Resque } from '@fangcha/resque'
import { ResqueObserverHelper } from './ResqueObserverHelper'

export const ResqueSdkPlugin = (options: ResqueProtocol): AppPluginProtocol => {
  return {
    appDidLoad: (app) => {
      Resque.addObserver(options.observer || ResqueObserverHelper.makeDefaultObserver())

      for (const plugin of app.plugins) {
        if (plugin.resqueModuleMap) {
          options.moduleMapData = {
            ...options.moduleMapData,
            ...plugin.resqueModuleMap,
          }
        }
      }

      const master = new FCMaster(options)
      master.run()
    },
  }
}
