import { HLY_Staff } from './HLY_CoreModels'
import { HLY_InvoiceStatusStr } from './HLY_InvoiceStatus'
import { HLY_ExpenseField } from './HuilianyiModels'

export interface InvoiceLabelDTO {
  type: string
  name: string
  description: string
  toast: string
}

export interface HLY_Invoice {
  id: string
  invoiceOID: string
  expenseTypeId: string
  expenseTypeOID: string
  expenseTypeName: string // '差旅-出差补助'
  erApportionEnabled: boolean
  crossCheckStatus: number
  expenseTypeKey: null
  expenseTypeIconName: string
  phoneNumber: string | null
  email: string | null
  expenseTypeIconURL: string
  expenseTypeSubsidyType: number
  expenseTypeCategorySimpleDTO: {
    expenseTypeCategoryOID: string
    name: string // '差旅费'
    code: string //  ''
    sequence: number // 0
  }
  reimbursementUserId: string
  reimbursementUserName: string
  reimbursementUserOID: string
  reimbursementUser: HLY_Staff
  amount: number
  originalAmount: number
  invoiceCurrencyCode: string // 'CNY'
  currencyCode: string // 'CNY'
  mobile: string | null
  employeeId: string
  bookerEmployeeId: string | null
  data: HLY_ExpenseField[] // 开始结束日期，出发城市，到达城市
  invoiceStatus: HLY_InvoiceStatusStr
  invoiceSaveStatus: null
  comment: null
  warning: string // ''
  overtime: string // 'N'
  forceEnabled: string // 'N'
  createdDate: string // '2023-06-26T21:00:00Z'
  attachments: []
  displayed: true
  withReceipt: true
  readonly: boolean
  businessCode: null
  createLocation: null
  timeZoneOffset: number // 1e-7
  createTime: string // '2023-06-27T08:09:04Z'
  lastModifiedDate: string // '2023-06-27T08:04:04Z'
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
  priceTaxAmount: null
  expenseAmount: number
  vatInvoiceCurrencyCode: null
  receiptGoodsID: null
  checkCode: null
  invoiceLabelDTOS: InvoiceLabelDTO[]
  invoiceLabels: []
  companyOID: string
  modifyCompanyOID: null
  companyID: string
  companyName: null
  departmentName: null
  invoiceInstead: false
  invoiceInsteadReason: null
  paymentType: 1001
  source: null
  ownerOID: string
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
  actualCurrencyAmount: 50
  baseAmount: 50
  updateRate: true
  flightNo: null
  reimbursementType: null
  apportionUsed: true
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
  orderAmount: number
  totalServiceFee: null
  orderCurrency: string // 'CNY'
  mileageAllowanceExpenseDTO: null
  mileageAllowanceExpenseV2DTO: null
  didiReceiptedInvoiceOid: null
  receiptedStatus: number // 1
  tenantId: string
  autoAudit: false
  applicationNumber: null
  applicationSource: null
  applicationList: []
  receiptList: []
  relReceipt: boolean
  internationalFlag: string // 'N'
  summaryInfo: ''
  currencyPrecision: null
  expenseTypeCode: string // 'EX0087'
  receiptTotalAmount: null
  bankTransactionTotalAmount: null
  paymentScheduleId: null
  paymentScheduleSequence: null
  subsidyAmount: number
  subsidyBaseAmount: number
  manualAudit: false
  errorReceipts: []
  invoiceNoteList: null
  standardExceededReason: null
  standardExceededApprovalRecords: null
  substituteExpenseType: null
  enableDeduction: false
  deductionType: null
  deductionAmount: null
  deductionTaxRateEnum: null
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
  currencyDate: string // '2023-06-26T21:00:00Z'
  supplierType: null
  companyPay: null
  receiptCount: null
  vendorCode: null
  mixPay: null
  custFormValues: []
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
  expenseAmortiseAmount: number
  checkApportionmentReceiptAmount: boolean
  entityType: string // 'INVOICE'
  entityOID: string
  stringCol3: null
  stringCol1: string // '{"startDate":"2023-06-26T21:00:00Z","endDate":"2023-06-27T11:59:00Z","duration":1.0}'
  stringCol2: null
  create: false
  vatInvoice: false
  prependCheck: null
  ableToCreatedManually: false
  entityOwner: string //
  supplierExpense: false
  handler: string[]
  currentLanguage: string // 'zh-cn'
}
