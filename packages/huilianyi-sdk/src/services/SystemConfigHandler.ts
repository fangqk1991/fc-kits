import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_CostCenterItem, App_CostCenterMetadata, App_StaffCore, RetainConfigKey } from '../core/basic/App_CoreModels'

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

  public async getWholeConfigs(): Promise<{ [configKey: string]: any }> {
    const searcher = await new this.modelsCore.HLY_Config().fc_searcher()
    const feeds = await searcher.queryAllFeeds()
    return feeds.reduce((result, cur) => {
      result[cur.configKey] = cur.configData()
      return result
    }, {})
  }

  public async getConfig<T = any>(key: string, fetchFunc?: () => Promise<T>) {
    let feed = await this.modelsCore.HLY_Config.findWithUid(key)
    if (!feed) {
      feed = await this.setConfig(key, fetchFunc ? await fetchFunc() : null)
    }
    return feed.configData() as T
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

  public async reloadManagerMetadata() {
    const proxy = this.syncCore.basicDataProxy
    let mapper: { [userOID: string]: App_StaffCore } = {}
    const groupList = await proxy.getUserGroupList()
    const group = groupList.find((group) => group.name === '管理层')!
    if (group) {
      const members = await proxy.getUserGroupMembers(group.code)
      mapper = members.reduce((result, cur) => {
        result[cur.userOID] = {
          userOID: cur.userOID,
          employeeID: cur.employeeID,
          fullName: cur.fullName,
        }
        return result
      }, {} as { [p: string]: App_StaffCore })
    }
    await this.setConfig(RetainConfigKey.ManagerMetadata, mapper)
    return mapper
  }

  public async getManagerMetadata() {
    return await this.getConfig(RetainConfigKey.ManagerMetadata, async () => {
      return this.reloadManagerMetadata()
    })
  }

  public async reloadCostCenterMetadata() {
    const basicDataProxy = this.syncCore.basicDataProxy
    const metadata: App_CostCenterMetadata = {}
    const costCenterList = await basicDataProxy.getEnabledCostCenterList()
    for (const costCenter of costCenterList) {
      const items = await basicDataProxy.getCostCenterItems(costCenter.code)
      metadata[costCenter.code] = {
        costCenterOID: costCenter.costCenterOID,
        name: costCenter.name,
        code: costCenter.code,
        itemMap: items.reduce((result, cur) => {
          result[cur.costCenterItemOID] = {
            itemId: cur.costCenterItemOID,
            name: cur.name,
          }
          return result
        }, {} as { [p: string]: App_CostCenterItem }),
      }
    }
    await this.setConfig(RetainConfigKey.CostCenterMetadata, metadata)
    return metadata
  }

  public async getCostCenterMetadata() {
    return await this.getConfig(RetainConfigKey.CostCenterMetadata, async () => {
      return this.reloadCostCenterMetadata()
    })
  }
}
