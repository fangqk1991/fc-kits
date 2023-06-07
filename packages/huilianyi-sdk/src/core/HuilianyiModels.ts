export interface HuilianyiResponse<T> {
  message: string
  errorCode: string
  data: T
}

export interface HLY_CustomFormValue {
  bizType: string
  formValueOID: string
  bizOID: string
  fieldOID: string
  fieldName: string
  fieldType: string
  value: any
  messageKey: string
  fieldValueCode: string
}

/**
 * https://opendocs.huilianyi.com/implement/master-data/staff/select-employee.html
 */
export interface HLY_Staff {
  employeeID: string
  mobile: string
  fullName: string
  email: string
  status: number // 1001--正常;1002--待离职;1003--离职
  title: string
  userOID: string
  departmentOID: string
  departmentName: string
  departmentPath: string
  companyOID: string
  companyCode: string
  companyName: string
  gender: number // 0--男;1--女;2--未知
  genderCode: string // 0--男;1--女;2--未知
  employeeType: string
  employeeTypeCode: string
  duty: string
  dutyCode: string
  rank: string
  rankCode: string
  directManager: string
  directManagerName: string
  directManagerEmployeeId: string
  customFormValues: HLY_CustomFormValue[]
  contactCards: any[]
  contactBankAccounts: any[]
  userCreditDTOList: any[]
  leavingDate: string
  activated: boolean
}

/**
 * https://opendocs.huilianyi.com/implement/master-data/department/select-department.html
 */
export interface HLY_SimpleDepartment {
  departmentOID: string
  departmentName: string
  departmentPath: string
  status: number // 101--启用;102--禁用;103--删除
  customFormValues: HLY_CustomFormValue[]
  departmentType: string
}

export interface HLY_CustomField {
  fieldCode: string
  fieldName: string
  value: string
}

export interface HLY_Company {
  // id / companyOID 输出不稳定，不建议使用
  // id: number
  // companyOID: string
  code: string
  name: string
  parentCompanyCode: string | null
  parentCompanyName: string | null
  legalEntityOID: string
  legalEntityName: string
  // customFormValues: HLY_CustomField[] | null
  isEnabled: boolean
}

export interface HLY_UserGroup {
  userGroupOID: string
  code: string
  name: string
  companyOID: null
  companyCode: null
  enabled: boolean
  comment: null
  levelCode: string // 'TENANT'
}

export interface HLY_Department {
  id: string
  i18n: null
  departmentOID: null
  parent: null
  children: null
  name: string
  path: string
  company: null
  manager: null
  users: []
  status: null
  custDeptNumber: null
  tenantId: null
  dataSource: null
  departmentCode: null
  inactiveDate: null
  sequenceNumber: null
  departmentType: null
  approvalLevel: null
}

export interface HLY_User {
  id: string
  userOID: string
  employeeID: string
  email: string
  userType: null
  login: null
  fullName: string
  title: string
  activated: true
  avatar: null
  department: HLY_Department
  corporationOID: null
  corporationName: null
  leavingDate: null
  status: null
  relevanceCustomEnumerationItem: false
  phones: []
  role: null
  financeRoleOID: null
  defaultCertificateNo: null
  companyOID: null
  companyName: null
  departmentName: null
  departmentOID: null
  birthday: null
  entryDate: null
  rankCode: null
  employeeTypeCode: null
  dutyCode: null
  gender: null
  genderCode: null
  directManager: null
  language: null
  tenantId: null
  multiJob: false
}

export interface HLY_SimpleLegalEntity {
  legalEntityOID: string
  entityName: string
  enabled: boolean
}

export interface HLY_LegalEntity {
  legalEntityOID: string
  entityName: string
  enabled: boolean

  setOfBooksId: string
  setOfBooksCode: string
  setOfBooksName: string
  taxpayerType: string
  createdDate: string
}

export interface HLY_CostCenter {
  id: string
  costCenterOID: string
  name: string
  code: string
  tenantId: string
  companyId: null
  setOfBooksId: null
  setOfBooksCode: null
  setOfBooksName: null
  companyOID: null
  companyName: null

  costCenterItems: any[]
  enabled: boolean
  i18n: null
  sequenceNumber: 1
  parentCostCenterId: null
  parentCostCenterOID: null
  parentCostCenterCode: null
  parentCostCenterName: null
  formOID: string
  childCostCenterId: null
  childCostCenterOID: null
  childCostCenterName: null
  hasItemRecord: null
  levelCode: string // 'TENANT'
  levelOrgId: string
  levelOrgName: null
  selfTree: false
  itemAmount: null
  costCenterType: string // 'INNER'
}

export interface HLY_CostCenterItem {
  costCenterItemOID: string
  parentCostCenterItemOID: null
  name: string
  code: string
  parentCostCenterItemCode: string
  parentCostCenterItemName: string
  sequenceNumber: string
  managerOID: string
  managerFullName: string
  enabled: boolean
  group: null
  isPublic: boolean
  allTenant: boolean
}

export interface HLY_ReceiptedInvoice {
  id: string
  companyReceiptedOID: string
  companyName: string
  setOfBooksId: string
  setOfBooksName: string
  companyOID: null
  enable: boolean
  taxpayerNumber: null
  address: null
  accountBank: null
  telephone: null
  cardNumber: null
  createdDate: null
  lastModifiedDate: null
  userAmount: null
  userOIDs: null
  parentLegalEntityId: null
  parentLegalEntityName: null
  i18n: null
  attachmentId: null
  fileURL: null
  mainLanguage: null
  alipayRespDTO: null
  legalEntityAttachmentDTOs: []
  userMainJobCompanyName: null
  legalEntityDetail: null
  startDate: null
  endDate: null
  legalEntityType: null
  legalEntityTypeName: null
  taxpayerType: string
  taxConfirmStatus: boolean
  taxLocationCode: null
  taxLocationName: null
  taxSignPassword: null
}

export interface HLY_ExpenseField {
  fieldOID: string
  fieldType: string // 'TEXT'
  fieldDataType: string // 'TEXT'
  mappedColumnId: number
  name: string
  value: null
  codeName: null
  messageKey: string
  businessCode: string
  sequence: 1
  outerContactorCode: null
  customEnumerationDTO: null
  customEnumerationOID: null
  customEnumerationName: null
  printHide: false
  required: false
  showOnList: true
  editable: false
  defaultValueMode: 'CURRENT'
  defaultValueKey: null
  showValue: null
  isDefaultValueConfigurable: true
  isCommonField: true
  reportKey: null
  accountingKey: null
  placeholder: null
  config: {
    datePattern: ''
    daysComputeMode: 1
    dateCombinedEnableTime: null
    dateCombinedStartTime: null
    dateCombinedEndTime: null
    dateCombinedEnableDaysConvert: null
    daysConvertStartDayTimeStart: null
    daysConvertStartDayTimeEnd: null
    dateCombinedStartDayConvertDays: null
    daysConvertEndDayTimeStart: null
    daysConvertEndDayTimeEnd: null
    dateCombinedEndDayConvertDays: null
    participantsRange: 3
    showOnEdit: true
    applicationScopMap: []
    cityLevelRange: []
    multiApplicationEnabled: 0
    showBudgetDetail: 0
    upperLimit: 9
    attachmentTypeRange: []
    hyperLinkPrefix: ''
    hyperMode: null
    fillType: null
    multipleChoice: false
    outCustomEnumeration: false
    doubleDecimalDigits: null
    externalParticipantInputType: null
    isCanAddContactor: null
    employeesType: null
    externalEmployeesScope: false
    associatedApplicationType: null
    participantDefaultValue: null
    manyMileage: null
    monthDefaultValue: null
    hasAssociateInvoiceMileage: null
    budgetLineRange: null
    cityDefaultValue: null
    addToSummary: false
  }
  textWordLimit: 200
  i18n: null
  uniqueObj: null
  formOID: null
}

export interface HLY_ExpenseType {
  id: string
  expenseTypeOID: string
  code: string
  name: string
  parentName: null
  iconName: string
  iconURL: string
  messageKey: string
  classificationCode: string
  readonly: boolean
  enabled: boolean
  isSystem: boolean
  valid: boolean
  fixedUnitPrice: boolean
  unitPriceEditMode: string
  unit: null
  unitPrice: null
  fields: HLY_ExpenseField[]
  sequence: 0
  needSplit: false
  ruleTotal: null
  companyOID: null
  tenantId: string
  setOfBooksId: null
  setOfBooks: null
  setOfBooksName: null
  isAttachmentRequired: false
  attachmentRequired: 0
  pasteInvoiceNeeded: true
  expenseTypeCategoryOID: string
  expenseTypeCategoryId: string
  expenseTypeCategoryName: string
  subsidyType: number
  apportionEnabled: false
  erApportionEnabled: false
  loanApportionEnabled: false
  erAmortiseEnabled: false
  crossCheckStatus: number
  titleRequired: false
  titleWordLimit: number
  titlePlaceholder: null
  titleShowOnList: true
  invoiceRequired: false
  apportionmentDataScope: number
  isAbleToCreatedManually: false
  isAmountEditable: false
  isAmountIncreased: false
  supplierType: number
  accessibleRights: number
  companyRights: number
  pushType: string // 'ALL'
  pushToBooker: false
  confirmationStatus: string // 'confirmed'
  reportKey: null
  recommendType: null
  depth: number
  parentId: null
  i18n: null
  timeSupported: boolean
  canFutureDate: boolean
  notEditableDate: boolean
  dateRemindText: null
  occurDateDefaultValue: string // 'CURRENT'
  dateLinkageValue: string // 'none'
  multipleInvoiceSupported: boolean
  promptEnabled: boolean
  promptTitle: null
  promptContent: null
  instructions: null
  showServiceFeeSplit: boolean
  serviceFeeSplit: number
  tripStatisticsEnabled: boolean
  expenseTypeCatetoryCode: null
  displayEnabled: true
  paymentGenerate: number
  attachmentPrompt: null
  enabledUserGroups: null
  enabledCompanies: null
  enabledCompanieGroups: null
  enabledDepartmentGroups: []
  showExpenseCreateDate: true
  levelCode: string // 'TENANT'
  levelOrgName: null
  enableDeduction: null
  deductionTypeList: null
  dateBringInVal: true
  levelName: null
  departmentGroupRights: 0
  expAmountDefaultValue: null
  enableInstead: null
  needInsteadReason: null
  requireInsteadExpenseType: null
  supplementReceiptSupported: false
  canCreateExpense: null
  notSupportedReason: null
  isIncentive: false
  amountReceiptCheck: number
  skipAmountCurrencyDifferenceCheck: false
  units: null
  substituteExpenseTypeEnabled: null
  deductionByTaxRate: false
  enableDeductionTaxRateEnumItems: null
  formOID: null
  customFormFields: []
  isChangeCategory: null
}

export interface HLY_Reimbursement {
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
  labelToast: string
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

/**
 * https://opendocs.huilianyi.com/implement/report-data/ExpenseDetailsReport.html
 */
export interface HLY_ExpenseDetail {
  departmentCode: string // '0001'
  setOfBooksId: string
  legalEntityOid: string
  companyOid: string
  applicantOid: string
  expenseTypeCategory: string // '其它'
  setOfBooksName: string // '默认账套'
  expenseType: string // '团建'
  ownerName: string
  ownerEmpId: string // '0001'
  applicantComName: string
  applicantDeptName: string
  expenseLabels: string // '电子票/手录发票'
  createdDate: string // '2022-10-11'
  createdTime: string // '11:31:14'
  expenseCreatedDate: string // '2021-07-13 11:34:15'
  comment: string
  invoiceCurrencyCode: string // 'CNY'
  amount: string // '74.00'
  companyCurrencyRate: string // '1.0'
  actualCurrencyRate: string // '1.0'
  exchangeRateDifference: string // '0.0'
  functionalCurrencyCode: string // 'CNY'
  baseAmount: string // '74.00'
  formTypeDesc: string // '日常报销单'
  businessCode: string
  billingCode: string
  billingNo: string
  formName: string // '日常报销单'
  reimbSubmittedDate: string // '2022-10-11 11:35:40'
  reimbRemark: string // '1'
  reimbLastModifiedDate: '2022-10-11 11:35:41'
  reimbStatusDesc: string // '待付款'
  reimbApprovalDate: '2022-10-11 11:35:40'
  reimbLastApprover: string
  reimbAuditApprovalDate: string // '2022-10-11 11:35:41'
  reimbAuditApprover: string
  nonVatInclusiveAmount: string // '69.81'
  taxAmount: string // '4.19'
  oriAmount: string // '74.00'
  originalApprovedNonVat: string // '69.81'
  originalApprovedVat: string // '4.19'
  nonVatBaseAmount: string // '69.81'
  baseCurrencyTax: string // '4.19'
  baseApprovedNonVat: string // '69.81'
  baseApprovedVat: string // '4.19'
  applicantDeptPath: string
  applicantLegalName: string
  departmentName: string
  vatInvoiceDesc: string
  expenseTypeCode: string // 'EXP_COMMON_TEAM_BUILDING'
  invoiceInsteadDesc: string
  payeeTypeDesc: string
  payeeName: string
  departmentPath: string
  companyName: string
  reimbBookDate: string // '2022-10-11'
  invoiceId: string
  reimbPrintViewDate: string // '2022-10-11 11:35:40'
  isAutoAuditDesc: string
  applicantComCode: string // '1'
  companyCode: string // '1'
  lastApprovalDate: string // '2022-10-11 11:35:40'
  financeApprovalDate: string // '2022-10-11 11:35:41'
  integrationId: string
  relatedReceiptDesc: string
  enableDeductionDesc: string
  deductionAmount: string // '0.0000'
  exchangeRateAmount: string // '0.0'
  payeeNumber: string
  firstSubmittedDate: string // '2022-10-11 11:35:39'
  applicantEmpId: string
  applicantName: string
}

/**
 * https://opendocs.huilianyi.com/implement/report-data/TrvappReport.html
 */
export interface HLY_TravelApplyForm {
  departmentCode: string
  setOfBooksId: string
  legalEntityOid: string
  companyOid: string
  departmentOid: string
  applicantOid: string
  businessCode: string
  relatedBusinessCode: string
  submittedByName: string
  submittedByEmpId: string
  applicantName: string
  applicantEmpId: string
  applicantComName: string
  applicantEntityName: string
  applicantDeptName: string
  companyName: string
  departmentName: string
  participantEmpId: string
  startDate: string
  endDate: string
  title: string
  currencyCode: string // 'CNY'
  totalBudget: string
  booker: string
  appSubmittedByDate: string // '2022-07-28 21:19:13'
  firstSubmittedDate: string // '2022-07-28 21:19:13'
  appStatusDesc: string // '审批通过'
  appApprovalDate: string // '2022-07-28 21:21:07'
  lastApprover: string
  trvItineraryTypeDesc: string // '机票'
  supplierName: string // '甄选机票'
  isRoundTrip: string // '单程'
  trvItineraryCity: string // '上海 - 北京'
  trvItineraryDate: string // '2022-07-29 - 2022-07-29'
  roomQty: string // '0'
  formName: string // '日程式差旅申请单'
  applicantDeptPath: string
  departmentPath: string
  version: string // '0'
  travelDays: string // '2'
  integrationId: string
  itHeadCity: string // '上海-北京'
  itHeadDate: string // '2022-07-29 00:00:00-2022-07-30 00:00:00'
  companyCode: string
  applicantComCode: string
  applicantMainJobRank: string
  internalParticipant: string
}
