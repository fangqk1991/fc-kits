import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test Searchers.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`HLY_ExpenseApplication.fc_searcher`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_ExpenseApplication().fc_searcher({
      'totalAmount.$lt': 1000,
    })
    const processor = searcher.processor()
    processor.setColumns(['applicant_name AS applicantName', 'COUNT(*) AS count'])
    processor.setGroupByKeys(['applicantName'])
    const items = await processor.queryList()
    console.info(JSON.stringify(items, null, 2))
  })
})
