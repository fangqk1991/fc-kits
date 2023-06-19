import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfigTest } from '../HuilianyiConfigTest'
import {
  HLY_BusinessDataProxy,
  HLY_EntityType,
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
    const businessCode = 'TA00988382'
    await businessDataProxy.updateApplicationCustomFormValue(businessCode, {
      field_remarks: [
        `系统补充内容 1: ${10000 + Math.floor(Math.random() * 1000)}`,
        `系统补充内容 2: ${20000 + Math.floor(Math.random() * 1000)}`,
        `系统补充内容 3: ${30000 + Math.floor(Math.random() * 1000)}`,
      ].join('\n'),
    })
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

  it(`diff testing getExpenseReportListV2`, async () => {
    const items1 = await businessDataProxy.getExpenseReportListV2({
      lastModifyStartDate: '2023-06-09 17:24:07',
    })
    const items2 = await businessDataProxy.getExpenseReportListV2(
      {
        lastModifyStartDate: '2023-06-09 17:24:07',
      },
      {
        withExpenseField: true,
      }
    )
    console.info(
      JSON.stringify(
        items1.map((_, index) => DiffMapper.diff(items1[index], items2[index])),
        null,
        2
      )
    )
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
    console.info(
      JSON.stringify(
        items.map((item) => item.expenseFieldVOList),
        null,
        2
      )
    )
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

  it(`getExpenseReportDetail - 2`, async () => {
    const detailInfo = await businessDataProxy.getExpenseReportDetail('ER15389015')
    console.info(JSON.stringify(detailInfo, null, 2))
  })

  it(`passApproval`, async () => {
    const response = await businessDataProxy.passApproval({
      businessCode: 'ER15282123',
      entityType: HLY_EntityType.Expense,
      operator: '123123',
      approver: '123123',
    } as any)
    console.info(JSON.stringify(response, null, 2))
  })

  it(`getTravelApplicationList`, async () => {
    const items = await businessDataProxy.getTravelApplicationList()
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    // console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })
})
