import { HLY_CustomFormValue, HLY_Staff } from './HLY_CoreModels'
import { HLY_ReimburseStatus } from './HLY_ReimburseStatus'

export interface HLY_Expense {
  applicant: HLY_Staff
  createdUser: HLY_Staff
  applicantCompanyOID: string
  applicantCorporationOID: string
  applicantDepartmentOID: string
  applicantID: number
  applicantJobId: string
  applicantName: string
  applicantOID: string
  applicantUserType: string // 'INTERNAL'
  applicationStartAndEndDateMap: {}
  asyncStatus: number // 1000
  autoAudit: boolean
  autoGoToSmallTripEdit: false
  baseCurrency: string // 'CNY'
  baseCurrencyAmount: number // 0
  businessCode: string
  companyCode: string
  companyName: string
  companyOID: string
  companyPaymentAmount: number // 0
  containsInvoice: boolean
  containsPaymentLine: boolean
  containsSubsidy: boolean
  corporateFlag: boolean
  corporationOID: string
  costCenterItemCode: string
  costCenterItemName: string
  costCenterItemOID: string
  createdBy: string
  createdDate: string // '2023-06-08T07:08:06Z'
  createdName: string
  currencyCode: string // 'CNY'
  currencyCodeName: string //'人民币'
  currencySame: boolean
  custFormValues: HLY_CustomFormValue[]
  departmentName: string
  departmentOID: string
  departmentPath: string
  detailJumpURL: string
  docCompanyCode: string
  docCompanyName: string
  docCompanyOID: string
  entityOID: string
  entityOwner: string
  entityType: string // 'EXPENSE_REPORT'
  existApprovalNumber: false
  expenseReportApplicationDTOS: []
  expenseReportInvoices: ExpenseReportInvoice[]
  expenseReportLabels: []
  expenseReportOID: string
  expenseTypes: string
  forceCount: number
  forceEnabled: string // 'N'
  foreignCurrencyAmount: number
  formCode: string
  formName: string
  formOID: string
  id: string
  ignoreBudgetWarningFlag: boolean
  ignoreWarnCheck: boolean
  isDateCombinedUTC: boolean
  lastModifiedBy: string
  lastModifiedDate: string // '2023-06-08T07:08:06Z'
  lastRejectType: number // 1000
  needApproval: false
  originTotalAmount: number // 0
  overtime: string // 'N'
  overtimeCount: number // 0
  paymentCurrencyCode: string // 'CNY'
  pendingAuditJumpURL: string
  personalPaymentAmount: number
  personalPaymentBaseAmount: number
  printFree: boolean
  printView: number // 0
  printable: boolean
  recalculateSubsidy: boolean
  receiptCheckStatus: number // 1000
  receiveStatus: number // 0
  rejectType: number // 1000
  reviewedFlag: boolean
  sendBillStatus: number // 0
  setOfBooksId: string
  showValidatePopUp: boolean
  splitStatus: number // 0
  ssoDetailJumpURL: string
  ssoViewJumpURL: string
  status: HLY_ReimburseStatus
  statusView: number // 1001
  subCompanyOID: string
  tenantId: string
  timeZoneOffset: number
  title: string
  totalAccrualWriteOffAmount: number // 0
  totalAmount: number // 0
  travelStandardValid: number // 1001
  travelStandardWarning: boolean
  type: number // 1001
  viewJumpURL: string
  withReceiptAmount: number
  withdrawEnable: boolean
  withoutReceiptAmount: number
  writeoffFlag: boolean
}

export interface HLY_ReimbursementReport {
  departmentCode: string
  setOfBooksId: string
  legalEntityOid: string
  companyOid: string
  departmentOid: string
  applicantOid: string
  businessCode: string
  formTypeDesc: string
  applicantName: string
  applicantEmpId: string
  applicantComName: string
  applicantDeptName: string
  submittedByName: string
  companyName: string
  title: string
  submittedDate: string // '2022-11-22 16:12:23'
  reimbStatusDesc: string // '待付款'
  reimbLastModifiedDate: string // '2022-11-22 16:12:25'
  reimbLastApprover: string
  reimbAuditApprover: string // '未维护信息'
  reimbAuditApprovalDate: string // '2022-11-22 16:12:25'
  currencyCode: string // 'CNY'
  totalAmount: string // '5000.00'
  functionalCurrencyCode: string // 'CNY'
  exchageRate: string // '1.0000'
  baseCurrencyAmount: string // '5000.00'
  baseReimbPaymentAmount: string // '0.00'
  realPaymentBaseAmount: string // '5000.00'
  labelName: string
  labelToast: string
  followingApprover: string
  formName: string
  departmentName: string
  applicantDeptPath: string
  departmentPath: string
  applicantLegalName: string
  receiveStatusDesc: string // '未收单'
  collectorName: string
  paymentCurrencyCode: string // 'CNY'
  createdByName: string
  reimbBookDate: string // '2022-11-22'
  integrationId: string
  approvalDate: string // '2022-11-22'
  approvalAndAuditName: string
  reimbPrintViewDate: string // '2022-11-22 16:12:24'
  applicantComCode: string // '1'
  companyCode: string // '1'
  lastApprovalDate: string // '2022-11-22 16:12:24'
  financeApprovalDate: string // '2022-11-22 16:12:25'
  firstSubmittedDate: string // '2022-11-22 16:12:23'
  realPaymentAmountNew: string // '5000.00'
}

export interface ExpenseReportInvoice {
  expenseReportInvoiceOID: string // 报销费用OID
  expenseReportOID: string // 报销单OID
  invoiceOID: string // 费用OID
  createdDate: string // 创建日期
  status: number // 报销单费用状态枚举
  invoiceView: any // 费用明细
}
