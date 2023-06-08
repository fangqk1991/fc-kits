import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfig } from './HuilianyiConfig'
import { HLY_BusinessDataProxy } from '../../src/client/HLY_BusinessDataProxy'
import { HLY_ReimburseStatus, HLY_ReimburseStatusDescriptor } from '../../src'
import { DiffMapper } from '@fangcha/tools/lib'

describe('Test HLY_BusinessDataProxy.test.ts', () => {
  const huilianyiProxy = new HLY_BusinessDataProxy(HuilianyiConfig, CustomRequestFollower)

  it(`getExpenseReportList`, async () => {
    const items = await huilianyiProxy.getExpenseReportList({
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

  it(`getExpenseReportDetail`, async () => {
    const [keyItem] = await huilianyiProxy.getExpenseReportList({
      statusList: [HLY_ReimburseStatus.Passed, HLY_ReimburseStatus.Paid],
    })
    const detailInfo = await huilianyiProxy.getExpenseReportDetail(keyItem.businessCode)
    const diffMapper = new DiffMapper(keyItem, detailInfo)
    console.info(diffMapper.buildDiffItems())
  })

  it(`getTravelApplicationList`, async () => {
    const items = await huilianyiProxy.getTravelApplicationList()
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    // console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })
})
