import { Descriptor } from '@fangcha/tools'

export enum HLY_ClosedLoopStatus {
  NoneClosedLoop = 0,
  HasClosedLoop = 1,
}

const values = [HLY_ClosedLoopStatus.NoneClosedLoop, HLY_ClosedLoopStatus.HasClosedLoop]

const describe = (code: HLY_ClosedLoopStatus) => {
  switch (code) {
    case HLY_ClosedLoopStatus.NoneClosedLoop:
      return '无闭环行程'
    case HLY_ClosedLoopStatus.HasClosedLoop:
      return '有闭环行程'
  }
  return code
}

export const HLY_ClosedLoopStatusDescriptor = new Descriptor(values, describe)
