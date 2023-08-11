import { App_OrderBizType } from '../../src'
import * as assert from 'assert'
import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test HuilianyiModelsCore.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`HLY_Expense`, async () => {
    const HLY_Expense = huilianyiService.modelsCore.HLY_Expense
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

  it(`HLY_Invoice`, async () => {
    const HLY_Invoice = huilianyiService.modelsCore.HLY_Invoice
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

    const HLY_TravelAllowance = huilianyiService.modelsCore.HLY_TravelAllowance
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
    const HLY_OrderTrain = huilianyiService.modelsCore.HLY_OrderTrain
    // await huilianyiService.syncHandler().dumpTravelRecords(true)

    let feeds = await new HLY_OrderTrain().fc_searcher().queryFeeds()
    console.info(
      JSON.stringify(
        feeds.map((item) => ({
          orderId: item.hlyId,
          count: item.modelForClient().extrasData.userNamesStr,
        })),
        null,
        2
      )
    )
  })

  it(`HLY_ExpenseApplication.getFormNameList`, async () => {
    const formNameList = await huilianyiService.modelsCore.HLY_ExpenseApplication.getFormNameList()
    console.info(formNameList)
  })

  it(`HLY_Expense.getFormNameList`, async () => {
    const formNameList = await huilianyiService.modelsCore.HLY_Expense.getFormNameList()
    console.info(formNameList)
  })

  it(`HLY_OrderTrain.getOrderStatusList`, async () => {
    const HLY_OrderTrain = huilianyiService.modelsCore.HLY_OrderTrain
    const statusList = await HLY_OrderTrain.getOrderStatusList()
    console.info(statusList)
  })

  it(`HLY_OrderFlight.getOrderStatusList`, async () => {
    const HLY_OrderFlight = huilianyiService.modelsCore.HLY_OrderFlight
    const statusList = await HLY_OrderFlight.getOrderStatusList()
    console.info(statusList)
  })

  it(`HLY_OrderHotel.getOrderStatusList`, async () => {
    const HLY_OrderHotel = huilianyiService.modelsCore.HLY_OrderHotel
    const statusList = await HLY_OrderHotel.getOrderStatusList()
    console.info(statusList)
  })

  it(`Orders.fc_searcher`, async () => {
    const OrderModels = [
      huilianyiService.modelsCore.HLY_OrderFlight,
      huilianyiService.modelsCore.HLY_OrderTrain,
      huilianyiService.modelsCore.HLY_OrderHotel,
    ]
    for (const OrderModel of OrderModels) {
      {
        const searcher = new OrderModel().fc_searcher({
          bizType: App_OrderBizType.HasBusinessCode,
        })
        const feeds = await searcher.queryAllFeeds()
        for (const item of feeds) {
          assert.ok(!!item.businessCode)
        }
      }
      {
        const searcher = new OrderModel().fc_searcher({
          bizType: App_OrderBizType.SpecialOrder,
        })
        const feeds = await searcher.queryAllFeeds()
        for (const item of feeds) {
          assert.ok(['紧急预订', '紧急预定'].includes(item.journeyNo))
        }
      }
      {
        const searcher = new OrderModel().fc_searcher({
          bizType: App_OrderBizType.Others,
        })
        const feeds = await searcher.queryAllFeeds()
        for (const item of feeds) {
          assert.ok(!['紧急预订', '紧急预定'].includes(item.journeyNo))
          assert.ok(!item.businessCode)
        }
      }
    }
  })

  it(`$keywords`, async () => {
    const pageResult = await huilianyiService.modelsCore.HLY_Travel.getPageResult({
      $keywords: '方',
    })
    console.info(JSON.stringify(pageResult, null, 2))
  })
})
