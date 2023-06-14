import { HLY_Department } from './HuilianyiModels'

/**
 * @description https://opendocs.huilianyi.com/widget.html
 */
export interface HLY_CustomFormValue {
  bizType: string
  formValueOID: string
  bizOID: string
  fieldOID: string
  fieldName: string
  fieldType: string
  fieldCode: string
  value: any
  messageKey: string
  fieldValueCode: string | null
}

export interface HLY_StaffCoreDTO {
  userOID: string
  fullName: string
  employeeID: string
  department: HLY_Department
}

/**
 * https://opendocs.huilianyi.com/implement/master-data/staff/select-employee.html
 */
export interface HLY_Staff extends HLY_StaffCoreDTO {
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
