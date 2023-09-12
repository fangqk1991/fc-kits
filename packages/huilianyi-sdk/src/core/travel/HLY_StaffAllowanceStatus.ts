import { Descriptor } from '@fangcha/tools'

export enum HLY_StaffAllowanceStatus {
  UseAllowance = 0,
  WithoutAllowance = 1,
}

const values = [HLY_StaffAllowanceStatus.UseAllowance, HLY_StaffAllowanceStatus.WithoutAllowance]

const describe = (code: HLY_StaffAllowanceStatus) => {
  switch (code) {
    case HLY_StaffAllowanceStatus.UseAllowance:
      return '发放补贴'
    case HLY_StaffAllowanceStatus.WithoutAllowance:
      return '不发放补贴'
  }
  return code
}

export const HLY_StaffAllowanceStatusDescriptor = new Descriptor(values, describe)
