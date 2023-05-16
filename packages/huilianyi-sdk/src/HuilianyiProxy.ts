import { ApiOptions, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { HuilianyiTokenKeeper } from './HuilianyiTokenKeeper'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiApis } from './HuilianyiApis'
import {
  HLY_Company,
  HLY_CostCenter,
  HLY_CostCenterItem,
  HLY_ExpenseType,
  HLY_LegalEntity,
  HLY_ReceiptedInvoice,
  HLY_Reimbursement,
  HLY_SimpleLegalEntity,
  HLY_User,
  HLY_UserGroup,
  HuilianyiResponse,
} from './HuilianyiModels'

export class HuilianyiProxy extends ServiceProxy<BasicAuthConfig> {
  private _tokenKeeper: HuilianyiTokenKeeper

  constructor(config: BasicAuthConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._tokenKeeper = new HuilianyiTokenKeeper(config, observerClass)
  }

  public async makeRequest(commonApi: ApiOptions) {
    const accessToken = await this._tokenKeeper.requireTenantAccessToken()
    const request = axiosBuilder()
      .setBaseURL(this._tokenKeeper.baseURL())
      .addHeader('Authorization', `Bearer ${accessToken}`)
      .setApiOptions(commonApi)
      .setTimeout(15000)
    // request.setErrorParser((client, error) => {
    //   let message = error.message
    //   if (client.axiosError?.response?.data && typeof client.axiosError?.response.data === 'object') {
    //     const data = client.axiosError?.response.data as HuilianyiResponse<any>
    //     error.extras = data
    //     message = `${data.msg}[${data.code}]`
    //   }
    //   const errorPrefix = `API[${commonApi.description}] error:`
    //   return new AppError(`${errorPrefix} ${message}`, error.statusCode, error.extras)
    // })
    this.onRequestMade(request)
    return request
  }

  public async getCompanyList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CompanyListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    const response = (await request.quickSend()) as HuilianyiResponse<HLY_Company[]>
    return response.data
  }

  public async getCompanyInfo(companyCode: string) {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CompanyInfoGet, companyCode))
    const response = (await request.quickSend()) as HuilianyiResponse<HLY_Company>
    return response.data
  }

  public async getUserGroupList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.UserGroupListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    const response = (await request.quickSend()) as HuilianyiResponse<HLY_UserGroup[]>
    return response.data
  }

  public async getUserGroupMembers(groupCode: string) {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.UserGroupMembersGet, groupCode))
    return await request.quickSend<HLY_User[]>()
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

  public async getCostCenterList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CostCenterListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    return await request.quickSend<HLY_CostCenter[]>()
  }

  public async getCostCenterDetail(code: string) {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CostCenterDetailGet))
    request.setBodyData({
      code: code,
    })
    return await request.quickSend<HLY_CostCenter>()
  }

  public async getCostCenterItems(code: string) {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CostCenterItemsGet))
    request.setQueryParams({
      costCenterCode: code,
      page: 1,
      size: 100,
    })
    return await request.quickSend<HLY_CostCenterItem[]>()
  }

  public async getReceiptedInvoiceList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.ReceiptedInvoiceListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    return await request.quickSend<HLY_ReceiptedInvoice[]>()
  }

  /**
   * https://opendocs.huilianyi.com/implement/master-data/expense-type/query-expense-type.html
   */
  public async getExpenseTypeList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.ExpenseTypeListGet))
    return await request.quickSend<HLY_ExpenseType[]>()
  }

  public async searchReimbursementData() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.ReimbursementDataSearch))
    request.setBodyData({
      startDate: '2022-11-01',
      endDate: '2023-02-01',
    })
    const response = await request.quickSend<HuilianyiResponse<HLY_Reimbursement[]>>()
    return response.data
  }
}
