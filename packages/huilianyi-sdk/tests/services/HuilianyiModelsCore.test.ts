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

  it(`HLY_ExpenseApplication.getFormNameList`, async () => {
    const formNameList = await huilianyiService.modelsCore.HLY_ExpenseApplication.getFormNameList()
    console.info(formNameList)
  })

  it(`HLY_Expense.getFormNameList`, async () => {
    const formNameList = await huilianyiService.modelsCore.HLY_Expense.getFormNameList()
    console.info(formNameList)
  })

  it(`$keywords`, async () => {
    const pageResult = await huilianyiService.modelsCore.HLY_Travel.getPageResult({
      $keywords: '方',
    })
    console.info(JSON.stringify(pageResult, null, 2))
  })
})
