import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiProxy } from '../../src/HuilianyiProxy'

describe('Test HuilianyiProxy.test.ts', () => {
  const huilianyiProxy = new HuilianyiProxy(GlobalAppConfig.HuilianyiSDK, CustomRequestFollower)

  it(`getCompanyList`, async () => {
    const items = await huilianyiProxy.getCompanyList()
    console.info(items)
  })

  it(`getCompanyInfo`, async () => {
    const [companyInfo] = await huilianyiProxy.getCompanyList()
    console.info(companyInfo)
    const companyDetail = await huilianyiProxy.getCompanyInfo(companyInfo.code)
    console.info(companyDetail)
  })

  it(`getUserGroupList`, async () => {
    const items = await huilianyiProxy.getUserGroupList()
    console.info(items)
  })

  it(`getUserGroupMembers`, async () => {
    const [userGroup] = await huilianyiProxy.getUserGroupList()
    const members = await huilianyiProxy.getUserGroupMembers(userGroup.code)
    console.info(members)
  })
})
