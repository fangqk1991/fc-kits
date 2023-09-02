import { Descriptor } from '@fangcha/tools'

/**
 * https://openapi.ctripbiz.com/#/serviceApi?apiId=1000158
 */
export enum CTrip_FlightChangeType {
  Changed = 0,
  Canceled = 1,
  Delayed = 2,
  Recovery = 5,
}
// 0:航班变化;1:航班取消;2:待定延误;5:取消恢复

const values = [
  CTrip_FlightChangeType.Changed,
  CTrip_FlightChangeType.Canceled,
  CTrip_FlightChangeType.Delayed,
  CTrip_FlightChangeType.Recovery,
]

const describe = (code: CTrip_FlightChangeType) => {
  switch (code) {
    case CTrip_FlightChangeType.Changed:
      return '航班变化'
    case CTrip_FlightChangeType.Canceled:
      return '航班取消'
    case CTrip_FlightChangeType.Delayed:
      return '待定延误'
    case CTrip_FlightChangeType.Recovery:
      return '取消恢复'
  }
  return code
}

export const CTrip_FlightChangeTypeDescriptor = new Descriptor(values, describe)
