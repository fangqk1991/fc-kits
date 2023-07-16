import { HLY_StaffCoreDTO } from './HLY_CoreModels'
import { HLY_CustomFormItem } from './HLY_CustomFormModels'
import { HLY_ExpenseApplicationStatus } from './HLY_ExpenseApplicationStatus'

export interface HLY_ExpenseApplicationEntity {
  applicationOID: string
  baseCurrencyAmount: number
  businessCode: string
  costCenterItemOID: string
  currencyCode: string // 'CNY'
  departmentOID: string
  participantNum: number
  totalBudget: number
}

export interface HLY_ExpenseApplicationModel {
  businessCode: string

  applicationOID: string
  applicant: HLY_StaffCoreDTO

  companyOID: string

  formCode: string
  formName: string

  status: HLY_ExpenseApplicationStatus // 1002
  title: string
  submittedDate: string // '2023-06-16T08:40:14Z'

  createdBy: string
  createdDate: string // '2023-06-16T08:40:07Z'

  closed: boolean
  companyCode: string
  currencyCode: string // 'CNY'
  custFormValues: HLY_CustomFormItem[]

  jobId: string
  // lastModifiedDate: string // '2023-06-16T08:41:16Z'
  lastRejectType: number // 1000
  loanableAmount: number
  originCurrencyCode: string // 'CNY'
  originCurrencyTotalAmount: number
  participantClosed: boolean
  remark: string
  totalAmount: number
  version: number

  approvalHistorys: any[]

  expenseApplication: HLY_ExpenseApplicationEntity
}
