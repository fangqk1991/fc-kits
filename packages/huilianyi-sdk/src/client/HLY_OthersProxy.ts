import { CommonAPI } from '@fangcha/app-request'
import {
  HLY_Company,
  HLY_LegalEntity,
  HLY_ReceiptedInvoice,
  HLY_SimpleLegalEntity,
  HuilianyiResponse,
} from '../core/basic/HuilianyiModels'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HuilianyiApis } from './HuilianyiApis'
import { PageDataFetcher } from './PageDataFetcher'

export class HLY_OthersProxy extends HuilianyiProxyBase {
  public async getCompanyList() {
    return PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CompanyListGet))
      request.setQueryParams(params)
      const response = (await request.quickSend()) as HuilianyiResponse<HLY_Company[]>
      return response.data
    })
  }

  public async getCompanyMapper() {
    const companyList = await this.getCompanyList()
    return companyList.reduce((result, cur) => {
      result[cur.code] = cur
      return result
    }, {} as { [p: string]: HLY_Company })
  }

  public async getCompanyInfo(companyCode: string) {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CompanyInfoGet, companyCode))
    const response = (await request.quickSend()) as HuilianyiResponse<HLY_Company>
    return response.data
  }

  public async getLegalEntityList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.LegalEntityListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    const response = await request.quickSend<HuilianyiResponse<HLY_SimpleLegalEntity[]>>()
    return response.data
  }

  public async getLegalEntityInfo(legalEntityOID: string) {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.LegalEntityInfoGet, legalEntityOID))
    return await request.quickSend<HLY_LegalEntity>()
  }

  public async getReceiptedInvoiceList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.ReceiptedInvoiceListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    return await request.quickSend<HLY_ReceiptedInvoice[]>()
  }
}
