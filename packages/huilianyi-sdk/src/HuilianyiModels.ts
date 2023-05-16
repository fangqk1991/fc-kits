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
