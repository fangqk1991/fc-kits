import { HLY_ExpenseV2 } from '../core/HLY_ExpenseModels'
import { App_ExpenseModel, App_TravelCoreItinerary, App_TravelModel, TravelMonthSection } from '../core/App_CoreModels'
import * as moment from 'moment/moment'
import { HLY_Travel, ItineraryHeadDTO } from '../core/HLY_TravelModels'

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
      travelStatus: item.status,
      createdDate: item.createdDate ? moment(item.createdDate).format() : null,
      lastModifiedDate: item.lastModifiedDate ? moment(item.lastModifiedDate).format() : null,
      itineraryItems: HuilianyiFormatter.transferItineraryHeadDTOs(item.travelApplication?.itineraryHeadDTOs),
      expenseFormCodes: (item.referenceExpenseReports || []).map((item) => item.businessCode),
      extrasData: {
        itineraryMap: item.travelApplication?.itineraryMap || {},
        customProps: item.custFormValues.reduce((result, cur) => {
          result[cur.fieldCode] = {
            fieldName: cur.fieldName,
            value: cur.value,
            showValue: cur.showValue || cur.value,
          }
          return result
        }, {}),
      },
    }
  }

  public static transferItineraryHeadDTOs(itineraryItems?: ItineraryHeadDTO[]): App_TravelCoreItinerary[] {
    return (itineraryItems || []).map((itinerary) => ({
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      fromCityName: itinerary.fromCityName,
      toCityName: itinerary.toCityName,
    }))
  }

  public static extractMonthList(timeRange: { startDate: string; endDate: string }) {
    const startMoment = moment(timeRange.startDate).utcOffset('+08:00')
    const endMoment = moment(timeRange.endDate).utcOffset('+08:00')
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
      const startMoment1 = moment(itineraryItems[0].startDate).utcOffset('+08:00')
      const endMoment1 = moment(itineraryItems[itineraryItems.length - 1].endDate).utcOffset('+08:00')
      const startMoment2 = moment(month).utcOffset('+08:00').startOf('month')
      const endMoment2 = moment(month).utcOffset('+08:00').endOf('month')

      return {
        month: month,
        startDate: (startMoment1.valueOf() < startMoment2.valueOf() ? startMoment2 : startMoment1).format('YYYY-MM-DD'),
        endDate: (endMoment1.valueOf() > endMoment2.valueOf() ? endMoment2 : endMoment1).format('YYYY-MM-DD'),
        itineraryItems: itineraryItems,
      }
    })
  }
}
