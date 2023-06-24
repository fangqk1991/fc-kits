import { HLY_ExpenseV2 } from '../core/HLY_ReimbursementModels'
import { App_ExpenseModel, App_TravelCoreItinerary, App_TravelModel } from '../core/App_CoreModels'
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
      extrasData: {
        travelApplication: item.travelApplication,
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
}
