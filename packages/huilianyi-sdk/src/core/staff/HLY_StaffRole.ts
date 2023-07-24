import { Descriptor } from '@fangcha/tools'

export enum HLY_StaffRole {
  Normal = 'Normal',
  Manager = 'Manager',
}

const values = [HLY_StaffRole.Normal, HLY_StaffRole.Manager]

const describe = (code: HLY_StaffRole) => {
  switch (code) {
    case HLY_StaffRole.Normal:
      return '普通员工'
    case HLY_StaffRole.Manager:
      return '管理层'
  }
  return code
}

export const HLY_StaffRoleDescriptor = new Descriptor(values, describe)
