import { Descriptor } from '@fangcha/tools'

export enum HLY_OrderType {
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  HOTEL = 'HOTEL',
}

const values = [HLY_OrderType.FLIGHT, HLY_OrderType.TRAIN, HLY_OrderType.HOTEL]

const describe = (code: HLY_OrderType) => {
  switch (code) {
    case HLY_OrderType.FLIGHT:
      return '机票'
    case HLY_OrderType.TRAIN:
      return '火车票'
    case HLY_OrderType.HOTEL:
      return '酒店'
  }
  return code
}

export const HLY_OrderTypeDescriptor = new Descriptor(values, describe)
