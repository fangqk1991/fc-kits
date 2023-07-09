import { HLY_CustomFormValue } from './HLY_CoreModels'
import { ExpenseFieldDTO, ExpenseReportInvoiceView, HLY_ExpenseType } from './HLY_ExpenseModels'
import { HLY_ExpenseStatus } from './HLY_ExpenseStatus'
import { HLY_TravelStatus } from './HLY_TravelStatus'
import { HLY_TravelParticipant, ItineraryMap } from './HLY_TravelModels'
import { HLY_Invoice } from './HLY_InvoiceModels'
import { HLY_InvoiceStatus } from './HLY_InvoiceStatus'
import { HLY_PrettyStatus } from './HLY_PrettyStatus'
import { HLY_VerifiedStatus } from './HLY_VerifiedStatus'
import { HLY_SubsidyStatus } from './HLY_SubsidyStatus'

export enum RetainConfigKey {
  ExpenseTypeMetadata = 'ExpenseTypeMetadata',
}

export interface App_FormBase<T = any> {
  hlyId: number
  businessCode: string
  applicationOid: string | null
  applicantOid: string | null
  applicantName: string
  companyOid: string | null
  departmentOid: string | null
  corporationOid: string | null
  formCode: string | null
  formOid: string | null
  formName: string
  submittedBy: string | null
  title: string
  createdDate: string | null
  lastModifiedDate: string | null
  extrasData: T
}

export interface App_ExpenseExtrasData {
  customProps: {
    [propKey: string]: {
      fieldName: string
      value: string
      showValue: string
    }
  }
  customFormValueVOList: HLY_CustomFormValue[]
  invoiceVOList: ExpenseReportInvoiceView[]
  expenseProps: {
    [propKey: string]: {
      name: string
      fieldType: string
      value: string
      showValue: string
    }
  }
  expenseFieldVOList: ExpenseFieldDTO[]
}

export interface App_ExpenseModel extends App_FormBase<App_ExpenseExtrasData> {
  expenseType: HLY_ExpenseType
  expenseStatus: HLY_ExpenseStatus
  totalAmount: number
  applyFormCodes: string[]
}

export interface App_TravelExtrasData {
  itineraryMap: ItineraryMap
  participants: HLY_TravelParticipant[]
  customProps: {
    [propKey: string]: {
      fieldName: string
      value: string
      showValue: string
    }
  }
}

export interface App_TravelSubsidyItem {
  userName: string
  userOID: string
  date: string
  amount: number
  cityName: string // '北京'
}

export interface App_TravelCoreItinerary {
  startDate: string
  endDate: string
  fromCityName: string
  toCityName: string
  subsidyList: App_TravelSubsidyItem[]
}

export interface TravelDateRange {
  startDate: string
  endDate: string
}

export interface TravelMonthSection {
  month: string
  startDate: string
  endDate: string
  itineraryItems: App_TravelCoreItinerary[]
}

export interface App_TravelModel extends App_FormBase<App_TravelExtrasData> {
  startTime: string
  endTime: string
  hasSubsidy: HLY_SubsidyStatus
  travelStatus: HLY_TravelStatus
  itineraryItems: App_TravelCoreItinerary[]
  expenseFormCodes: string[]
}

export interface App_Invoice {
  invoiceOid: string
  invoiceStatus: HLY_InvoiceStatus
  expenseTypeCode: string
  expenseTypeName: string
  reimbursementOid: string
  reimbursementName: string
  amount: number
  createdDate: string | null
  lastModifiedDate: string | null
  extrasData: HLY_Invoice
}

export interface App_TravelAllowanceExtrasData {
  itineraryItems: App_TravelCoreItinerary[]
}

export interface App_TravelAllowanceModel {
  uid: string
  businessCode: string
  targetMonth: string
  applicantOid: string
  applicantName: string
  title: string
  daysCount: number
  amount: string
  extrasData: App_TravelAllowanceExtrasData
  subsidyItems: App_TravelSubsidyItem[]
  detailItems: App_TravelAllowanceItem[]
  isPretty: HLY_PrettyStatus
  isVerified: HLY_VerifiedStatus
}

/**
 * @deprecated
 */
export interface App_TravelAllowanceItem {
  startDate: string
  endDate: string
  city: string
  daysCount: number
  allowanceAmount: number
}
