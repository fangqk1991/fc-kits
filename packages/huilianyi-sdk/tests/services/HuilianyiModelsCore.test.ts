import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HLY_Travel, HuilianyiService } from '../../src'
import { _HLY_OrderFlight } from '../../src/models/extensions/_HLY_OrderFlight'

describe('Test HuilianyiModelsCore.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const HLY_Expense = huilianyiService.modelsCore.HLY_Expense
  const HLY_Travel = huilianyiService.modelsCore.HLY_Travel
  const HLY_Invoice = huilianyiService.modelsCore.HLY_Invoice
  const HLY_TravelAllowance = huilianyiService.modelsCore.HLY_TravelAllowance
  const HLY_OrderFlight = huilianyiService.modelsCore.HLY_OrderFlight
  const HLY_OrderTrain = huilianyiService.modelsCore.HLY_OrderTrain

  it(`HLY_Expense`, async () => {
    await huilianyiService.syncHandler().dumpExpenseRecords(true)

    const feeds = await new HLY_Expense().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds
          .filter((item) => item.formName.includes('差旅费报销'))
          .map((item) => item.modelForClient().extrasData.invoiceVOList),
        null,
        2
      )
    )
  })

  it(`HLY_Travel`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)

    const mapper: { [businessCode: string]: _HLY_OrderFlight[] } = {}
    {
      const searcher0 = new HLY_OrderFlight().fc_searcher()
      searcher0.processor().addSpecialCondition('LENGTH(business_code) = 10')
      const feeds = await searcher0.queryFeeds()
      for (const item of feeds) {
        const businessCode = item.businessCode!
        if (!mapper[businessCode]) {
          mapper[businessCode] = []
        }
        mapper[businessCode].push(item)
      }
    }
    const businessCodeList = Object.keys(mapper)

    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
    // searcher.processor().addSpecialCondition('travel_status != ?', HLY_TravelStatus.Deleted)
    const feeds = await searcher.queryFeeds()
    const dataList = feeds.map((item) => ({
      ...item.modelForClient(),
      rawData: JSON.parse(item.rawDataStr) as HLY_Travel,
      rawData2: JSON.parse(item.rawData2Str) as HLY_Travel,
    }))
    for (const item of dataList) {
      const orders = mapper[item.businessCode]
      console.info(
        `[${item.businessCode}] orders: ${orders.length}, flightItems: ${item.extrasData.flightItems.length}`
      )
      // console.info(JSON.stringify(diffItems, null, 2))
      // break
    }

    // // feeds = feeds.filter((item) => item.travelStatus === HLY_TravelStatus.Passed)
    // console.info(
    //   JSON.stringify(
    //     dataList
    //       .filter(
    //         (item) =>
    //           item.extrasData.itineraryMap.TRAIN &&
    //           item.extrasData.itineraryMap.TRAIN.reduce((result, cur) => result + cur.trainOrderInfoList.length, 0) > 0
    //       )
    //       // .filter((item) => item.itineraryItems.length > 0)
    //       .map((item) => {
    //         const trainItems: App_TravelTrainTicketInfo[] = []
    //         for (const order of item.extrasData.itineraryMap.TRAIN!) {
    //           trainItems.push(
    //             ...order.trainOrderInfoList.map((item) => HuilianyiFormatter.transferTrainTicketInfo(item))
    //           )
    //         }
    //         return {
    //           businessCode: item.businessCode,
    //           trainItems: trainItems,
    //           // itineraryCount: item.itineraryItems.length,
    //           // itinerarySummary: item.itineraryItems.map((itinerary) => ({
    //           //   // trainCount: itinerary.trainTickets?.length || 0,
    //           //   flightCount: itinerary.flightTickets?.length || 0,
    //           // })),
    //           // flightCount: item.extrasData.flightItems.length,
    //         }
    //       }),
    //     null,
    //     2
    //   )
    // )
  })

  it(`HLY_Invoice`, async () => {
    const feeds = await new HLY_Invoice().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds
          .filter((item) => item.expenseTypeName.startsWith('差旅'))
          .map((item) => ({
            expenseTypeName: item.expenseTypeName,
            ...item
              .modelForClient()
              .extrasData.data.map((field) => ({
                fieldType: field.fieldDataType,
                fieldDataType: field.fieldDataType,
                name: field.name,
                value: field.value,
              }))
              .reduce((result, cur) => {
                result[cur.name] = cur.value
                return result
              }, {}),
          })),
        null,
        2
      )
    )
  })

  it(`HLY_TravelAllowance`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)

    let feeds = await new HLY_TravelAllowance().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds.map((item) => item.modelForClient()),
        null,
        2
      )
    )
  })

  it(`HLY_OrderTrain`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)

    let feeds = await new HLY_OrderTrain().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds.map((item) => ({
          orderId: item.hlyId,
          count: item.modelForClient().extrasData.usersStr,
        })),
        null,
        2
      )
    )
  })
})
