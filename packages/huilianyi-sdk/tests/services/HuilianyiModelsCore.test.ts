import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiModelsCore.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const HLY_Expense = huilianyiService.modelsCore.HLY_Expense
  const HLY_Travel = huilianyiService.modelsCore.HLY_Travel
  const HLY_Invoice = huilianyiService.modelsCore.HLY_Invoice
  const HLY_TravelAllowance = huilianyiService.modelsCore.HLY_TravelAllowance
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

    let feeds = await new HLY_Travel().fc_searcher().queryFeeds()
    // feeds = feeds.filter((item) => item.travelStatus === HLY_TravelStatus.Passed)
    console.info(
      JSON.stringify(
        feeds
          .filter((item) => item.extrasData().flightItems.length > 0)
          .map((item) => ({
            businessCode: item.businessCode,
            flightItems: item.extrasData().flightItems,
          })),
        null,
        2
      )
    )
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
