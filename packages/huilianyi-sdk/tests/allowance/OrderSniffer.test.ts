import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'
import {
  App_TravelFlightTicketInfo,
  App_TravelOrderExtras,
  App_TravelTrainTicketInfo,
  HLY_TravelStatus,
} from '../../src'
import { TimeUtils } from '../../src/core/tools/TimeUtils'

describe('Test OrderSniffer.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`Check flight orders`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_OrderFlight().fc_searcher()
    searcher.processor().addConditionKeyInArray('journey_no', ['紧急预订', '紧急预定'])
    const items = await searcher.queryAllFeeds()
    let niceTicketsCount = 0
    for (const item of items) {
      const extrasData = item.extrasData() as App_TravelOrderExtras<App_TravelFlightTicketInfo>
      // console.info(
      //   item.applicantName,
      //   item.userOid,
      //   extrasData.usersStr,
      //   extrasData.tickets.length,
      //   extrasData.tickets.map((ticket) => `${ticket.startDate} ~ ${ticket.endDate}`)
      // )

      const searcher = new huilianyiService.modelsCore.HLY_Travel().fc_searcher()
      searcher.processor().addConditionKV('applicant_oid', item.userOid)
      searcher.processor().addConditionKV('match_closed_loop', 0)
      searcher.processor().addConditionKeyNotInArray('travel_status', [HLY_TravelStatus.Init, HLY_TravelStatus.Deleted])
      for (const ticket of extrasData.tickets) {
        const keyTs = TimeUtils.momentUTC8(ticket.startDate).unix()
        searcher
          .processor()
          .addSpecialCondition('start_time <= FROM_UNIXTIME(?) AND end_time >= FROM_UNIXTIME(?)', keyTs, keyTs)
      }
      const matchTravels = await searcher.queryAllFeeds()
      if (matchTravels.length > 0) {
        console.info(`Order[${item.hlyId}] match ${matchTravels.length} travels`)
        ++niceTicketsCount

        if (matchTravels.length === 1) {
          const travelItem = matchTravels[0]
          item.fc_edit()
          item.businessCode = travelItem.businessCode
          await item.updateToDB()
        }
      }
      if (matchTravels.length > 1) {
        console.info(
          extrasData.tickets,
          matchTravels.map((item) => `[${item.businessCode}] ${item.travelStatus}`)
        )
      }
    }
    console.info(`Flight tickets: ${niceTicketsCount} / ${items.length}`)
  })

  it(`Check train orders`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_OrderTrain().fc_searcher()
    searcher.processor().addConditionKeyInArray('journey_no', ['紧急预订', '紧急预定'])
    searcher.processor().addConditionKeyInArray('order_status', ['已购票', '待出票'])
    const items = await searcher.queryAllFeeds()
    let niceTicketsCount = 0
    for (const item of items) {
      const extrasData = item.extrasData() as App_TravelOrderExtras<App_TravelTrainTicketInfo>
      // console.info(
      //   item.applicantName,
      //   item.userOid,
      //   extrasData.usersStr,
      //   extrasData.tickets.length,
      //   extrasData.tickets.map((ticket) => `${ticket.startDate} ~ ${ticket.endDate}`)
      // )
      if (extrasData.tickets.length === 0) {
        continue
      }

      const searcher = new huilianyiService.modelsCore.HLY_Travel().fc_searcher()
      searcher.processor().addConditionKV('applicant_oid', item.userOid)
      searcher.processor().addConditionKV('match_closed_loop', 0)
      searcher.processor().addConditionKeyNotInArray('travel_status', [HLY_TravelStatus.Init, HLY_TravelStatus.Deleted])
      for (const ticket of extrasData.tickets) {
        const keyTs = TimeUtils.momentUTC8(ticket.startDate).unix()
        searcher
          .processor()
          .addSpecialCondition('start_time <= FROM_UNIXTIME(?) AND end_time >= FROM_UNIXTIME(?)', keyTs, keyTs)
      }
      const matchTravels = await searcher.queryAllFeeds()
      if (matchTravels.length > 0) {
        console.info(`Order[${item.hlyId}] match ${matchTravels.length} travels`)
        ++niceTicketsCount

        if (matchTravels.length === 1) {
          const travelItem = matchTravels[0]
          item.fc_edit()
          item.businessCode = travelItem.businessCode
          await item.updateToDB()
        }
      }
      if (matchTravels.length > 1) {
        console.info(
          extrasData.tickets,
          matchTravels.map((item) => `[${item.businessCode}] ${item.travelStatus}`)
        )
      }
    }
    console.info(`Train tickets: ${niceTicketsCount} / ${items.length}`)
  })
})

// Flight: 5 / 14
