import { HLY_CustomFormValue, HLY_Staff } from './HLY_CoreModels'
import { HLY_ReimburseStatus } from './HLY_ReimburseStatus'
import { HLY_FieldBusinessCode, HLY_FieldType } from './HLY_FieldType'
import { HLY_InvoiceStatus } from './HLY_InvoiceStatus'

export interface ExpenseFieldDTO {
  fieldType: HLY_FieldType
  name: string // 字段名称
  value: string // 字段值
  businessCode: HLY_FieldBusinessCode // 控件业务编码
  sequence: number
  customEnumerationDTO: any // 值列表对象
  customEnumerationOID: string
  required: boolean // 是否必填
  outerContactorCode: string // 外部参与人编码
}

export interface AttachmentDTO {
  id: number
  attachmentOID: string
  fileName: string
  fileURL: string
  fileType: string
}

export interface InvoiceLabelDTO {
  type: string
  name: string
  description: string
  toast: string
}

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
  applicationBusinessCode?: string // 关联申请单号
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
  invoiceView: ExpenseReportInvoiceView // 费用明细
}

export interface ExpenseReportInvoiceView {
  id: string
  invoiceOID: string
  expenseTypeId: string
  expenseTypeOID: string
  expenseTypeName: string // '差旅-自驾/租车'
  erApportionEnabled: boolean
  crossCheckStatus: number // 0
  expenseTypeKey: null
  expenseTypeIconName: string
  phoneNumber: null
  email: null
  expenseTypeIconURL: string
  expenseTypeSubsidyType: number // 0
  expenseTypeCategorySimpleDTO: {
    expenseTypeCategoryOID: string
    name: string // '差旅费'
    code: string // ''
    sequence: number // 0
  }
  reimbursementUserId: string
  reimbursementUserName: string
  reimbursementUserOID: string
  reimbursementUser: HLY_Staff
  amount: number // 费用金额 100
  originalAmount: number // 费用原始金额 100
  invoiceCurrencyCode: string // 'CNY'
  currencyCode: string // 'CNY'
  mobile: string | null
  employeeId: string
  bookerEmployeeId: string | null
  data: ExpenseFieldDTO[] // Example [出发城市, 到达城市, 交通工具, 附件]
  invoiceStatus: HLY_InvoiceStatus
  invoiceSaveStatus: null
  comment: string
  warning: string
  overtime: string // 'N'
  forceEnabled: string // 'N'
  createdDate: string // '2023-06-08T06:44:43Z'
  attachments: AttachmentDTO[]
  displayed: null
  withReceipt: true
  readonly: false
  businessCode: null
  createLocation: null
  timeZoneOffset: number
  createTime: string // '2023-06-08T06:44:45Z'
  lastModifiedDate: string // '2023-06-08T10:10:27Z'
  rejectType: null
  rejectReason: null
  approvalStepId: null
  approvalOperates: null
  referenceId: null
  originalOrderNumber: null
  unitPrice: null
  number: null
  receiptFailType: null
  receiptFailReason: null
  valid: false
  receiptID: null
  cardSignType: null
  checkPlatform: null
  nonVATinclusiveAmount: number
  taxAmount: number
  nonVatBaseAmount: number
  baseCurrencyTax: number
  originalApprovedNonVat: number
  originalApprovedVat: number
  baseApprovedNonVat: number
  baseApprovedVat: number
  tax: number
  nonDeductibleAmount: number
  taxRate: number
  receiptType: null
  receiptTypeNo: null
  invoiceCode: null
  invoiceNumber: null
  attachmentOID: null
  invoiceDate: null
  priceTaxAmount: number | null
  expenseAmount: number
  vatInvoiceCurrencyCode: null
  receiptGoodsID: null
  checkCode: null
  invoiceLabelDTOS: []
  invoiceLabels: InvoiceLabelDTO[]
  companyOID: null
  modifyCompanyOID: null
  companyID: string
  companyName: null
  departmentName: null
  invoiceInstead: false
  invoiceInsteadReason: null
  paymentType: 1001
  source: null
  ownerOID: string // 费用归属人
  owner: HLY_Staff
  userOID: string
  reconciliationStatus: null
  createdBy: string
  checked: null
  createInvoice: true
  checkWarning: null
  digitalInvoice: null
  digitalInvoiceId: null
  actualCurrencyRate: 1
  originalActualCurrencyRate: 1
  companyCurrencyRate: 1
  actualCurrencyAmount: 100
  baseAmount: 100
  updateRate: true
  flightNo: null
  reimbursementType: null
  apportionUsed: false
  expenseApportion: null
  expenseAmortise: null
  expenseReportOID: null
  amountChanged: null
  approvalStatus: null
  bankTransactionID: null
  expenseCreatedType: null
  overDue: null
  bankTransactionDetail: null
  bankTransactionDetails: null
  baseCurrency: null
  subsidyRepeatedFlag: null
  orderAmount: 100
  totalServiceFee: null
  orderCurrency: null
  mileageAllowanceExpenseDTO: null
  mileageAllowanceExpenseV2DTO: null
  didiReceiptedInvoiceOid: null
  receiptedStatus: 1
  tenantId: string
  autoAudit: false
  applicationNumber: null
  applicationSource: null
  applicationList: []
  receiptList: []
  internationalFlag: string // 'N'
  summaryInfo: ''
  currencyPrecision: null
  expenseTypeCode: string // 'EX0006'
  receiptTotalAmount: null
  bankTransactionTotalAmount: null
  paymentScheduleId: string
  paymentScheduleSequence: string // '1'
  subsidyAmount: null
  subsidyBaseAmount: null
  manualAudit: false
  errorReceipts: []
  invoiceNoteList: []
  standardExceededReason: null
  standardExceededApprovalRecords: null
  substituteExpenseType: null
  enableDeduction: false
  deductionType: null
  deductionAmount: null
  relatedSettlementInvoiceOIDList: null
  relatedSettlementInvoiceAmountSum: null
  ownerJobId: null
  ownerJob: null
  balanceAmount: null
  expenseReportSubsidyDTO: null
  expenseReportSubsidyDetails: null
  toastMessage: null
  billingDetails: null
  recordId: null
  recordKey: null
  orderNo: null
  currencyDate: string // '2023-06-08T06:44:43Z'
  supplierType: null
  companyPay: null
  receiptCount: null
  vendorCode: null
  mixPay: null
  custFormValues: HLY_CustomFormValue[]
  customFormValuePDFDataList: null
  invoiceSupplementReceiptVO: null
  relatedApplicationItineraryBudgetVOList: null
  relatedContractExpenseLineVOList: null
  selectedUnit: null
  overStandReason: null
  overStandOptions: null
  unit: null
  applicationStatus: null
  summaryInvoiceOid: null
  associateCorpBusinessCode: null
  rollBackTransaction: null
  auditCreateInvoice: null
  auditModifyInvoice: null
  openApiModifyFields: null
  expenseAmortiseFixedAmount: null
  expenseAmortiseAmount: number // 100
  checkApportionmentReceiptAmount: true
  entityType: string // 'INVOICE'
  entityOID: string
  ableToCreatedManually: true
  stringCol1: string // 'Car'
  stringCol2: null
  stringCol3: null
  create: false
  vatInvoice: false
  prependCheck: null
  entityOwner: string
  supplierExpense: false
  handler: string[]
  currentLanguage: string // 'zh-cn'
}
