import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HLY_AllowanceRule.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`HLY_AllowanceRule`, async () => {
    const feeds = await new huilianyiService.modelsCore.HLY_AllowanceRule().fc_searcher().queryAllFeeds()
    console.info(
      JSON.stringify(
        feeds.map((item) => item.modelForClient()),
        null,
        2
      )
    )
  })
})
