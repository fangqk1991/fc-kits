import { HLY_TravelParticipant, ItineraryMap } from './HLY_TravelModels'
import { HLY_SubsidyStatus } from './HLY_SubsidyStatus'
import { HLY_ClosedLoopStatus } from './HLY_ClosedLoopStatus'
import { HLY_PrettyStatus } from './HLY_PrettyStatus'
import { HLY_TravelStatus } from './HLY_TravelStatus'
import { HLY_VerifiedStatus } from './HLY_VerifiedStatus'
import { HLY_OrderHotelCoreInfo } from './HLY_TravelOrderModels'
import { App_FormBase } from './App_CoreModels'

export interface App_TravelExtrasData {
  itineraryMap: ItineraryMap
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

export interface TravelMonthSection {
  month: string
  startDate: string
  endDate: string
  itineraryItems: App_TravelCoreItinerary[]
}

export interface App_TravelModel extends App_FormBase<App_TravelExtrasData> {
  startTime: string
  endTime: string
  hasSubsidy: HLY_SubsidyStatus
  matchClosedLoop: HLY_ClosedLoopStatus
  isPretty: HLY_PrettyStatus
  travelStatus: HLY_TravelStatus
  itineraryItems: App_TravelCoreItinerary[]
  employeeTrafficItems: App_EmployeeTrafficData[]
  expenseFormCodes: string[]
}

export interface App_FullTravelModel extends App_TravelModel {
  ticketsData: TravelTicketsDataInfo
}

export interface App_TravelAllowanceExtrasData {
  itineraryItems: App_TravelCoreItinerary[]
}

export interface App_TravelAllowanceModel {
  uid: string
  businessCode: string
  targetMonth: string
  applicantOid: string
  applicantName: string
  title: string
  daysCount: number
  amount: string
  extrasData: App_TravelAllowanceExtrasData
  subsidyItems: App_TravelSubsidyItem[]
  detailItems: App_TravelAllowanceItem[]
  isPretty: HLY_PrettyStatus
  isVerified: HLY_VerifiedStatus
}

/**
 * @deprecated
 */
export interface App_TravelAllowanceItem {
  startDate: string
  endDate: string
  city: string
  daysCount: number
  allowanceAmount: number
}

export interface App_TrafficTicket {
  tagName: string
  ticketId: string
  trafficCode: string
  fromTime: string
  toTime: string
  fromCity: string
  toCity: string
  employeeId: string
  employeeName: string
}

export interface App_EmployeeTrafficData {
  employeeId: string
  employeeName: string
  isClosedLoop: boolean
  tickets: App_TrafficTicket[]
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
}

export interface App_TravelOrderExtras<T = any> {
  usersStr: string
  tickets: T[]
}

export interface App_TravelOrderBase<T = any> {
  hlyId: number
  employeeId: string | null
  applicantName: string
  companyOid: string | null
  journeyNo: string
  businessCode: string | null
  orderType: string
  payType: string
  orderStatus: string
  auditStatus: string
  createdDate: string | null
  lastModifiedDate: string | null
  extrasData: App_TravelOrderExtras<T>
}

export interface App_TravelHotelCoreInfo extends HLY_OrderHotelCoreInfo {}

export interface App_TravelOrderFlight extends App_TravelOrderBase<App_TravelFlightTicketInfo> {}

export interface App_TravelOrderTrain extends App_TravelOrderBase<App_TravelTrainTicketInfo> {}

export interface App_TravelOrderHotel extends App_TravelOrderBase<App_TravelHotelCoreInfo> {}

export interface TravelTicketsDataInfo {
  flightTickets: App_TravelFlightTicketInfo[]
  trainTickets: App_TravelTrainTicketInfo[]
  trafficTickets: App_TrafficTicket[]
  employeeTrafficData: { [employeeName: string]: App_EmployeeTrafficData }
}
