import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test MonthAllowanceMaker.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`makeMonthAllowance`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)
    await huilianyiService.monthAllowanceMaker().makeMonthAllowance()

    // const searcher = new huilianyiService.modelsCore.HLY_TravelAllowance().fc_searcher()
    // searcher.processor().addConditionKV('is_pretty', 1)
    // const feeds = await searcher.queryAllFeeds()
    // console.info(
    //   JSON.stringify(
    //     feeds.map((item) => item.extrasData().closedLoops),
    //     null,
    //     2
    //   )
    // )
  })

  it(`lockAllowanceSnapshots`, async () => {
    await huilianyiService.monthAllowanceMaker().lockAllowanceSnapshots()
  })

  it(`removeExpiredAllowanceRecords`, async () => {
    await huilianyiService.monthAllowanceMaker().removeExpiredAllowanceRecords()
  })

  it(`findToFixAllowanceData`, async () => {
    const todoData = await huilianyiService.monthAllowanceMaker().findToFixAllowanceData('2023-08')
    console.info(`${todoData.toInsertItems.length} toInsertItems`)
    console.info(`${todoData.toUpdateItems.length} toUpdateItems`)
    // console.info(JSON.stringify(todoItems, null, 2))
  })

  it(`makeAllowanceSnapshot`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)
    await huilianyiService.monthAllowanceMaker().makeAllowanceSnapshot('2023-07')
    await huilianyiService.monthAllowanceMaker().makeAllowanceSnapshot('2023-08')
  })
})
