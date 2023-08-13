import { HuilianyiServiceDev } from './HuilianyiServiceDev'
import * as assert from 'assert'
import { HLY_TravelStatus } from '../../src'

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
    const ticketIdList = ['2bbb8db96a7f778b32de4146521dbbb6', 'f37376b1f0349f7733c6201a458314dd']
    const dummyTravel = await travelService.makeDummyTravel(ticketIdList)
    assert.strictEqual(dummyTravel.version, 0)
    {
      const searcher = new travelService.modelsCore.HLY_TrafficTicket().fc_searcher()
      searcher.processor().addConditionKV('business_code', dummyTravel.businessCode)
      const items = await searcher.queryAllFeeds()
      assert.ok(items.length === ticketIdList.length)
      for (const ticket of items) {
        assert.ok(ticket.businessCode === dummyTravel.businessCode)
        assert.ok(!!ticketIdList.includes(ticket.ticketId))
      }
    }
    await travelService.deleteDummyTravel(dummyTravel.businessCode)
    {
      const dummyForm2 = await travelService.modelsCore.Dummy_Travel.findWithBusinessCode(dummyTravel.businessCode)
      assert.strictEqual(dummyForm2.version, 1)
      assert.strictEqual(dummyForm2.travelStatus, HLY_TravelStatus.Deleted)
    }
    {
      const searcher = new travelService.modelsCore.HLY_TrafficTicket().fc_searcher()
      searcher.processor().addConditionKV('business_code', dummyTravel.businessCode)
      const items = await searcher.queryAllFeeds()
      assert.ok(items.length === 0)
    }
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

  it(`syncDummyTravelRecords`, async () => {
    await huilianyiService.syncHandler().syncDummyTravelRecords()
  })
})
