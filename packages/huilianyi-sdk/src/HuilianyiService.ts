import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiSyncHandler } from './services/HuilianyiSyncHandler'
import { HuilianyiModelsCore } from './services/HuilianyiModelsCore'
import { MonthAllowanceMaker } from './services/MonthAllowanceMaker'
import { TravelService } from './services/TravelService'
import { SystemConfigHandler } from './services/SystemConfigHandler'

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

  public monthAllowanceMaker() {
    return new MonthAllowanceMaker(this.modelsCore)
  }

  public travelService() {
    return new TravelService(this.modelsCore)
  }

  public configHandler() {
    return new SystemConfigHandler(this.modelsCore, this.syncCore)
  }
}
