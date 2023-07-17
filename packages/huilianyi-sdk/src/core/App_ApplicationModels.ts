import { App_FormBase } from './App_CoreModels'
import { HLY_ExpenseApplicationStatus } from './HLY_ExpenseApplicationStatus'

export interface App_ApplicationExtrasData {
  customProps?: {
    [propKey: string]: {
      fieldName: string
      value: string
      showValue: string
    }
  }
}

export interface App_ExpenseApplicationModel extends App_FormBase<App_ApplicationExtrasData> {
  formStatus: HLY_ExpenseApplicationStatus
  totalAmount: number
}
