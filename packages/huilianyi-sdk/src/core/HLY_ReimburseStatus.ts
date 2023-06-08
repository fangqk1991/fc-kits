import { Descriptor } from '@fangcha/tools'

export enum HLY_ReimburseStatus {
  Init = 1001, // 初始化
  Submitted = 1002, // 提交审批
  Passed = 1003, // 审批通过
  Passed2 = 1004, // 审核通过
  Paid = 1005, // 已付款
  WaitingForPayment = 1007, // 待付款
  Confirmed = 1008, // 已确认（付款中）
  Canceled = 1015, // 取消支付
}

const describe = (code: HLY_ReimburseStatus) => {
  switch (code) {
    case HLY_ReimburseStatus.Init:
      return '初始化'
    case HLY_ReimburseStatus.Submitted:
      return '提交审批'
    case HLY_ReimburseStatus.Passed:
      return '审批通过'
    case HLY_ReimburseStatus.Passed2:
      return '审核通过'
    case HLY_ReimburseStatus.Paid:
      return '已付款'
    case HLY_ReimburseStatus.WaitingForPayment:
      return '待付款'
    case HLY_ReimburseStatus.Confirmed:
      return '已确认（付款中）'
    case HLY_ReimburseStatus.Canceled:
      return '取消支付'
  }
  return code
}

export const HLY_ReimburseStatusDescriptor = new Descriptor(Object.values(HLY_ReimburseStatus), describe)
