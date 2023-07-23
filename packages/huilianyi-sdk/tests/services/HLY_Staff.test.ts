import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HLY_Staff.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`HLY_Staff`, async () => {
    const HLY_Staff = huilianyiService.modelsCore.HLY_Staff
    const items = await new HLY_Staff().fc_searcher().queryAllFeeds()
    console.info(
      JSON.stringify(
        items.map((item) => item.modelForClient()),
        null,
        2
      )
    )
  })

  it(`HLY_StaffGroup`, async () => {
    const HLY_StaffGroup = huilianyiService.modelsCore.HLY_StaffGroup
    const items = await new HLY_StaffGroup().fc_searcher().queryAllFeeds()
    console.info(
      JSON.stringify(
        items.map((item) => item.modelForClient()),
        null,
        2
      )
    )
  })
})
