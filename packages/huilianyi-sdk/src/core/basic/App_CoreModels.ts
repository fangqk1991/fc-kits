export enum RetainConfigKey {
  ExpenseTypeMetadata = 'ExpenseTypeMetadata',
  ManagerMetadata = 'ManagerMetadata',
  CostCenterMetadata = 'CostCenterMetadata',
  ExpenseAvgMonthN = 'ExpenseAvgMonthN',
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
  costTypeOid?: string | null
  costOwnerOid?: string | null
  title: string
  createdDate: string | null
  lastModifiedDate: string | null
  extrasData: T
  version: number
}

export interface App_StaffCore {
  userOID: string
  employeeID: string
  fullName: string
}

export interface MonthAmountReport {
  month: string
  total: number
  totalAmount: number
}

export interface CostMonthlyReport {
  costTypeOid: string
  costOwnerOid: string
  month: string
  totalCount: number
  totalAmount: number
}

export interface CostOwnerReport {
  costOwnerOid: string
  costTypeOid: string
  totalCount: number
  totalAmount: number
  avgAmount: number
  monthItems: CostMonthlyReport[]
}

export interface App_CostCenterMetadata {
  [code: string]: App_CostCenter
}

export interface App_CostCenterItem {
  itemId: string
  name: string
}

export interface App_CostCenter {
  costCenterOID: string
  name: string
  code: string
  itemMap: {
    [itemId: string]: App_CostCenterItem
  }
}
