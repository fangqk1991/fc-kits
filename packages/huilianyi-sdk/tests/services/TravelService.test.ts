import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev
  const travelService = huilianyiService.travelService()
  const HLY_OrderTrain = huilianyiService.modelsCore.HLY_OrderTrain
  const HLY_OrderFlight = huilianyiService.modelsCore.HLY_OrderFlight
  const HLY_Travel = huilianyiService.modelsCore.HLY_Travel

  it(`getTravelTrafficItems - Train`, async () => {
    const searcher0 = new HLY_OrderTrain().fc_searcher()
    searcher0.processor().addSpecialCondition('LENGTH(business_code) = 10')
    const travelItem = (await searcher0.queryOne())!

    const trafficItems = await travelService.getTravelTrafficItems(travelItem.businessCode)
    console.info(trafficItems)
  })

  it(`getTravelTrafficItems - Flight`, async () => {
    const searcher0 = new HLY_OrderFlight().fc_searcher()
    searcher0.processor().addSpecialCondition('LENGTH(business_code) = 10')
    const travelItem = (await searcher0.queryOne())!

    const trafficItems = await travelService.getTravelTrafficItems(travelItem.businessCode)
    console.info(trafficItems)
  })

  it(`fillTravelOrdersBusinessCode`, async () => {
    await travelService.fillTravelOrdersBusinessCode()
  })

  it(`makeCommonTrafficTickets`, async () => {
    await travelService.makeCommonTrafficTickets()
  })

  it(`makeDummyTravel`, async () => {
    await travelService.makeDummyTravel(['2bbb8db96a7f778b32de4146521dbbb6', 'f37376b1f0349f7733c6201a458314dd'])
  })

  it(`refreshTravelTicketItemsData`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)
    // await huilianyiService.syncHandler().dumpOrderFlightRecords(true)
    // await huilianyiService.syncHandler().dumpOrderTrainRecords(true)
    await travelService.refreshTravelTicketItemsData()

    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addSpecialCondition('employee_traffic_items_str IS NOT NULL')
    const items = await searcher.queryAllFeeds()
    for (const travelItem of items) {
      const trafficItems = travelItem.employeeTrafficItems()
      if (trafficItems.filter((item) => item.isClosedLoop).length > 0) {
        console.info(travelItem.businessCode, travelItem.matchClosedLoop, travelItem.isPretty)
        // console.info(travelItem.businessCode, JSON.stringify(trafficItems, null, 2))
      }
    }
  })

  it(`refreshTravelParticipants`, async () => {
    await travelService.refreshTravelParticipants()
  })
})
