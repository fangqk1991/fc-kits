import { HLY_ExpenseV2 } from '../core/HLY_ExpenseModels'
import {
  App_ExpenseModel,
  App_TravelCoreItinerary,
  App_TravelModel,
  App_TravelOrderFlight,
  TravelMonthSection,
} from '../core/App_CoreModels'
import * as moment from 'moment/moment'
import { HLY_Travel, ItineraryHeadDTO } from '../core/HLY_TravelModels'
import { TimeUtils } from '../core/TimeUtils'
import { HLY_OrderFlight } from '../core/HLY_TravelOrderModels'

export class HuilianyiFormatter {
  public static transferExpenseModel(item: HLY_ExpenseV2): App_ExpenseModel {
    const expenseFieldVOList = item.expenseFieldVOList || []
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
        customFormValueVOList: item.customFormValueVOList,
        invoiceVOList: item.invoiceVOList,
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

  public static transferTravelModel(item: HLY_Travel): App_TravelModel {
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
      hasSubsidy: itineraryItems.find((item) => item.subsidyList.length > 0) ? 1 : 0,
      startTime: customProps.field_start_date ? customProps.field_start_date.value : '2000-01-01T00:00:00Z',
      endTime: customProps.field_end_date ? customProps.field_end_date.value : '2000-01-01T00:00:00Z',
      travelStatus: item.status,
      createdDate: item.createdDate ? moment(item.createdDate).format() : null,
      lastModifiedDate: item.lastModifiedDate ? moment(item.lastModifiedDate).format() : null,
      itineraryItems: HuilianyiFormatter.transferItineraryHeadDTOs(item.travelApplication?.itineraryHeadDTOs),
      expenseFormCodes: (item.referenceExpenseReports || []).map((item) => item.businessCode),
      extrasData: {
        participants: customProps.field_participants ? JSON.parse(customProps.field_participants.value) : [],
        itineraryMap: item.travelApplication?.itineraryMap || {},
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

  public static transferTravelOrderFlightModel(item: HLY_OrderFlight, companyOid: string): App_TravelOrderFlight {
    return {
      hlyId: Number(item.orderId),
      employeeId: item.employeeId,
      applicantName: item.applicant,
      companyOid: companyOid,
      journeyNo: item.journeyNo || null,
      businessCode: item.journeyNo && /^[\w-]+$/.test(item.journeyNo) ? item.journeyNo.split('-')[0] : null,
      orderType: item.orderType,
      payType: item.payType,
      orderStatus: item.orderStatus,
      auditStatus: item.auditStatus,
      createdDate: item.orderCreateDate,
      lastModifiedDate: item.lastModifiedDate,
      extrasData: {
        tickets: item.flightOrderDetails.map((detail) => ({
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
        })),
      },
    }
  }
}
