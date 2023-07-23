import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test PublicPaymentService.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const publicPaymentService = huilianyiService.publicPaymentService()

  it(`getCostOwnerReports`, async () => {
    const items = await publicPaymentService.getCostOwnerReports()
    console.info(JSON.stringify(items, null, 2))
  })
})
