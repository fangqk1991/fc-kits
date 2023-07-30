import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test TrafficItems.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`employeeTrafficItems`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_Travel().fc_searcher()
    searcher.processor().addConditionKV('match_closed_loop', 1)
    const items = await searcher.queryAllFeeds()
    for (const item of items) {
      const trafficItems = item.employeeTrafficItems()
      for (const traffic of trafficItems) {
        if (traffic.allowanceDayItems.length > 0) {
          console.info(traffic.allowanceDayItems)
        }
      }
    }
  })

  it(`HLY_OrderTrain users`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_OrderTrain().fc_searcher()
    const items = await searcher.queryAllFeeds()
    for (const item of items) {
      const extrasData = item.extrasData()
      if (extrasData.userNamesStr.split(',').length > 1) {
        console.info(JSON.stringify(item.modelForClient(), null, 2))
      }
    }
  })
})
