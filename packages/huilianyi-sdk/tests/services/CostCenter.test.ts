import { App_CostCenterItem, App_CostCenterMetadata } from '../../src'
import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test CostCenter.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev
  const basicDataProxy = huilianyiService.syncCore.basicDataProxy

  it(`calcMetadata`, async () => {
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
    console.info(JSON.stringify(metadata, null, 2))
  })
})
