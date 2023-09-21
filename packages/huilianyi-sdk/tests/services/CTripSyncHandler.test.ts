import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test CTripSyncHandler.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`dumpCtripOrders`, async () => {
    await huilianyiService.ctripHandler().dumpCtripOrders()
  })

  it(`extractTrainTicketsFromOrders`, async () => {
    await huilianyiService.ctripHandler().extractTrainTicketsFromOrders()
  })

  it(`extractFlightTicketsFromOrders`, async () => {
    await huilianyiService.ctripHandler().extractFlightTicketsFromOrders()
  })

  it(`fetchCtripOrderIds`, async () => {
    const orderIdList = await huilianyiService.ctripHandler().fetchCtripOrderIds()
    console.info(orderIdList)
  })
})
