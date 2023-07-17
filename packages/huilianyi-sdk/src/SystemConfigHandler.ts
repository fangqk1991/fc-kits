import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiModelsCore } from './services/HuilianyiModelsCore'
import { RetainConfigKey } from './core/App_CoreModels'

export class SystemConfigHandler {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore, syncCore: HuilianyiSyncCore) {
    this.modelsCore = modelsCore
    this.syncCore = syncCore
  }

  public async setConfig(key: string, value: any) {
    const feed = new this.modelsCore.HLY_Config()
    feed.configKey = key
    feed.configDataStr = JSON.stringify({
      data: value,
    })
    await feed.strongAddToDB()
    return feed
  }

  public async getConfig(key: string, fetchFunc?: () => Promise<any>) {
    let feed = await this.modelsCore.HLY_Config.findWithUid(key)
    if (!feed) {
      feed = await this.setConfig(key, fetchFunc ? await fetchFunc() : null)
    }
    return feed.configData()
  }

  public async reloadExpenseTypeMetadata() {
    const dataList = await this.syncCore.basicDataProxy.getExpenseTypeList()
    const mapper = dataList.reduce((result, cur) => {
      result[cur.code] = cur.name
      return result
    }, {})
    await this.setConfig(RetainConfigKey.ExpenseTypeMetadata, mapper)
    return mapper
  }

  public async getExpenseTypeMetadata() {
    return await this.getConfig(RetainConfigKey.ExpenseTypeMetadata, async () => {
      return this.reloadExpenseTypeMetadata()
    })
  }
}
