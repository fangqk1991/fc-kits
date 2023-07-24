import { Descriptor } from '@fangcha/tools'

export enum HLY_DepartmentStatus {
  Normal = 1001, // 正常
  Disabled = 1002, // 禁用
  Deleted = 1003, // 删除
}

const values = [HLY_DepartmentStatus.Normal, HLY_DepartmentStatus.Disabled, HLY_DepartmentStatus.Deleted]

const describe = (code: HLY_DepartmentStatus) => {
  switch (code) {
    case HLY_DepartmentStatus.Normal:
      return '正常'
    case HLY_DepartmentStatus.Disabled:
      return '禁用'
    case HLY_DepartmentStatus.Deleted:
      return '删除'
  }
  return code
}

export const HLY_DepartmentStatusDescriptor = new Descriptor(values, describe)
