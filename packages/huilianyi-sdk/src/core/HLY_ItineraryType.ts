import { Descriptor } from '@fangcha/tools'

export enum HLY_ItineraryType {
  SingleTrip = 1001, // 单程
  RoundTrip = 1002, // 往返
}

const values = [HLY_ItineraryType.SingleTrip, HLY_ItineraryType.RoundTrip]

const describe = (code: HLY_ItineraryType) => {
  switch (code) {
    case HLY_ItineraryType.SingleTrip:
      return '单程'
    case HLY_ItineraryType.RoundTrip:
      return '往返'
  }
  return code
}

export const HLY_ItineraryTypeDescriptor = new Descriptor(values, describe)
