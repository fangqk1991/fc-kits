import { HLY_CustomFormValue, HLY_EntityLabelDTO, HLY_Staff } from './HLY_CoreModels'
import { HLY_ExpenseStatus } from './HLY_ExpenseStatus'
import { HLY_FieldBusinessCode, HLY_FieldType } from './HLY_FieldType'
import { HLY_InvoiceStatusStr } from './HLY_InvoiceStatus'
import { InvoiceLabelDTO } from './HLY_InvoiceModels'

export interface ExpenseFieldDTO {
  fieldOID: string
  fieldType: HLY_FieldType
  name: string // 字段名称
  value: string // 字段值
  showValue: string // 字段展示值
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

export enum HLY_ExpenseTravelStandardValidStatus {
  Pending = 1001, // 未验证
  Verified = 1002, // 验证通过
  Invalid = 1003, // 验证失败
}

// 驳回类型枚举
export enum HLY_ExpenseRejectType {
  Normal = 1000, // 正常
  Recalled = 1001, // 撤回
  ApprovalRejected = 1002, // 审批驳回
  FinanceRejected = 1003, // 财务审核驳回
}

// 收单状态枚举
export enum HLY_ExpenseReceiveStatus {
  Pending = 0, // 未收单
  Received = 1, // 已收单
  Returned = 2, // 已退单
  WaitingToReturn = 3, // 待退单
}

// 寄单状态枚举
export enum HLY_ExpenseSendBillStatus {
  Pending = 0, // 未寄单
  Sent = 1, // 已寄单
  Returned = 2, // 已退单
  WaitingToReturn = 3, // 待退单
}

// 附件来源类型枚举
export enum HLY_ExpenseResourceStatus {
  EXPENSE_REPORT = 'EXPENSE_REPORT', // 报销单
  RECEIPT = 'RECEIPT', // 发票
  INVOICE = 'INVOICE', // 费用
  APPROVAL_HISTORY = 'APPROVAL_HISTORY', // 审批历史
}

// 报销单类型枚举
export enum HLY_ExpenseType {
  Daily = 1001, // 日常报销单
  Travel = 1002, // 差旅报销单
  Cost = 1003, // 费用报销单
}

export interface OpenExpenseTypeVO {
  id: string
  expenseTypeOID: string
  name: string
  code: string
}

export interface OpenExpenseReportApplicationVO {
  applicationOID: string
  applicationBusinessCode: string
}

export interface HLY_ExpenseV2 {
  id: string // '15011743'
  expenseReportOID: string // UUID
  businessCode: string // 'ER15011743'
  departmentOID: string // UUID
  status: HLY_ExpenseStatus
  splitStatus: number // 拆单状态 0
  applicantJobId: string // '1661298278307860481'
  applicantOID: string // UUID
  applicantCompanyOID: string // UUID
  applicantDepartmentOID: string // UUID
  applicantCorporationOID: string // UUID
  applicationOID: string // UUID
  formOID: string // UUID
  corporationOID: string // UUID
  type: HLY_ExpenseType
  printable: boolean
  submittedBy: string // UUID
  lastSubmittedDate: string // '2023-06-07T08:51:32Z'
  firstSubmittedDate: string // '2023-06-07T08:47:57Z'
  formName: string
  formCode: string
  companyOID: string // UUID
  companyCode: string
  companyName: string
  docCompanyOID: string // UUID
  docCompanyCode: string
  docCompanyName: string
  currencyCode: string // 'CNY'
  baseCurrency: string // 'CNY'
  applicantName: string
  title: string
  expenseTypes: string // ''
  travelStandardValid: HLY_ExpenseTravelStandardValidStatus
  costCenterItemOID: string // UUID
  rejectType: HLY_ExpenseRejectType
  subCompanyOID: string // UUID
  sendEmailResult: boolean
  departmentName: string
  printFree: boolean // 查询的报销单是否免打印
  reviewedFlag: boolean // 单据被财务审核调整标记
  travelStandardWarning: boolean // 是否超差标
  receiveStatus: HLY_ExpenseReceiveStatus // 收单状态
  sendBillStatus: HLY_ExpenseSendBillStatus
  overBudgetFlag: true
  withdrawFlag: string // 撤回标记 'Y'
  budgetCheckMessage: string
  filterFlag: boolean
  lastRejectType: HLY_ExpenseRejectType
  autoAudit: false
  receiptCheckStatus: number // 核票状态 1000
  createdBy: string // UUID
  createdDate: string // '2023-06-06T02:08:29Z'
  lastModifiedDate: string // '2023-06-09T05:11:15Z'
  lastModifiedBy: string // UUID
  corporateFlag: boolean
  setOfBooksId: string
  tenantId: string
  applicantEmployeeId: string
  createdUserName: string
  createdUserEmployeeId: string
  departmentPath: string
  billStatus: number // 开票状态 1001
  totalAmount: number // 总金额
  realPaymentAmount: number // 单据实际支付金额
  baseCurrencyAmount: number
  withReceiptAmount: number
  withoutReceiptAmount: number
  exchangeRateValue: number
  personalPaymentAmount: number
  foreignCurrencyAmount: number
  personalPaymentBaseAmount: number
  toBeAuditDate: string // '2023-06-07T08:52:18Z'
  customFormValueVOList: HLY_CustomFormValue[]
  invoiceVOList: ExpenseReportInvoiceView[]
  expenseTypeVOList: OpenExpenseTypeVO[]
  expenseReportLabelVOList: any[]
  expenseFieldVOList: ExpenseFieldDTO[] // !!!
  expenseReportApplicationVOList: OpenExpenseReportApplicationVO[]
  // withReceipt ->
  // receiptVOList: any[],
  // receiptAttachmentVOList: any[],

  // withInvoiceAttachment ->
  // invoiceAttachmentVOList: any[]
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
  expenseReportLabels: HLY_EntityLabelDTO[]
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
  status: HLY_ExpenseStatus
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
  invoiceStatus: HLY_InvoiceStatusStr
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

export enum HLY_EntityType {
  Application = 1001, // 申请单
  Expense = 1002, // 报销单
  Loan = 3001, // 借款单
  Contract = 6001, // 合同

  // 对公申请单	1001
  // 对公支付单	1002
  // 预算日记账	3005
  // 其他	4001
  // 供应商申请	9003
  // 支付单	1501
  // 预提单	1701
}

export interface HLY_ApprovalParams {
  businessCode: string // 单号

  entityType: HLY_EntityType // 单据类型
  operator: string // 操作人工号
  approver: string // 审批链上的审批人工号

  approvalTxt?: string // 审批备注
}
