import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiSyncHandler } from './services/HuilianyiSyncHandler'
import { HuilianyiModelsCore } from './services/HuilianyiModelsCore'

interface Options {
  database: FCDatabase
  authConfig: BasicAuthConfig
}

export class HuilianyiService {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(options: Options) {
    this.modelsCore = new HuilianyiModelsCore(options.database)
    this.syncCore = new HuilianyiSyncCore({
      authConfig: options.authConfig,
      modelsCore: this.modelsCore,
    })
  }

  public syncHandler() {
    return new HuilianyiSyncHandler(this.syncCore)
  }
}
