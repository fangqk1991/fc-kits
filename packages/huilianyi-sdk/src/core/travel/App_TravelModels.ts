import { HLY_TravelParticipant } from './HLY_TravelModels'
import { HLY_ClosedLoopStatus } from './HLY_ClosedLoopStatus'
import { HLY_PrettyStatus } from './HLY_PrettyStatus'
import { HLY_TravelStatus } from './HLY_TravelStatus'
import { HLY_VerifiedStatus } from './HLY_VerifiedStatus'
import { HLY_OrderHotelCoreInfo } from './HLY_TravelOrderModels'
import { App_FormBase } from '../basic/App_CoreModels'
import { AllowanceDayItem, CityStayItem } from '../allowance/App_AllowanceModels'
import { HLY_OrderType } from './HLY_OrderType'
import { HLY_AllowanceCase } from './HLY_AllowanceCase'

export interface App_TravelExtrasData {
  participants: HLY_TravelParticipant[]
  customProps: {
    [propKey: string]: {
      fieldName: string
      value: string
      showValue: string
    }
  }
}

export interface App_TravelSubsidyItem {
  userName: string
  userOID: string
  date: string
  amount: number
  cityName: string // '北京'
}

export interface App_TravelCoreItinerary {
  startDate: string
  endDate: string
  fromCityName: string
  toCityName: string
  subsidyList: App_TravelSubsidyItem[]
}

export interface App_TravelModel extends App_FormBase<App_TravelExtrasData> {
  startTime: string
  endTime: string
  costOwnerOid: string
  costOwnerName: string
  matchClosedLoop: HLY_ClosedLoopStatus
  isPretty: HLY_PrettyStatus
  travelStatus: HLY_TravelStatus
  itineraryItems: App_TravelCoreItinerary[]
  employeeTrafficItems: App_EmployeeTrafficData[]
  expenseFormCodes: string[]
  hasRepeated: number
  isNewest: number
  overlappedCodes: string[]
  isIgnored: number
}

export interface App_TravelAllowanceExtrasData {
  itineraryItems: App_TravelCoreItinerary[]
  closedLoops: App_TicketsFragment[]
  tickets: App_TrafficTicket[]
}

export interface App_AllowanceCustomInfo {
  useCustom: number
  customData: App_AllowanceCoreData
}

export interface App_AllowanceCoreData {
  daysCount: number
  amount: number
  detailItems: AllowanceDayItem[]
}

export interface App_TravelAllowanceModel {
  uid: string
  businessCode: string
  targetMonth: string
  applicantOid: string
  applicantName: string
  title: string
  companyOid: string
  companyName: string
  baseCity: string
  costOwnerOid: string
  costOwnerName: string
  startTime: string
  endTime: string
  daysCount: number
  amount: number
  useCustom: number
  withoutAllowance: number
  allowanceCase: HLY_AllowanceCase
  customData: App_AllowanceCoreData
  extrasData: App_TravelAllowanceExtrasData
  detailItems: AllowanceDayItem[]
  isPretty: HLY_PrettyStatus
  isVerified: HLY_VerifiedStatus
}

export interface App_TicketParams {
  customCode?: string
  customValid?: number | null
}

export interface App_TrafficTicket {
  ticketId: string
  orderType: HLY_OrderType
  orderId: number
  orderOid: string
  userOid: string
  employeeId: string
  userName: string
  baseCity: string
  trafficCode: string
  fromTime: string
  toTime: string
  fromCity: string
  toCity: string
  journeyNo: string
  businessCode: string
  hlyCode: string
  customCode: string
  isValid: number
  isDummy: number
  customValid?: number | null
  ctripValid?: number
  ctripStatus?: string
  useForAllowance?: number
  inClosedLoop?: number
  remarks?: string
}

export interface App_TicketsFragment {
  isPretty?: boolean
  tickets: App_TrafficTicket[]
}

export interface App_EmployeeTrafficData {
  userOid: string
  employeeId: string
  employeeName: string
  isClosedLoop: boolean
  tickets: App_TrafficTicket[]
  closedLoops: App_TicketsFragment[]
  singleLinks: App_TicketsFragment[]
  allowanceDayItems: AllowanceDayItem[]
  cityStayItems: CityStayItem[]
}

export interface App_TravelFlightTicketInfo {
  flightOrderOID: string
  flightCode: string
  airline: string
  startDate: string // '2023-07-04 23:25:00'
  endDate: string // '2023-07-05 01:40:00'
  startCity: string // '北京'
  endCity: string // '杭州'
  startCityCode: string // 'BJS'
  startPortCode: string // 'PKX'
  endCityCode: string // 'HGH'
  endPortCode: string // 'HGH'

  employeeId: string
  employeeName: string
}

export interface App_TravelTrainTicketInfo {
  trainOrderOID: string
  trainName: string

  startDate: string // '2023-07-04 23:25:00'
  endDate: string // '2023-07-05 01:40:00'

  departureCityName: string // "上海",
  departureStationName: string // "上海虹桥",
  arrivalCityName: string // "台州",
  arrivalStationName: string // "台州西",

  electronicOrderNo: string
  passengerName?: string

  // passengerName 多个人用 , 分隔
}

export interface App_TravelOrderExtras<T = any> {
  userNamesStr: string
  tickets: T[]
  commonTickets: App_TrafficTicket[]
  startTime: string | null
  endTime: string | null
}

export interface App_TravelOrderBase<T = any> {
  hlyId: number
  userOid: string
  employeeId: string | null
  applicantName: string
  companyOid: string | null
  journeyNo: string
  businessCode: string | null
  orderType: string
  payType: string
  orderStatus: string
  ctripStatus?: string
  auditStatus: string
  createdDate: string | null
  lastModifiedDate: string | null
  startTime: string | null
  endTime: string | null
  ticketUserOids: string[]
  ticketUserNames: string[]
  extrasData: App_TravelOrderExtras<T>
}

export interface App_TravelHotelCoreInfo extends HLY_OrderHotelCoreInfo {}

export interface App_TravelOrderFlight extends App_TravelOrderBase<App_TravelFlightTicketInfo> {}

export interface App_TravelOrderTrain extends App_TravelOrderBase<App_TravelTrainTicketInfo> {}

export interface App_TravelOrderHotel extends App_TravelOrderBase<App_TravelHotelCoreInfo> {}

export interface UserTicketReport {
  userOid: string
  userName: string
  count: number
  validCount: number
  invalidCount: number
}
