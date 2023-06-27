import { Descriptor } from '@fangcha/tools'

export enum HLY_ExpenseStatus {
  Init = 1001, // 初始化
  Submitted = 1002, // 提交审批
  Passed = 1003, // 审批通过
  Passed2 = 1004, // 审核通过
  Paid = 1005, // 已付款
  WaitingForPayment = 1007, // 待付款
  Confirmed = 1008, // 已确认（付款中）
  Canceled = 1015, // 取消支付
}

const values = [
  HLY_ExpenseStatus.Init,
  HLY_ExpenseStatus.Submitted,
  HLY_ExpenseStatus.Passed,
  HLY_ExpenseStatus.Passed2,
  HLY_ExpenseStatus.Paid,
  HLY_ExpenseStatus.WaitingForPayment,
  HLY_ExpenseStatus.Confirmed,
  HLY_ExpenseStatus.Canceled,
]

const describe = (code: HLY_ExpenseStatus) => {
  switch (code) {
    case HLY_ExpenseStatus.Init:
      return '初始化'
    case HLY_ExpenseStatus.Submitted:
      return '提交审批'
    case HLY_ExpenseStatus.Passed:
      return '审批通过'
    case HLY_ExpenseStatus.Passed2:
      return '审核通过'
    case HLY_ExpenseStatus.Paid:
      return '已付款'
    case HLY_ExpenseStatus.WaitingForPayment:
      return '待付款'
    case HLY_ExpenseStatus.Confirmed:
      return '已确认（付款中）'
    case HLY_ExpenseStatus.Canceled:
      return '取消支付'
  }
  return code
}

export const HLY_ExpenseStatusDescriptor = new Descriptor(values, describe)
