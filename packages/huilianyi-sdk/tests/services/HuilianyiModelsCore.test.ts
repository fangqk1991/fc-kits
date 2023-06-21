import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiModelsCore.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const HLY_Expense = huilianyiService.modelsCore.HLY_Expense
  const HLY_Travel = huilianyiService.modelsCore.HLY_Travel

  it(`HLY_Expense`, async () => {
    await huilianyiService.syncHandler().dumpExpenseRecords(true)

    const feeds = await new HLY_Expense().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds
          .filter((item) => item.formName.includes('差旅费报销'))
          .map((item) => item.modelForClient().extrasData.invoiceVOList),
        null,
        2
      )
    )
  })

  it(`HLY_Travel`, async () => {
    await huilianyiService.syncHandler().dumpTravelRecords(true)

    const feeds = await new HLY_Travel().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds
          // .filter((item) => item.formName.includes('差旅费报销'))
          .map((item) => item.modelForClient().extrasData.travelApplication?.itineraryMap.TRAIN),
        null,
        2
      )
    )
  })
})
