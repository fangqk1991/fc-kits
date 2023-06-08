import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfig } from './HuilianyiConfig'
import { HLY_BasicDataProxy } from '../../src/client/HLY_BasicDataProxy'

describe('Test HLY_BasicDataProxy.test.ts', () => {
  const huilianyiProxy = new HLY_BasicDataProxy(HuilianyiConfig, CustomRequestFollower)

  it(`getAllStaffs`, async () => {
    const items = await huilianyiProxy.getAllStaffs()
    const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })

  it(`getAllDepartments`, async () => {
    const items = await huilianyiProxy.getAllDepartments()
    const keyTextList = items.map((item) => `${item.departmentPath} - (${item.managerName || 'None'})`)
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })

  it(`getCostCenterList`, async () => {
    const items = await huilianyiProxy.getCostCenterList()
    const keyTextList = items.map((item) => `${item.name}`)
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })

  it(`getCostCenterDetail`, async () => {
    const costCenters = await huilianyiProxy.getEnabledCostCenterList()
    for (const center of costCenters) {
      const centerDetail = await huilianyiProxy.getCostCenterDetail(center.code)
      console.info(center.name, centerDetail.costCenterItems.map((item) => item.name))
    }
  })

  it(`getCostCenterItems`, async () => {
    const costCenters = await huilianyiProxy.getEnabledCostCenterList()
    for (const center of costCenters) {
      const centerItems = await huilianyiProxy.getCostCenterItems(center.code)
      console.info(center.name, centerItems.map((item) => item.name))
    }
  })

  it(`getExpenseTypeList`, async () => {
    const items = await huilianyiProxy.getExpenseTypeList()
    const keyTextList = items.map((item) => `${item.code} - ${item.name}`)
    // console.info(JSON.stringify(items, null, 2))
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })
})
