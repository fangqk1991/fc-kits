import { HuilianyiServiceDev } from './HuilianyiServiceDev'
import * as assert from 'assert'
import { HLY_TravelStatus } from '../../src'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev
  const travelService = huilianyiService.travelService()
  const HLY_Travel = huilianyiService.modelsCore.HLY_Travel

  it(`fillCTripTicketsBusinessCode`, async () => {
    await travelService.fillCTripTicketsBusinessCode()
  })

  it(`makeCommonTrafficTickets`, async () => {
    await travelService.makeCommonTrafficTickets()
  })

  it(`makeDummyTravel - only`, async () => {
    const ticketIdList = ['2bbb8db96a7f778b32de4146521dbbb6', 'f37376b1f0349f7733c6201a458314dd']
    await travelService.clearTicketsBusinessCode(ticketIdList)
    await travelService.makeDummyTravel(ticketIdList)
  })

  it(`makeDummyTravel`, async () => {
    const ticketIdList = ['2bbb8db96a7f778b32de4146521dbbb6', 'f37376b1f0349f7733c6201a458314dd']
    await travelService.clearTicketsBusinessCode(ticketIdList)
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

  it(`findOverlappedTravelForms`, async () => {
    const items = await travelService.findOverlappedTravelForms()
    console.info(items)
  })

  it(`refreshOverlappedFlags`, async () => {
    await travelService.refreshOverlappedFlags()
  })

  it(`findLonelyTicketsData`, async () => {
    const ticketsData = await travelService.findLonelyTicketsData()
    console.info(ticketsData)
  })

  it(`removeEmptyDummyTravels`, async () => {
    await travelService.removeEmptyDummyTravels()
  })

  it(`getEmptyDummyTravels`, async () => {
    const items = await travelService.getEmptyDummyTravels()
    console.info(`${items.length} items.`)
    console.info(items.map((item) => item.modelForClient()))
  })

  it(`createDummyTravelsByLonelyTickets`, async () => {
    await travelService.createDummyTravelsByLonelyTickets()
  })

  it(`syncDummyTravelRecords`, async () => {
    const ticketIdList = ['2bbb8db96a7f778b32de4146521dbbb6', 'f37376b1f0349f7733c6201a458314dd']
    await travelService.clearTicketsBusinessCode(ticketIdList)
    await travelService.makeDummyTravel(ticketIdList)

    await huilianyiService.syncHandler().syncDummyTravelRecords()
    await travelService.makeCommonTrafficTickets()
    await travelService.refreshTravelTicketItemsData()
  })
})
