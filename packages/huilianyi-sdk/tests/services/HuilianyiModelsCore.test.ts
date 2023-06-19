import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiModelsCore.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const HLY_Expense = huilianyiService.modelsCore.HLY_Expense

  it(`HLY_Expense`, async () => {
    const feeds = await new HLY_Expense().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds.map((item) => item.fc_pureModel()),
        null,
        2
      )
    )
  })
})
