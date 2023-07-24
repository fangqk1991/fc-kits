import { HLY_StaffRole } from './HLY_StaffRole'
import { HLY_StaffStatus } from './HLY_StaffStatus'

export interface App_StaffModel {
  userOid: string
  employeeId: string
  staffRole: HLY_StaffRole
  companyCode: string
  fullName: string
  email: string
  departmentOid: string
  departmentPath: string
  staffStatus: HLY_StaffStatus
  entryDate: string
  leavingDate: string
  groupOids: string[]
  groupCodes: string[]
  groupNames: string[]
}

export interface App_StaffGroupModel {
  groupOid: string
  groupCode: string
  groupName: string
  isEnabled: number
}