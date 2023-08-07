import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiConfigTest } from '../HuilianyiConfigTest'
import { HLY_OthersProxy } from '../../src/client/HLY_OthersProxy'

describe('Test HLY_OthersProxy.test.ts', () => {
  const huilianyiProxy = new HLY_OthersProxy(HuilianyiConfigTest, CustomRequestFollower)

  it(`getCompanyList`, async () => {
    const items = await huilianyiProxy.getCompanyList()
    console.info(items)
  })

  it(`getCompanyMapper`, async () => {
    const companyMapper = await huilianyiProxy.getCompanyMapper()
    console.info(companyMapper)
  })

  it(`getCompanyInfo`, async () => {
    const [companyInfo] = await huilianyiProxy.getCompanyList()
    console.info(companyInfo)
    const companyDetail = await huilianyiProxy.getCompanyInfo(companyInfo.code)
    console.info(companyDetail)
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
