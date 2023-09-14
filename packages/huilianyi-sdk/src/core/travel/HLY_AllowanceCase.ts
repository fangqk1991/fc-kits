import { Descriptor } from '@fangcha/tools'

export enum HLY_AllowanceCase {
  Case_1 = 1,
  Case_2 = 2,
  Case_3 = 3,
  Case_4 = 4,
  Case_5 = 5,
}

const values = [HLY_AllowanceCase.Case_1, HLY_AllowanceCase.Case_2, HLY_AllowanceCase.Case_3, HLY_AllowanceCase.Case_4]

const describe = (code: HLY_AllowanceCase) => {
  switch (code) {
    case HLY_AllowanceCase.Case_1:
      return '有出差申请和相关票据'
    case HLY_AllowanceCase.Case_2:
      return '有出差申请但票据缺失'
    case HLY_AllowanceCase.Case_3:
      return '有出差申请但无票据'
    case HLY_AllowanceCase.Case_4:
      return '有票据但无出差申请'
    case HLY_AllowanceCase.Case_5:
      return '其他'
  }
  return code
}

export const HLY_AllowanceCaseDescriptor = new Descriptor(values, describe)
