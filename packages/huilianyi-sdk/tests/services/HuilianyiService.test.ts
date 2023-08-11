import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`reloadExpenseTypeMetadata`, async () => {
    await huilianyiService.configHandler().reloadExpenseTypeMetadata()
    const metadata = await huilianyiService.configHandler().getExpenseTypeMetadata()
    console.info(JSON.stringify(metadata, null, 2))
  })

  it(`getExpenseTypeMetadata`, async () => {
    const metadata = await huilianyiService.configHandler().getExpenseTypeMetadata()
    console.info(JSON.stringify(metadata, null, 2))
  })

  it(`syncAndRefreshData`, async () => {
    await huilianyiService.syncHandler().dumpCtripOrders()
    await huilianyiService.syncAndRefreshData()
  })
})
