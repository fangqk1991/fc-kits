import { Descriptor } from '@fangcha/tools'

/**
 * https://opendocs.huilianyi.com/implement/business-data/public-application/query-public.html
 */
export enum HLY_PublicApplicationStatus {
  Init = 1001, // 初始化
  Submitted = 1002, // 提交审批
  Passed = 1003, // 审批通过
  Suspended = 1009, // 已停用
  Deleted = 1010, // 已删除
  Changed = 1011, // 已变更
  Abandon = 1012, // 已报废
}

const values = [
  HLY_PublicApplicationStatus.Init,
  HLY_PublicApplicationStatus.Submitted,
  HLY_PublicApplicationStatus.Passed,
  HLY_PublicApplicationStatus.Suspended,
  HLY_PublicApplicationStatus.Deleted,
  HLY_PublicApplicationStatus.Changed,
  HLY_PublicApplicationStatus.Abandon,
]

const describe = (code: HLY_PublicApplicationStatus) => {
  switch (code) {
    case HLY_PublicApplicationStatus.Init:
      return '初始化'
    case HLY_PublicApplicationStatus.Submitted:
      return '提交审批'
    case HLY_PublicApplicationStatus.Passed:
      return '审批通过'
    case HLY_PublicApplicationStatus.Suspended:
      return '已停用'
    case HLY_PublicApplicationStatus.Deleted:
      return '已删除'
    case HLY_PublicApplicationStatus.Changed:
      return '已变更'
    case HLY_PublicApplicationStatus.Abandon:
      return '已报废'
  }
  return code
}

export const HLY_PublicApplicationStatusDescriptor = new Descriptor(values, describe)
