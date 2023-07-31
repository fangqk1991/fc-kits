import { HLY_ExpenseV2 } from '../core/expense/HLY_ExpenseModels'
import {
  App_TravelCoreItinerary,
  App_TravelFlightTicketInfo,
  App_TravelModel,
  App_TravelOrderBase,
  App_TravelOrderExtras,
  App_TravelTrainTicketInfo,
  TravelMonthSection,
} from '../core/travel/App_TravelModels'
import * as moment from 'moment/moment'
import { HLY_TravelModel, ItineraryHeadDTO } from '../core/travel/HLY_TravelModels'
import { TimeUtils } from '../core/tools/TimeUtils'
import { HLY_OrderBase, HLY_OrderFlightCoreInfo, HLY_OrderTrainTicketInfo } from '../core/travel/HLY_TravelOrderModels'
import { App_ExpenseModel } from '../core/expense/App_ExpenseModels'
import { HLY_ExpenseApplicationModel } from '../core/expense/HLY_ExpenseApplicationModels'
import { App_ExpenseApplicationModel } from '../core/application/App_ApplicationModels'

export class HuilianyiFormatter {
  public static transferExpenseModel(item: HLY_ExpenseV2): App_ExpenseModel {
    const expenseFieldVOList = item.expenseFieldVOList || []
    const typeField = item.customFormValueVOList.find((item) => item.fieldName === '单据类型')
    const ownerField = item.customFormValueVOList.find((item) => item.fieldName === '预算归口')
    return {
      hlyId: Number(item.id),
      businessCode: item.businessCode,
      applicationOid: item.applicationOID,
      applicantOid: item.applicantOID,
      applicantName: item.applicantName,
      companyOid: item.companyOID,
      departmentOid: item.departmentOID,
      corporationOid: item.corporationOID,
      formCode: item.formCode,
      formOid: item.formOID,
      formName: item.formName,
      submittedBy: item.submittedBy,
      title: item.title,
      expenseType: item.type,
      expenseStatus: item.status,
      totalAmount: item.totalAmount,
      costTypeOid: typeField?.value || null,
      costOwnerOid: ownerField?.value || null,
      applyFormCodes: (item.expenseReportApplicationVOList || []).map((item) => item.applicationBusinessCode),
      createdDate: item.createdDate ? moment(item.createdDate).format() : null,
      lastModifiedDate: item.lastModifiedDate ? moment(item.lastModifiedDate).format() : null,
      extrasData: {
        customProps: item.customFormValueVOList.reduce((result, cur) => {
          result[cur.fieldCode] = {
            fieldName: cur.fieldName,
            value: cur.value,
            showValue: cur.showValue || cur.value,
          }
          return result
        }, {}),
        customFormValueVOList: item.customFormValueVOList || [],
        invoiceVOList: item.invoiceVOList || [],
        expenseProps: expenseFieldVOList.reduce((result, cur) => {
          result[cur.fieldOID] = {
            name: cur.name,
            fieldType: cur.fieldType,
            value: cur.value,
            showValue: cur.showValue,
          }
          return result
        }, {}),
        expenseFieldVOList: expenseFieldVOList,
      },
    }
  }

  public static transferExpenseApplicationModel(item: HLY_ExpenseApplicationModel): App_ExpenseApplicationModel {
    const customProps: {
      [propKey: string]: {
        fieldName: string
        value: string
        showValue: string
      }
    } = item.custFormValues.reduce((result, cur) => {
      result[cur.fieldCode] = {
        fieldName: cur.fieldName,
        value: cur.value,
        showValue: cur.showValue || cur.value,
      }
      return result
    }, {})
    const typeField = item.custFormValues.find((item) => item.fieldName === '单据类型')
    const ownerField = item.custFormValues.find((item) => item.fieldName === '预算归口')
    return {
      hlyId: Number(item.businessCode.replace(/^[A-Z]+0*/, '')),
      businessCode: item.businessCode,
      applicationOid: item.applicationOID,
      applicantOid: item.applicant.userOID,
      applicantName: item.applicant.fullName,
      companyOid: item.companyOID,
      departmentOid: item.applicant.department.departmentOID,
      corporationOid: null,
      formCode: item.formCode,
      formOid: item.applicationOID,
      formName: item.formName,
      submittedBy: item.applicant.userOID,
      title: item.title,
      totalAmount: item.totalAmount,
      createdDate: item.createdDate ? moment(item.createdDate).format() : null,
      lastModifiedDate: null,
      formStatus: item.status,
      costTypeOid: typeField?.value || null,
      costOwnerOid: ownerField?.value || null,
      extrasData: {
        customProps: customProps,
      },
    }
  }

  public static transferTravelModel(item: HLY_TravelModel): App_TravelModel {
    const customProps: {
      [propKey: string]: {
        fieldName: string
        value: string
        showValue: string
      }
    } = item.custFormValues.reduce((result, cur) => {
      result[cur.fieldCode] = {
        fieldName: cur.fieldName,
        value: cur.value,
        showValue: cur.showValue || cur.value,
      }
      return result
    }, {})
    const itineraryMap = item.travelApplication?.itineraryMap || {}
    const itineraryItems = HuilianyiFormatter.transferItineraryHeadDTOs(item.travelApplication?.itineraryHeadDTOs)
    return {
      hlyId: Number(item.applicationId),
      businessCode: item.businessCode,
      applicationOid: item.applicationOID,
      applicantOid: item.applicantOID,
      applicantName: item.applicant.fullName,
      companyOid: item.companyOID,
      departmentOid: item.departmentOID,
      corporationOid: item.corporationOID,
      formCode: item.formCode,
      formOid: item.formOID,
      formName: item.formName,
      submittedBy: item.submittedBy,
      title: item.title,
      matchClosedLoop: 0,
      isPretty: 0,
      hasSubsidy: itineraryItems.find((item) => item.subsidyList.length > 0) ? 1 : 0,
      // UTC 时间无需纠正
      startTime: customProps.field_start_date ? customProps.field_start_date.value : '2000-01-01T00:00:00Z',
      // UTC 时间无需纠正
      endTime: customProps.field_end_date ? customProps.field_end_date.value : '2000-01-01T00:00:00Z',
      travelStatus: item.status,
      createdDate: item.createdDate ? moment(item.createdDate).format() : null,
      lastModifiedDate: item.lastModifiedDate ? moment(item.lastModifiedDate).format() : null,
      employeeTrafficItems: [],
      itineraryItems: HuilianyiFormatter.transferItineraryHeadDTOs(item.travelApplication?.itineraryHeadDTOs),
      expenseFormCodes: (item.referenceExpenseReports || []).map((item) => item.businessCode),
      extrasData: {
        participants: customProps.field_participants ? JSON.parse(customProps.field_participants.value) : [],
        itineraryMap: itineraryMap,
        customProps: customProps,
      },
    }
  }

  public static transferItineraryHeadDTOs(itineraryItems?: ItineraryHeadDTO[]): App_TravelCoreItinerary[] {
    itineraryItems = itineraryItems || []
    return itineraryItems.map((itinerary) => {
      const appItinerary: App_TravelCoreItinerary = {
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        fromCityName: itinerary.fromCityName,
        toCityName: itinerary.toCityName,
        subsidyList: [],
      }
      const itineraryBudgetDTOList = itinerary.itineraryBudgetDTOList || []
      if (itineraryBudgetDTOList.length > 0) {
        const itineraryBudgetDTO = itineraryBudgetDTOList[0]
        const items = itineraryBudgetDTO.travelSubsidiesRequestItemDetailDTOs || []
        appItinerary.subsidyList = items.map((item) => ({
          userName: item.userName,
          userOID: item.userOID,
          date: TimeUtils.momentUTC8(item.subsidiesDate).format('YYYY-MM-DD'),
          amount: item.amount,
          cityName: item.cityName,
        }))
      }
      return appItinerary
    })
  }

  public static extractMonthList(timeRange: { startDate: string; endDate: string }) {
    const startMoment = TimeUtils.momentUTC8(timeRange.startDate)
    const endMoment = TimeUtils.momentUTC8(timeRange.endDate)
    const monthList: string[] = []
    while (startMoment.valueOf() <= endMoment.valueOf()) {
      monthList.push(moment(startMoment).format('YYYY-MM'))
      startMoment.startOf('month').add(1, 'month')
    }
    return monthList
  }

  public static transferMonthSectionInfos(
    itineraryItems: { startDate: string; endDate: string }[]
  ): TravelMonthSection[] {
    const monthMapper: { [p: string]: { startDate: string; endDate: string }[] } = {}
    for (const itinerary of itineraryItems) {
      const monthList = HuilianyiFormatter.extractMonthList(itinerary)
      for (const month of monthList) {
        if (!monthMapper[month]) {
          monthMapper[month] = []
        }
        monthMapper[month].push(itinerary)
      }
    }
    const monthList = Object.keys(monthMapper)
    monthList.sort()
    return monthList.map((month) => {
      const itineraryItems = monthMapper[month] as App_TravelCoreItinerary[]
      const startMoment1 = TimeUtils.momentUTC8(itineraryItems[0].startDate)
      const endMoment1 = TimeUtils.momentUTC8(itineraryItems[itineraryItems.length - 1].endDate)
      const startMoment2 = TimeUtils.momentUTC8(month).startOf('month')
      const endMoment2 = TimeUtils.momentUTC8(month).endOf('month')

      return {
        month: month,
        startDate: (startMoment1.valueOf() < startMoment2.valueOf() ? startMoment2 : startMoment1).format('YYYY-MM-DD'),
        endDate: (endMoment1.valueOf() > endMoment2.valueOf() ? endMoment2 : endMoment1).format('YYYY-MM-DD'),
        itineraryItems: itineraryItems,
      }
    })
  }

  public static transferTravelOrder<T>(
    item: HLY_OrderBase,
    companyOid: string,
    employeeIdToUserOidMapper: { [p: string]: string },
    extrasHandler: (orderItem: App_TravelOrderBase<T>) => App_TravelOrderExtras<T>
  ): App_TravelOrderBase<T> {
    const orderItem: App_TravelOrderBase<T> = {
      hlyId: Number(item.orderId),
      userOid: employeeIdToUserOidMapper[item.employeeId] || '',
      employeeId: item.employeeId,
      applicantName: item.applicant,
      companyOid: companyOid,
      journeyNo: item.journeyNo || '',
      businessCode: item.journeyNo && /^[\w]{10}-[\w-]+$/.test(item.journeyNo) ? item.journeyNo.split('-')[0] : null,
      orderType: item.orderType,
      payType: item.payType,
      orderStatus: item.orderStatus,
      auditStatus: item.auditStatus,
      createdDate: item.orderCreateDate,
      lastModifiedDate: item.lastModifiedDate,
      startTime: '',
      endTime: '',
      ticketUserOids: [],
      ticketUserNames: [],
      extrasData: {} as any,
    }
    const extrasData = extrasHandler(orderItem)
    orderItem.startTime = extrasData.startTime
    orderItem.endTime = extrasData.endTime
    orderItem.ticketUserOids = extrasData.commonTickets.map((item) => item.userOid)
    orderItem.ticketUserNames = extrasData.commonTickets.map((item) => item.userName)
    orderItem.extrasData = extrasData
    return orderItem
  }

  public static transferFlightInfo(detail: HLY_OrderFlightCoreInfo): App_TravelFlightTicketInfo {
    return {
      flightOrderOID: detail.flightOrderOID,
      flightCode: detail.flightCode,
      airline: detail.airline,
      startDate: detail.startDate,
      endDate: detail.endDate,
      startCity: detail.startCity,
      endCity: detail.endCity,
      startCityCode: detail.startCityCode,
      startPortCode: detail.startPortCode,
      endCityCode: detail.endCityCode,
      endPortCode: detail.endPortCode,
      employeeId: detail.passengerInfo.CorpEid,
      employeeName: detail.passengerInfo.PassengerName,
    }
  }

  public static transferTrainTicketInfo(detail: HLY_OrderTrainTicketInfo): App_TravelTrainTicketInfo {
    return {
      trainOrderOID: detail.orderId,
      trainName: detail.trainName,

      startDate: detail.departureDateTime,
      endDate: detail.arrivalDateTime,

      departureCityName: detail.departureCityName,
      departureStationName: detail.departureStationName,
      arrivalCityName: detail.arrivalCityName,
      arrivalStationName: detail.arrivalStationName,

      electronicOrderNo: detail.orderId,
      passengerName: detail.passengerName,
    }
  }
}
