import { Descriptor } from '@fangcha/tools'

export enum HLY_ExpenseApplicationStatus {
  Init = 1001, // 编辑中
  Submitted = 1002, // 审批中
  Passed = 1003, // 审批通过
  Stopped = 1009, // 已停用
  Deleted = 1010, // 已删除
  Changed = 1011, // 已变更
  Abandoned = 1012, // 已报废
}

const values = [
  HLY_ExpenseApplicationStatus.Init,
  HLY_ExpenseApplicationStatus.Submitted,
  HLY_ExpenseApplicationStatus.Passed,
  HLY_ExpenseApplicationStatus.Stopped,
  HLY_ExpenseApplicationStatus.Deleted,
  HLY_ExpenseApplicationStatus.Changed,
  HLY_ExpenseApplicationStatus.Abandoned,
]

const describe = (code: HLY_ExpenseApplicationStatus) => {
  switch (code) {
    case HLY_ExpenseApplicationStatus.Init:
      return '编辑中'
    case HLY_ExpenseApplicationStatus.Submitted:
      return '审批中'
    case HLY_ExpenseApplicationStatus.Stopped:
      return '已停用'
    case HLY_ExpenseApplicationStatus.Passed:
      return '审批通过'
    case HLY_ExpenseApplicationStatus.Deleted:
      return '已删除'
    case HLY_ExpenseApplicationStatus.Changed:
      return '已变更'
    case HLY_ExpenseApplicationStatus.Abandoned:
      return '已报废'
  }
  return code
}

export const HLY_ExpenseApplicationStatusDescriptor = new Descriptor(values, describe)
