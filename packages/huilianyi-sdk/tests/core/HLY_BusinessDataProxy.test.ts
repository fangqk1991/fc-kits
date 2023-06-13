import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfigTest } from '../HuilianyiConfigTest'
import {
  HLY_BusinessDataProxy,
  HLY_PublicApplicationStatusDescriptor,
  HLY_ReimburseStatus,
  HLY_ReimburseStatusDescriptor,
} from '../../src'
import { DiffMapper } from '@fangcha/tools'

describe('Test HLY_BusinessDataProxy.test.ts', () => {
  const businessDataProxy = new HLY_BusinessDataProxy(HuilianyiConfigTest, CustomRequestFollower)

  it(`getPublicApplicationList`, async () => {
    const items = await businessDataProxy.getPublicApplicationList()
    const dataList = items.map((item) => ({
      version: item.version,
      title: `[${item.formName}] ${item.title}`,
      applicantName: item.applicant.fullName,
      createdDate: item.createdDate,
      totalAmount: `${item.originCurrencyCode} ${item.totalAmount}`,
      status: `${item.status} (${HLY_PublicApplicationStatusDescriptor.describe(item.status)})`,
      formData: item.custFormValues.reduce((result, cur) => {
        result[cur.fieldName] = cur.value
        return result
      }, {}),
      formData2: item.custFormValues.reduce((result, cur) => {
        result[cur.fieldCode || cur.fieldOID] = cur.value
        return result
      }, {}),
    }))
    console.info(`${dataList.length} items.`)
    console.info(JSON.stringify(dataList, null, 2))
    // console.info(JSON.stringify(items[0]))
  })

  it(`updateApplicationCustomFormValue`, async () => {
    const businessCode = 'EA00985097'
    const amount = 3000 + Math.floor(Math.random() * 1000)
    await businessDataProxy.updateApplicationCustomFormValue(businessCode, {
      field_amount_refer: amount,
    })
    const response = await businessDataProxy.getPublicApplicationDetail(businessCode)
    console.info(
      response.custFormValues.reduce((result, cur) => {
        result[cur.fieldCode || cur.fieldOID] = cur.value
        return result
      }, {})
    )
  })

  it(`getExpenseReportList`, async () => {
    const items = await businessDataProxy.getExpenseReportList({
      // statusList: [HLY_ReimburseStatus.Passed, HLY_ReimburseStatus.Paid],
    })
    const dataList = items.map((item) => ({
      title: item.title,
      applicantName: item.applicantName,
      createdDate: item.createdDate,
      status: item.status,
      statusText: HLY_ReimburseStatusDescriptor.describe(item.status),
      applicationBusinessCode: item.applicationBusinessCode,
    }))
    console.info(`${dataList.length} items.`)
    console.info(JSON.stringify(dataList, null, 2))
    // console.info(JSON.stringify(items[1]))
  })

  it(`getExpenseReportListV2`, async () => {
    const items = await businessDataProxy.getExpenseReportListV2({
      // statusList: [HLY_ReimburseStatus.Passed, HLY_ReimburseStatus.Paid],
      lastModifyStartDate: '2023-06-09 17:24:07',
    })
    const dataList = items.map((item) => ({
      id: item.id,
      title: item.title,
      applicantName: item.applicantName,
      createdDate: item.createdDate,
      lastModifiedDate: item.lastModifiedDate,
      status: item.status,
      statusText: HLY_ReimburseStatusDescriptor.describe(item.status),
    }))
    console.info(`${dataList.length} items.`)
    // console.info(JSON.stringify(dataList, null, 2))
    console.info(JSON.stringify(dataList, null, 2))
    // console.info(JSON.stringify(items[1]))
  })

  it(`getExpenseReportDetail`, async () => {
    const [keyItem] = await businessDataProxy.getExpenseReportList({
      statusList: [HLY_ReimburseStatus.Passed, HLY_ReimburseStatus.Paid],
    })
    const detailInfo = await businessDataProxy.getExpenseReportDetail(keyItem.businessCode)
    const diffMapper = new DiffMapper(keyItem, detailInfo)
    console.info(diffMapper.buildDiffItems())
  })

  it(`getTravelApplicationList`, async () => {
    const items = await businessDataProxy.getTravelApplicationList()
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    // console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })
})
