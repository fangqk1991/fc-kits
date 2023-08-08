import { Descriptor } from '@fangcha/tools'

export enum CTrip_OrderType {
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  HOTEL = 'HOTEL',
}

const values = [CTrip_OrderType.FLIGHT, CTrip_OrderType.TRAIN, CTrip_OrderType.HOTEL]

const describe = (code: CTrip_OrderType) => {
  switch (code) {
    case CTrip_OrderType.FLIGHT:
      return '机票'
    case CTrip_OrderType.TRAIN:
      return '火车票'
    case CTrip_OrderType.HOTEL:
      return '酒店'
  }
  return code
}

export const CTrip_OrderTypeDescriptor = new Descriptor(values, describe)
