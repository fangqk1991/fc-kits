import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiSyncHandler } from './services/HuilianyiSyncHandler'

interface Options {
  database: FCDatabase
  authConfig: BasicAuthConfig
}

export class HuilianyiService {
  private readonly syncCore: HuilianyiSyncCore

  constructor(options: Options) {
    this.syncCore = new HuilianyiSyncCore(options)
  }

  public syncHandler() {
    return new HuilianyiSyncHandler(this.syncCore)
  }
}
