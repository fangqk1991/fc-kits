import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfig } from './HuilianyiConfig'
import { HLY_ReportProxy } from '../../src'

describe('Test HLY_ReportProxy.test.ts', () => {
  const huilianyiProxy = new HLY_ReportProxy(HuilianyiConfig, CustomRequestFollower)

  it(`searchReimbursementData`, async () => {
    const items = await huilianyiProxy.searchReimbursementData()
    const keyTextList = items.map(
      (item) =>
        `${item.businessCode} - ${item.applicantName}(${item.submittedByName}) - ${item.reimbStatusDesc} - ${item.submittedDate}`
    )
    // console.info(JSON.stringify(items, null, 2))
    console.info(`${keyTextList.length} items.`)
    console.info(keyTextList)
  })

  it(`searchExpenseDetailsData`, async () => {
    const items = await huilianyiProxy.searchExpenseDetailsData()
    console.info(`${items.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })

  it(`searchTravelApplyData`, async () => {
    const items = await huilianyiProxy.searchTravelApplyData()
    console.info(`${items.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })

  it(`searchContractData`, async () => {
    const items = await huilianyiProxy.searchContractData('')
    console.info(`${items.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })
})
