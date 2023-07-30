import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test HLY_Travel.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`HLY_Travel`, async () => {
    const HLY_Travel = huilianyiService.modelsCore.HLY_Travel

    const searcher = new HLY_Travel().fc_searcher()
    const feeds = await searcher.queryFeeds()
    for (const item of feeds) {
      const extrasData = item.extrasData()
      for (const user of extrasData.participants) {
        if (user.userOID !== user.participantOID) {
          console.error('!!!')
        }
        if (extrasData.participants.length > 1) {
          console.info(`[${item.businessCode}] ${extrasData.participants.length} participants.`)
        }
      }
    }
  })
})
