import { HLY_CustomFormValue } from './HLY_CoreModels'
import { ExpenseFieldDTO, ExpenseReportInvoiceView, HLY_ExpenseType } from './HLY_ReimbursementModels'
import { HLY_ReimburseStatus } from './HLY_ReimburseStatus'
import { HLY_TravelStatus } from './HLY_TravelStatus'
import { TravelApplication } from './HLY_TravelModels'

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
  expenseStatus: HLY_ReimburseStatus
  totalAmount: number
}

export interface App_TravelExtrasData {
  travelApplication?: TravelApplication
  customProps: {
    [propKey: string]: {
      fieldName: string
      value: string
      showValue: string
    }
  }
}

export interface App_TravelModel extends App_FormBase<App_TravelExtrasData> {
  travelStatus: HLY_TravelStatus
  itineraryItems: any[]
}
