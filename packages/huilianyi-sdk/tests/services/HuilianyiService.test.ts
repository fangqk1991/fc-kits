import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`reloadExpenseTypeMetadata`, async () => {
    await huilianyiService.reloadExpenseTypeMetadata()
    const metadata = await huilianyiService.getExpenseTypeMetadata()
    console.info(JSON.stringify(metadata, null, 2))
  })

  it(`getExpenseTypeMetadata`, async () => {
    const metadata = await huilianyiService.getExpenseTypeMetadata()
    console.info(JSON.stringify(metadata, null, 2))
  })

  it(`makeMonthAllowance`, async () => {
    await huilianyiService.syncHandler().dumpTravelRecords(true)
    await huilianyiService.makeMonthAllowance()
  })

  it(`makeAllowanceSnapshot`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)
    await huilianyiService.makeAllowanceSnapshot('2023-05')
    await huilianyiService.makeAllowanceSnapshot('2023-06')
    await huilianyiService.makeAllowanceSnapshot('2023-07')
  })
})
