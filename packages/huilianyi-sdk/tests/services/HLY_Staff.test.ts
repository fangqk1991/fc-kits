import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test HLY_Staff.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

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
