import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfig } from './HuilianyiConfig'
import { HLY_ReportProxy } from '../../src'

describe('Test HLY_ReportProxy.test.ts', () => {
  const huilianyiProxy = new HLY_ReportProxy(HuilianyiConfig, CustomRequestFollower)

  it(`searchReimbursementData`, async () => {
    const items = await huilianyiProxy.searchReimbursementData()
    const dataList = items.map((item) => ({
      businessCode: item.businessCode,
      formTypeDesc: item.formTypeDesc,
      applicantName: item.applicantName,
      applicantDeptName: item.applicantDeptName,
      submittedByName: item.submittedByName,
      companyName: item.companyName,
      departmentName: item.departmentName,
      applicantDeptPath: item.applicantDeptPath,
      departmentPath: item.departmentPath,
      title: item.title,
      submittedDate: item.submittedDate,
      reimbStatusDesc: item.reimbStatusDesc,
      reimbLastModifiedDate: item.reimbLastModifiedDate,
      currencyCode: item.currencyCode,
      totalAmount: item.totalAmount,
      labelName: item.labelName,
      labelToast: item.labelToast,
      followingApprover: item.followingApprover,
      createdByName: item.createdByName,
      firstSubmittedDate: item.firstSubmittedDate,
      reimbPrintViewDate: item.reimbPrintViewDate,
      realPaymentAmountNew: item.realPaymentAmountNew,
    }))
    console.info(`${dataList.length} items.`)
    console.info(dataList)
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
