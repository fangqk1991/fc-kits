import { HLY_InvoiceStatus } from './HLY_InvoiceStatus'
import { HLY_Invoice } from './HLY_InvoiceModels'
import { HLY_CustomFormValue } from './HLY_CoreModels'
import { ExpenseFieldDTO, ExpenseReportInvoiceView, HLY_ExpenseType } from './HLY_ExpenseModels'
import { HLY_ExpenseStatus } from './HLY_ExpenseStatus'
import { App_FormBase } from './App_CoreModels'

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
