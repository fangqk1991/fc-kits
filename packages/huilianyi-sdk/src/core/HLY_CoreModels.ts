import { HLY_Department } from './HuilianyiModels'
import { HLY_LabelType } from './HLY_LabelType'

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
  showValue?: any
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

export interface HLY_EntityLabelDTO {
  labelType: HLY_LabelType | string // 标签类型
  level: 'ERROR' | 'WARN' | 'INFO' // 标签级别，ERROR（禁止），WARN（警告），INFO（提示）
  toast: string // 标签提示文案
}

export interface HLY_PreCheckResponseDTO {
  result: true // 检查结果	true为固定值
  labels: HLY_EntityLabelDTO[] // 费用标签列表
  message?: string // 用于前端展示。预留字段，非必传
}
