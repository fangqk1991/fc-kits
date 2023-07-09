import { CommonAPI } from '@fangcha/app-request'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BusinessDataApis } from './HLY_BusinessDataApis'
import { HLY_ApprovalParams, HLY_Expense, HLY_ExpenseV2 } from '../core/HLY_ExpenseModels'
import { HLY_ExpenseStatus, HLY_ExpenseStatusDescriptor } from '../core/HLY_ExpenseStatus'
import { PageDataFetcher } from './PageDataFetcher'
import { HuilianyiResponse } from '../core/HuilianyiModels'
import { HLY_PublicApplicationDTO } from '../core/HLY_PublicApplicationModels'
import { HLY_Travel } from '../core/HLY_TravelModels'
import { HLY_Invoice } from '../core/HLY_InvoiceModels'
import { TimeUtils } from '../core/TimeUtils'
import { HLY_OrderFlight } from '../core/HLY_TravelOrderModels'

export class HLY_BusinessDataProxy extends HuilianyiProxyBase {
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
  public async getExpenseReportList(options: { statusList?: HLY_ExpenseStatus[] } = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportListGet))
      request.setQueryParams({
        ...params,
        status: (options.statusList || HLY_ExpenseStatusDescriptor.values).join(','),
      })
      return await request.quickSend<HLY_Expense[]>()
    })
  }

  public async getExpenseReportListV2(
    options: { statusList?: HLY_ExpenseStatus[]; lastModifyStartDate?: string } = {},
    extras: {} = {}
  ) {
    return await PageDataFetcher.fetchAllPageItemsV2(async (params) => {
      const lastModifyStartDate = options.lastModifyStartDate || params.lastModifyStartDate
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportListGetV2))
      request.setBodyData({
        ...params,
        withExpenseType: true,
        withExpenseField: true,
        withCustomFormValue: true,
        withApplication: true,
        withInvoice: true,
        withExpenseReportLabel: true,
        withRealPaymentAmount: true,
        // withInvoiceAttachment: true,
        // withInvoiceCustomFormValue: true,
        ...extras,
        lastModifyStartDate: lastModifyStartDate,
        statusList: options.statusList || HLY_ExpenseStatusDescriptor.values,
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

  public async getTravelApplicationList(extras: {} = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TravelApplicationListGet))
      request.setQueryParams({
        ...params,
        withApplicationParticipant: true,
        ...extras,
      })
      return await request.quickSend<HLY_Travel[]>()
    })
  }

  public async getTravelApplicationDetail(businessCode: string, extras: {} = {}) {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TravelApplicationDetailGet))
    request.setQueryParams({
      businessCode: businessCode,
      withItineraryMap: true,
      withReferenceDocument: true,
      ...extras,
    })
    const data = await request.quickSend<HLY_Travel>()
    if (data.travelApplication?.itineraryHeadDTOs) {
      data.travelApplication.itineraryHeadDTOs.forEach((item) => {
        item.startDate = TimeUtils.momentUTC8(item.startDate).format('YYYY-MM-DD')
        item.endDate = TimeUtils.momentUTC8(item.endDate).format('YYYY-MM-DD')
      })
    }
    return data
  }

  public async getInvoiceList(extras: {} = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.InvoiceListGet))
      request.setQueryParams({
        ...params,
        ...extras,
      })
      return await request.quickSend<HLY_Invoice[]>()
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

  public async passApproval(params: HLY_ApprovalParams) {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ApprovalPass))
    request.setBodyData(params)
    return await request.quickSend()
  }

  public async getFlightOrders(companyOID: string, extras: {} = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.FlightOrdersGet))
      request.setQueryParams({
        ...params,
        // withApplicationParticipant: true,
        ...extras,
        companyOID: companyOID,
      })
      return await request.quickSend<HLY_OrderFlight[]>()
    })
  }

  public async getTrainOrders(companyOID: string, extras: {} = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TrainOrdersGet))
      request.setQueryParams({
        ...params,
        // withApplicationParticipant: true,
        ...extras,
        companyOID: companyOID,
      })
      const items = await request.quickSend<any[]>()
      return items || []
    })
  }

  public async getHotelOrders(companyOID: string, extras: {} = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.HotelOrdersGet))
      request.setQueryParams({
        ...params,
        // withApplicationParticipant: true,
        ...extras,
        companyOID: companyOID,
      })
      return await request.quickSend<any[]>()
    })
  }
}
