import { HLY_CustomFormValue } from './HLY_CoreModels'
import { ExpenseFieldDTO, ExpenseReportInvoiceView, HLY_ExpenseType } from './HLY_ReimbursementModels'
import { HLY_ReimburseStatus } from './HLY_ReimburseStatus'

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

export interface App_ExpenseModel {
  hlyId: number
  businessCode: string
  applicationOid: string | null
  applicantOid: string | null
  applicantName: string
  companyOid: string | null
  departmentOid: string | null
  corporationOid: string | null
  formOid: string | null
  formName: string
  submittedBy: string | null
  title: string
  expenseType: HLY_ExpenseType
  expenseStatus: HLY_ReimburseStatus
  totalAmount: number
  createdDate: string | null
  firstSubmittedDate: string | null
  lastSubmittedDate: string | null
  lastModifiedDate: string | null
  extrasData: App_ExpenseExtrasData
}
