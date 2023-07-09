import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfigTest } from '../HuilianyiConfigTest'
import {
  HLY_BusinessDataProxy,
  HLY_EntityType,
  HLY_ExpenseStatus,
  HLY_ExpenseStatusDescriptor,
  HLY_OthersProxy,
  HLY_PublicApplicationStatusDescriptor,
} from '../../src'
import { DiffMapper } from '@fangcha/tools'

describe('Test HLY_BusinessDataProxy.test.ts', () => {
  const businessDataProxy = new HLY_BusinessDataProxy(HuilianyiConfigTest, CustomRequestFollower)
  const othersProxy = new HLY_OthersProxy(HuilianyiConfigTest, CustomRequestFollower)

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
      // statusList: [HLY_ExpenseStatus.Passed, HLY_ExpenseStatus.Paid],
    })
    const dataList = items.map((item) => ({
      title: item.title,
      applicantName: item.applicantName,
      createdDate: item.createdDate,
      status: item.status,
      statusText: HLY_ExpenseStatusDescriptor.describe(item.status),
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
      // statusList: [HLY_ExpenseStatus.Passed, HLY_ExpenseStatus.Paid],
      lastModifyStartDate: '2023-06-09 17:24:07',
    })
    const dataList = items.map((item) => ({
      id: item.id,
      title: item.title,
      applicantName: item.applicantName,
      createdDate: item.createdDate,
      lastModifiedDate: item.lastModifiedDate,
      status: item.status,
      statusText: HLY_ExpenseStatusDescriptor.describe(item.status),
    }))
    console.info(`${dataList.length} items.`)
    // console.info(JSON.stringify(items, null, 2))
    console.info(
      JSON.stringify(
        items.map((item) => item),
        null,
        2
      )
    )
    // console.info(JSON.stringify(items[1]))
  })

  it(`getExpenseReportDetail`, async () => {
    const [keyItem] = await businessDataProxy.getExpenseReportList({
      statusList: [HLY_ExpenseStatus.Passed, HLY_ExpenseStatus.Paid],
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
    const items = await businessDataProxy.getTravelApplicationList({
      startDate: '2023-06-09 17:24:07',
    })
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    console.info(`${items.length} items.`)
    console.info(
      JSON.stringify(
        items
          .filter((item) => item.businessCode === 'TA00991041')
          .map((item) => {
            // return HuilianyiFormatter.transferTravelModel(item)
            return item
          }),
        null,
        2
      )
    )
  })

  it(`getTravelApplicationDetail`, async () => {
    const data = await businessDataProxy.getTravelApplicationDetail('TA01004076')
    console.info(JSON.stringify(data, null, 2))
  })

  it(`getTravelApplicationDetail - diff testing`, async () => {
    const data1 = await businessDataProxy.getTravelApplicationDetail('TA00991041')
    const data2 = await businessDataProxy.getTravelApplicationDetail('TA00991041', {
      withItineraryMap: true,
    })
    console.info(DiffMapper.diff(data1, data2))
    console.info(JSON.stringify(data2.travelApplication.itineraryHeadDTOs, null, 2))
  })

  it(`diff testing getTravelApplicationList`, async () => {
    const items1 = await businessDataProxy.getTravelApplicationList({
      // startDate: '2023-06-09 17:24:07',
    })
    const items2 = await businessDataProxy.getTravelApplicationList({
      // startDate: '2023-06-09 17:24:07',
      withItineraryMap: false,
    })
    console.info(
      JSON.stringify(
        items1.map((_, index) => DiffMapper.diff(items1[index], items2[index])),
        null,
        2
      )
    )
  })

  it(`getInvoiceList`, async () => {
    const items = await businessDataProxy.getInvoiceList({})
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    console.info(`${items.length} items.`)
    console.info(
      JSON.stringify(
        items.map((item) => ({
          name: item.expenseTypeName,
          fields: item.data.map((field) => `${field.name}`),
        })),
        null,
        2
      )
    )
    console.info(JSON.stringify(items[0], null, 2))
  })

  it(`getFlightOrders`, async () => {
    const companyList = await othersProxy.getCompanyList()
    for (const company of companyList) {
      const items = await businessDataProxy.getFlightOrders(company.companyOID, {})
      console.info(JSON.stringify(items, null, 2))
    }
  })

  it(`getTrainOrders`, async () => {
    const companyList = await othersProxy.getCompanyList()
    for (const company of companyList) {
      const items = await businessDataProxy.getTrainOrders({
        companyOID: company.companyOID,
      })
      console.info(JSON.stringify(items, null, 2))
    }
  })
})
