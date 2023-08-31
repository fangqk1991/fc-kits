import { Descriptor } from '@fangcha/tools'

export enum HLY_GenerateType {
  Auto = 0,
  Custom = 1,
}

const values = [HLY_GenerateType.Auto, HLY_GenerateType.Custom]

const describe = (code: HLY_GenerateType) => {
  switch (code) {
    case HLY_GenerateType.Auto:
      return '系统生成'
    case HLY_GenerateType.Custom:
      return '人工维护'
  }
  return code
}

export const HLY_GenerateTypeDescriptor = new Descriptor(values, describe)
