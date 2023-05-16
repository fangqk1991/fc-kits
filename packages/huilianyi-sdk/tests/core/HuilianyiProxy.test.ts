import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiProxy } from '../../src/HuilianyiProxy'
import { HuilianyiConfig } from './HuilianyiConfig'

describe('Test HuilianyiProxy.test.ts', () => {
  const huilianyiProxy = new HuilianyiProxy(HuilianyiConfig, CustomRequestFollower)

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

  it(`getLegalEntityList`, async () => {
    const items = await huilianyiProxy.getLegalEntityList()
    console.info(items)
  })

  it(`getLegalEntityInfo`, async () => {
    const [entity] = await huilianyiProxy.getLegalEntityList()
    const detailInfo = await huilianyiProxy.getLegalEntityInfo(entity.legalEntityOID)
    console.info(detailInfo)
  })

  it(`getCostCenterList`, async () => {
    const items = await huilianyiProxy.getCostCenterList()
    console.info(items)
  })

  it(`getCostCenterDetail`, async () => {
    const [item] = await huilianyiProxy.getCostCenterList()
    const detailInfo = await huilianyiProxy.getCostCenterDetail(item.code)
    console.info(detailInfo)
  })
})
