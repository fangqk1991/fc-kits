import { Descriptor } from '@fangcha/tools'

export enum HLY_StaffStatus {
  Normal = 1001, // 正常
  WillQuit = 1002, // 待离职
  Quited = 1003, // 已离职
}

const values = [HLY_StaffStatus.Normal, HLY_StaffStatus.WillQuit, HLY_StaffStatus.Quited]

const describe = (code: HLY_StaffStatus) => {
  switch (code) {
    case HLY_StaffStatus.Normal:
      return '正常'
    case HLY_StaffStatus.WillQuit:
      return '待离职'
    case HLY_StaffStatus.Quited:
      return '已离职'
  }
  return code
}

export const HLY_StaffStatusDescriptor = new Descriptor(values, describe)
