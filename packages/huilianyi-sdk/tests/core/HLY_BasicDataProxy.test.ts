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

  it(`getExpenseTypeList`, async () => {
    const items = await huilianyiProxy.getExpenseTypeList()
    const keyTextList = items.map((item) => `${item.code} - ${item.name}`)
    // console.info(JSON.stringify(items, null, 2))
    console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(keyTextList, null, 2))
  })
})
