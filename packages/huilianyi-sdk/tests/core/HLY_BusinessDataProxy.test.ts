import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfig } from './HuilianyiConfig'
import { HLY_BusinessDataProxy } from '../../src/client/HLY_BusinessDataProxy'

describe('Test HLY_BusinessDataProxy.test.ts', () => {
  const huilianyiProxy = new HLY_BusinessDataProxy(HuilianyiConfig, CustomRequestFollower)

  it(`getExpenseReportList`, async () => {
    const items = await huilianyiProxy.getExpenseReportList()
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    // console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })

  it(`getTravelApplicationList`, async () => {
    const items = await huilianyiProxy.getTravelApplicationList()
    // const keyTextList = items.map((item) => `${item.fullName} - ${item.departmentPath}`)
    // console.info(`${keyTextList.length} items.`)
    console.info(JSON.stringify(items, null, 2))
  })
})
