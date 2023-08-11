import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test PublicPaymentService.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev
  const publicPaymentService = huilianyiService.publicPaymentService()

  it(`getCostOwnerReports`, async () => {
    const items = await publicPaymentService.getCostOwnerReports()
    console.info(JSON.stringify(items, null, 2))
  })
})
