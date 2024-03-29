import { CommonAPI } from '@fangcha/app-request'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BusinessDataApis } from './HLY_BusinessDataApis'
import {
  HLY_ApprovalParams,
  HLY_Expense,
  HLY_ExpenseApplicationModel,
  HLY_ExpenseStatus,
  HLY_ExpenseStatusDescriptor,
  HLY_ExpenseV2,
  HLY_Invoice,
  HLY_OrderFlight,
  HLY_OrderHotel,
  HLY_OrderTrain,
  HLY_PublicApplicationDTO,
  HLY_TravelModel,
  HLY_TravelStatus,
  HuilianyiResponse,
} from '../core'
import { PageDataFetcher } from './PageDataFetcher'
import { TimeUtils } from '../core/tools/TimeUtils'

export class HLY_BusinessDataProxy extends HuilianyiProxyBase {
  public async getPrepaymentApplyList() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.PrepaymentApplyListGet))
      request.setQueryParams({
        ...params,
      })
      const response = await request.quickSend<HuilianyiResponse<any[]>>()
      return response.data
    })
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

  public async getPublicPaymentList(
    options: { statusList?: HLY_ExpenseStatus[]; lastModifyStartDate?: string } = {},
    extras: {} = {}
  ) {
    return this.getExpenseReportListV2(options, {
      ...extras,
      corporateFlag: true,
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

  public async getTravelApplicationList(extras: {} = {}): Promise<HLY_TravelModel[]> {
    const items = await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TravelApplicationListGet))
      request.setQueryParams({
        ...params,
        withApplicationParticipant: false,
        withItineraryMap: false,
        withCustomFormShowValue: false,
        ...extras,
        // size: 30,
      })
      return await request.quickSend<HLY_TravelModel[]>()
    })
    const mapper: { [p: string]: HLY_TravelModel } = {}
    for (const item of items) {
      if (item.status === HLY_TravelStatus.Deleted) {
        continue
      }
      if (mapper[item.businessCode] && mapper[item.businessCode].version > item.version) {
        continue
      }
      mapper[item.businessCode] = item
    }
    return Object.values(mapper)
  }

  public async getExpenseApplicationList(extras: {} = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseApplicationListGet))
      request.setQueryParams({
        ...params,
        withApprovalHistory: false,
        ...extras,
      })
      const response = await request.quickSend<HuilianyiResponse<HLY_ExpenseApplicationModel[]>>()
      return response.data
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
    const data = await request.quickSend<HLY_TravelModel>()
    if (data.travelApplication?.itineraryHeadDTOs) {
      // UTC 时间无需纠正
      // data.travelApplication.itineraryHeadDTOs.forEach((item) => {
      //   item.startDate = TimeUtils.momentUTC8(item.startDate).format('YYYY-MM-DD')
      //   item.endDate = TimeUtils.momentUTC8(item.endDate).format('YYYY-MM-DD')
      // })
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
    const items = await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.FlightOrdersGet))
      request.setQueryParams({
        ...params,
        // withApplicationParticipant: true,
        ...extras,
        integration: 'CTRIP',
        companyOID: companyOID,
      })
      return await request.quickSend<HLY_OrderFlight[]>()
    })
    items.forEach((item) => {
      item.flightOrderDetails.forEach((subItem) => {
        subItem.startDate = TimeUtils.correctUTC8Timestamp(subItem.startDate)
        subItem.endDate = TimeUtils.correctUTC8Timestamp(subItem.endDate)
      })
    })
    return items
  }

  public async getTrainOrders(companyOID: string, extras: {} = {}) {
    const items = await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TrainOrdersGet))
      request.setQueryParams({
        ...params,
        // withApplicationParticipant: true,
        ...extras,
        integration: 'CTRIP',
        companyOID: companyOID,
      })
      const items = await request.quickSend<HLY_OrderTrain[]>()
      return items || []
    })
    items.forEach((item) => {
      item.trainOrderDetails.forEach((subItem) => {
        subItem.startDate = TimeUtils.correctUTC8Timestamp(subItem.startDate)
        subItem.endDate = TimeUtils.correctUTC8Timestamp(subItem.endDate)
      })
    })
    return items
  }

  public async getHotelOrders(companyOID: string, extras: {} = {}) {
    const items = await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.HotelOrdersGet))
      request.setQueryParams({
        ...params,
        // withApplicationParticipant: true,
        ...extras,
        integration: 'CTRIP',
        companyOID: companyOID,
      })
      const items = await request.quickSend<HLY_OrderHotel[]>()
      return items || []
    })
    items.forEach((item) => {
      item.hotelOrderDetail.roomInfo.forEach((subItem) => {
        subItem.ETA = TimeUtils.correctUTC8Timestamp(subItem.ETA)
        subItem.ETD = TimeUtils.correctUTC8Timestamp(subItem.ETD)
      })
    })
    return items
  }
}
