export interface HuilianyiResponse<T> {
  message: string
  errorCode: string
  data: T
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
