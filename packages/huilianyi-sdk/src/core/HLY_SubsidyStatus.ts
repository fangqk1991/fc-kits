import { Descriptor } from '@fangcha/tools'

export enum HLY_SubsidyStatus {
  HasNoSubsidy = 0,
  HasSubsidy = 1,
}

const values = [HLY_SubsidyStatus.HasNoSubsidy, HLY_SubsidyStatus.HasSubsidy]

const describe = (code: HLY_SubsidyStatus) => {
  switch (code) {
    case HLY_SubsidyStatus.HasNoSubsidy:
      return '无补贴数据'
    case HLY_SubsidyStatus.HasSubsidy:
      return '有补贴数据'
  }
  return code
}

export const HLY_SubsidyStatusDescriptor = new Descriptor(values, describe)
