import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfigTest } from '../HuilianyiConfigTest'
import { HLY_OthersProxy } from '../../src'

describe('Test HLY_OthersProxy.test.ts', () => {
  const huilianyiProxy = new HLY_OthersProxy(HuilianyiConfigTest, CustomRequestFollower)

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

  it(`getReceiptedInvoiceList`, async () => {
    const items = await huilianyiProxy.getReceiptedInvoiceList()
    console.info(items)
  })
})
