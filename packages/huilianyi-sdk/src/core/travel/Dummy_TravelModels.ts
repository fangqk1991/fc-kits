import { HLY_TravelStatus } from './HLY_TravelStatus'
import { HLY_OrderType } from './HLY_OrderType'

export interface DummyTravelModel {
  hlyId: number
  businessCode: string
  applicantOid: string | null
  applicantName: string
  submittedBy: string | null
  title: string
  startTime: string
  endTime: string
  travelStatus: HLY_TravelStatus
  version: number
  remarks: string
  createTime: string
  updateTime: string
}

export interface DummyTicketParams {
  orderType: HLY_OrderType
  userOid: string
  trafficCode: string
  fromTime: string
  toTime: string
  fromCity: string
  toCity: string
  businessCode: string
  remarks: string
  isValid?: number
}

export interface DummyTicketModel extends DummyTicketParams {
  orderType: HLY_OrderType
  userOid: string
  trafficCode: string
  fromTime: string
  toTime: string
  fromCity: string
  toCity: string
  businessCode: string
  remarks: string

  orderId: number
  ticketId: string
  employeeId: string
  userName: string
  baseCity: string
  isValid: number

  createTime: string
  updateTime: string
}
