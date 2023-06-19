import { BasicAuthConfig } from '@fangcha/tools'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HLY_BusinessDataProxy } from '../client/HLY_BusinessDataProxy'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'

interface Options {
  authConfig: BasicAuthConfig
  modelsCore: HuilianyiModelsCore
}

export class HuilianyiSyncCore {
  public readonly options: Options

  public readonly dataProxy: HLY_BusinessDataProxy

  public readonly modelsCore!: HuilianyiModelsCore

  constructor(options: Options) {
    this.options = options

    this.modelsCore = options.modelsCore
    this.dataProxy = new HLY_BusinessDataProxy(options.authConfig, CustomRequestFollower)
  }
}
