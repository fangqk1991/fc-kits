import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfigTest } from '../HuilianyiConfigTest'
import { HLY_BasicDataProxy } from '../../src/client/HLY_BasicDataProxy'

describe('Test HLY_BasicDataProxy.test.ts', () => {
  const basicDataProxy = new HLY_BasicDataProxy(HuilianyiConfigTest, CustomRequestFollower)

  it(`getAllStaffs`, async () => {
    const items = await basicDataProxy.getAllStaffs()
    const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })

  it(`getUserGroupList`, async () => {
    const items = await basicDataProxy.getUserGroupList()
    console.info(items)
  })

  it(`getUserGroupMembers`, async () => {
    const groupList = await basicDataProxy.getUserGroupList()
    const group = groupList.find((group) => group.name === '管理层')!
    const members = await basicDataProxy.getUserGroupMembers(group.code)
    console.info(members)
  })

  it(`getAllDepartments`, async () => {
    const items = await basicDataProxy.getAllDepartments()
    const keyTextList = items.map((item) => `${item.departmentPath} - (${item.managerName || 'None'})`)
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })

  it(`getDepartmentInfo`, async () => {
    const [department] = await basicDataProxy.getAllDepartments()
    const department2 = await basicDataProxy.getDepartmentInfo(department.departmentOID)
    // console.info(JSON.stringify(department, null, 2))
    console.info(JSON.stringify(department2, null, 2))
  })

  it(`getCostCenterList`, async () => {
    const items = await basicDataProxy.getCostCenterList()
    const keyTextList = items.map((item) => `${item.name}`)
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })

  it(`getCostCenterDetail`, async () => {
    const costCenters = await basicDataProxy.getEnabledCostCenterList()
    for (const center of costCenters) {
      const centerDetail = await basicDataProxy.getCostCenterDetail(center.code)
      console.info(
        center.name,
        centerDetail.costCenterItems.map((item) => item.name)
      )
    }
  })

  it(`getCostCenterItems`, async () => {
    const costCenters = await basicDataProxy.getEnabledCostCenterList()
    for (const center of costCenters) {
      const centerItems = await basicDataProxy.getCostCenterItems(center.code)
      console.info(
        center.name,
        centerItems.map((item) => item.name)
      )
    }
  })

  it(`getExpenseTypeList`, async () => {
    const items = await basicDataProxy.getExpenseTypeList()
    const keyTextList = items.map((item) => `${item.code} - ${item.name}`)
    // console.info(JSON.stringify(items, null, 2))
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })
})
