import { Descriptor } from '@fangcha/tools'

export enum HLY_VerifiedStatus {
  NotVerified = 0,
  Verified = 1,
}

const values = [HLY_VerifiedStatus.NotVerified, HLY_VerifiedStatus.Verified]

const describe = (code: HLY_VerifiedStatus) => {
  switch (code) {
    case HLY_VerifiedStatus.NotVerified:
      return '未核验'
    case HLY_VerifiedStatus.Verified:
      return '已核验'
  }
  return code
}

export const HLY_VerifiedStatusDescriptor = new Descriptor(values, describe)
