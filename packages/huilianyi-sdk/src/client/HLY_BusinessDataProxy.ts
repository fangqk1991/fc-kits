import { CommonAPI } from '@fangcha/app-request'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BusinessDataApis } from './HLY_BusinessDataApis'
import { HLY_Expense, HLY_ExpenseV2 } from '../core/HLY_ReimbursementModels'
import { HLY_ReimburseStatus, HLY_ReimburseStatusDescriptor } from '../core/HLY_ReimburseStatus'
import { PageDataFetcher } from './PageDataFetcher'
import { HuilianyiResponse } from '../core/HuilianyiModels'
import { HLY_PublicApplicationDTO } from '../core/HLY_PublicApplicationModels'

export class HLY_BusinessDataProxy extends HuilianyiProxyBase {
  public async getApprovalMatrixList() {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ApprovalMatrixListGet))
    request.setBodyData({
      page: 1,
      size: 20,
    })
    const response = await request.quickSend<HuilianyiResponse<any[]>>()
    return response.data
  }

  public async getPublicApplicationList() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.PublicApplicationListGet))
      request.setQueryParams({
        ...params,
      })
      const response = await request.quickSend<HuilianyiResponse<HLY_PublicApplicationDTO[]>>()
      return response.data
    })
  }

  public async getPublicApplicationDetail(businessCode: string) {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.PublicApplicationDetailGet))
    request.setQueryParams({
      businessCode: businessCode,
    })
    const response = await request.quickSend<HuilianyiResponse<HLY_PublicApplicationDTO>>()
    return response.data
  }

  /**
   * @deprecated
   * @param options
   */
  public async getExpenseReportList(options: { statusList?: HLY_ReimburseStatus[] } = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportListGet))
      request.setQueryParams({
        ...params,
        status: (options.statusList || HLY_ReimburseStatusDescriptor.values).join(','),
      })
      return await request.quickSend<HLY_Expense[]>()
    })
  }

  public async getExpenseReportListV2(
    options: { statusList?: HLY_ReimburseStatus[]; lastModifyStartDate?: string } = {}
  ) {
    return await PageDataFetcher.fetchAllPageItemsV2(async (params) => {
      const lastModifyStartDate = options.lastModifyStartDate || params.lastModifyStartDate
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportListGetV2))
      request.setBodyData({
        ...params,
        lastModifyStartDate: lastModifyStartDate,
        statusList: options.statusList || HLY_ReimburseStatusDescriptor.values,
        sortDTOList: [
          {
            property: 'id',
            direction: 'ASC',
          },
        ],
      })
      return await request.quickSend<HLY_ExpenseV2[]>()
    })
  }

  public async getExpenseReportDetail(businessCode: string) {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportDetailGet))
    request.setQueryParams({
      businessCode: businessCode,
      // withExpenseReportItinerary: true,
    })
    return await request.quickSend<HLY_Expense>()
  }

  public async getTravelApplicationList() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TravelApplicationListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<any[]>()
    })
  }

  public async updateApplicationCustomFormValue(businessCode: string, params: {}) {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ApplicationCustomFormValueUpdate))
    request.setBodyData({
      businessCode: businessCode,
      customFormValueDTOList: Object.keys(params).map((key) => ({
        fieldCode: key,
        value: params[key],
      })),
    })
    await request.quickSend()
  }
}
