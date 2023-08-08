import { BasicAuthConfig } from '@fangcha/tools'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HLY_BusinessDataProxy } from '../client/HLY_BusinessDataProxy'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { HLY_BasicDataProxy } from '../client/HLY_BasicDataProxy'
import { HLY_OthersProxy } from '../client/HLY_OthersProxy'
import { CTripOptions, CTripProxy } from '@fangcha/ctrip-sdk'

interface Options {
  authConfig: BasicAuthConfig
  modelsCore: HuilianyiModelsCore
  ctripConfig?: CTripOptions
}

export class HuilianyiSyncCore {
  public readonly options: Options

  public readonly dataProxy: HLY_BusinessDataProxy
  public readonly basicDataProxy: HLY_BasicDataProxy
  public readonly othersProxy: HLY_OthersProxy
  public readonly cTripProxy?: CTripProxy

  public readonly modelsCore!: HuilianyiModelsCore

  constructor(options: Options) {
    this.options = options

    this.modelsCore = options.modelsCore
    this.dataProxy = new HLY_BusinessDataProxy(options.authConfig, CustomRequestFollower)
    this.basicDataProxy = new HLY_BasicDataProxy(options.authConfig, CustomRequestFollower)
    this.othersProxy = new HLY_OthersProxy(options.authConfig, CustomRequestFollower)
    if (options.ctripConfig) {
      this.cTripProxy = new CTripProxy(options.ctripConfig, CustomRequestFollower)
    }
  }
}
