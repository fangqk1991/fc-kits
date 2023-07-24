import { Descriptor } from '@fangcha/tools'

export enum HLY_TravelStatus {
  Init = 1001, // 编辑中
  Submitted = 1002, // 审批中
  Passed = 1003, // 审批通过
  Deleted = 1010, // 已删除
  Changed = 1011, // 已变更
  Abandoned = 1012, // 已报废
}

const values = [
  HLY_TravelStatus.Init,
  HLY_TravelStatus.Submitted,
  HLY_TravelStatus.Passed,
  HLY_TravelStatus.Deleted,
  HLY_TravelStatus.Changed,
  HLY_TravelStatus.Abandoned,
]

const describe = (code: HLY_TravelStatus) => {
  switch (code) {
    case HLY_TravelStatus.Init:
      return '编辑中'
    case HLY_TravelStatus.Submitted:
      return '审批中'
    case HLY_TravelStatus.Passed:
      return '审批通过'
    case HLY_TravelStatus.Deleted:
      return '已删除'
    case HLY_TravelStatus.Changed:
      return '已变更'
    case HLY_TravelStatus.Abandoned:
      return '已报废'
  }
  return code
}

export const HLY_TravelStatusDescriptor = new Descriptor(values, describe)
