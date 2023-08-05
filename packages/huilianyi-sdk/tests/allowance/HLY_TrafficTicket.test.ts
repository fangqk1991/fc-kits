import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test HLY_AllowanceRule.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`HLY_TrafficTicket`, async () => {
    const pageResult = await huilianyiService.modelsCore.HLY_TrafficTicket.getPageResult({
      _sortKey: 'userName',
      _sortDirection: 'ASC',
    })
    console.info(JSON.stringify(pageResult.items, null, 2))
  })
})
