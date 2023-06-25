import { BasicAuthConfig } from '@fangcha/tools'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HLY_BusinessDataProxy } from '../client/HLY_BusinessDataProxy'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { HLY_BasicDataProxy } from '../client/HLY_BasicDataProxy'

interface Options {
  authConfig: BasicAuthConfig
  modelsCore: HuilianyiModelsCore
}

export class HuilianyiSyncCore {
  public readonly options: Options

  public readonly dataProxy: HLY_BusinessDataProxy
  public readonly basicDataProxy: HLY_BasicDataProxy

  public readonly modelsCore!: HuilianyiModelsCore

  constructor(options: Options) {
    this.options = options

    this.modelsCore = options.modelsCore
    this.dataProxy = new HLY_BusinessDataProxy(options.authConfig, CustomRequestFollower)
    this.basicDataProxy = new HLY_BasicDataProxy(options.authConfig, CustomRequestFollower)
  }
}