import { ApiOptions, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { HuilianyiTokenKeeper } from './HuilianyiTokenKeeper'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiApis } from './HuilianyiApis'
import {
  HLY_Company,
  HLY_CostCenter,
  HLY_CostCenterItem,
  HLY_ExpenseDetail,
  HLY_ExpenseType,
  HLY_LegalEntity,
  HLY_ReceiptedInvoice,
  HLY_Reimbursement,
  HLY_SimpleDepartment,
  HLY_SimpleLegalEntity,
  HLY_Staff,
  HLY_TravelApplyForm,
  HLY_User,
  HLY_UserGroup,
  HuilianyiResponse,
} from '../core/HuilianyiModels'
import * as moment from 'moment'
import AppError from '@fangcha/app-error'

export class HuilianyiProxy extends ServiceProxy<BasicAuthConfig> {
  protected _tokenKeeper: HuilianyiTokenKeeper

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
      .setResponse200Checker((responseData: HuilianyiResponse<any>) => {
        if (responseData.errorCode !== undefined && responseData.errorCode !== '0000') {
          const errorPrefix = `API[${commonApi.description}] error:`
          throw new AppError(`${errorPrefix} ${responseData.message} [${responseData.errorCode}]`, 400, responseData)
        }
      })
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

  public async getAllStaffs() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HuilianyiApis.StaffListGet))
      request.setQueryParams({
        startDate: '2020-01-01 00:00:00',
        endDate: '2040-12-31 00:00:00',
        ...params,
      })
      return await request.quickSend<HLY_Staff[]>()
    })
  }

  public async getAllDepartments() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HuilianyiApis.DepartmentListGet))
      request.setQueryParams({
        startDate: '2020-01-01 00:00:00',
        endDate: '2040-12-31 00:00:00',
        ...params,
      })
      return await request.quickSend<HLY_SimpleDepartment[]>()
    })
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

  public async getAllPageItemsV2<T>(handler: (params: { page: number; size: number }) => Promise<T[]>) {
    let items: T[] = []
    let finished = false
    let page = 1
    while (!finished) {
      const pageItems = await handler({
        page: page,
        size: 100,
      })
      items = items.concat(pageItems || [])
      if (pageItems.length === 0) {
        finished = true
      } else {
        ++page
      }
    }
    return items
  }
}
