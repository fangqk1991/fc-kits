import { Descriptor } from '@fangcha/tools'

/**
 * @description https://opendocs.huilianyi.com/callback/business-data/application/pre.html
 * https://opendocs.huilianyi.com/callback/business-data/expense-report/pre-check.html
 */
export enum HLY_LabelType {
  MISMATCHED_TITLE = 'MISMATCHED_TITLE', //	抬头不一致	发票抬头和报销单不一致	INFO	-
  OVER_BUDGET = 'OVER_BUDGET', //	超预算		WARN	-
  WARN_BUDGET = 'WARN_BUDGET', // 预算警告		INFO	-
  SPECIFIC_AREA_TRAVEL = 'SPECIFIC_AREA_TRAVEL', //	特定地区出差		INFO	-
  EXPENSE_OVER_APPLICATION = 'EXPENSE_OVER_APPLICATION', //	费用超申请		WARN/INFO	-
  CROSS_COST_CENTER = 'CROSS_COST_CENTER', //	跨成本中心		INFO	-

  EXCEEDED = 'EXCEEDED', // 超标	WARN
  EXCEED_AMOUNT = 'EXCEED_AMOUNT', // 超额	WARN/INFO
}

const values = [
  HLY_LabelType.MISMATCHED_TITLE,
  HLY_LabelType.OVER_BUDGET,
  HLY_LabelType.WARN_BUDGET,
  HLY_LabelType.SPECIFIC_AREA_TRAVEL,
  HLY_LabelType.EXPENSE_OVER_APPLICATION,
  HLY_LabelType.CROSS_COST_CENTER,
  HLY_LabelType.EXCEEDED,
  HLY_LabelType.EXCEED_AMOUNT,
]

const describe = (code: HLY_LabelType) => {
  switch (code) {
    case HLY_LabelType.MISMATCHED_TITLE:
      return '抬头不一致'
    case HLY_LabelType.OVER_BUDGET:
      return '超预算'
    case HLY_LabelType.WARN_BUDGET:
      return '预算警告'
    case HLY_LabelType.SPECIFIC_AREA_TRAVEL:
      return '特定地区出差'
    case HLY_LabelType.EXPENSE_OVER_APPLICATION:
      return '费用超申请'
    case HLY_LabelType.CROSS_COST_CENTER:
      return '跨成本中心'
    case HLY_LabelType.EXCEEDED:
      return '超标'
    case HLY_LabelType.EXCEED_AMOUNT:
      return '超额'
  }
  return code
}

export const HLY_LabelTypeDescriptor = new Descriptor(values, describe)
