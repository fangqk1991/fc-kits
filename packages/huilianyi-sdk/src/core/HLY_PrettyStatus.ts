import { Descriptor } from '@fangcha/tools'

export enum HLY_PrettyStatus {
  NotPretty = 0,
  Pretty = 1,
}

const values = [HLY_PrettyStatus.NotPretty, HLY_PrettyStatus.Pretty]

const describe = (code: HLY_PrettyStatus) => {
  switch (code) {
    case HLY_PrettyStatus.NotPretty:
      return '非标'
    case HLY_PrettyStatus.Pretty:
      return '标准'
  }
  return code
}

export const HLY_PrettyStatusDescriptor = new Descriptor(values, describe)
