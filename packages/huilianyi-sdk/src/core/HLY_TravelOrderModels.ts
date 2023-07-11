export interface HLY_OrderFlightCoreInfo {
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

  passengerInfo: {
    CorpEid: string
    PassengerName: string
  }

  // amount: number
  // price: number
  // printPrice: number
  // priceRate: number
  // oilFee: number
  // tax: number
  // seatClass: string
  // startAirport: string
  // endAirport: string
  // serverFee: number
  // passenger: string
  // ticketNo: string
  // sequence: number
  // ticketStatus: string // '1'
  // finalStatus: string // '1'
  // airlineCode: string // 'JD'
  // agreement: string // '非协议'
  // bindNum: number
  // bindAmount: number
  // subsidy: number
  // subClass: string // 'U'
  // nonRer: string // '有条件改期'
  // rerNotes: string
  // nonRef: string // '有条件退票'
  // refNotes: string
  // nonEnd: string
  // endNotes: string
  // isOpenTran: string // 'F'
  // isSurface: string // 'F'
  // reasonDesc: string
  // lowestPrice: number
  // lowRate: number
  // distance: number
  // standardPrice: number
}

export interface HLY_OrderBase {
  orderId: string
  orderType: 'TRAIN' | 'FLIGHT' | 'HOTEL'
  amountRMB: number
  payType: string
  // CCARD:信用卡支付;
  // CHECK:支票支付;
  // UNPAY:银联在线支付;
  // ACCNT:公司账户支付;
  // PCARD:手机支付;
  // TMPAY:礼品卡支付;
  // CASH:现金支付;
  // APPAY:AirPlus支付
  productTypeId: number // 1
  orderStatus: string
  // 机票: 处理中;已取消;全部退票;部分退票;已成交;未出行;
  // 火车票: 已取消;待出票;已购票;出票失败
  auditStatus: string // '授权通过'
  employeeId: string
  companyOID: string
  applicant: string
  users: string
  journeyNo?: string
  orderCreateDate: string // '2023-07-04 20:40:08'
  // stringColumn1: string
  // stringColumn2: string
  enableArtInvoice: boolean

  withReceipt: boolean
  ticket: boolean
  artInvoice: boolean
  lastModifiedDate: string // '2023-07-04 21:23:25'
}

export interface HLY_OrderTrainCoreInfo {
  trainOrderOID: string
  trainName: string

  startDate: string // '2023-07-04 23:25:00'
  endDate: string // '2023-07-05 01:40:00'

  departureCityName: string // "上海",
  departureStationName: string // "上海虹桥",
  arrivalCityName: string // "台州",
  arrivalStationName: string // "台州西",
  arriveStopType: number // 0,
  firstSeatTypeId: number // 0,
  firstSeatTypeName: string // "一等座",
  ticketPrice: number // 327,
  trainTypeId: number // 0,
  electronicOrderNo: string
  serviceFee: number // 4,
  customType: number // 0,
  deliverFee: number // 0,
  paperTicketFee: number // 0,
  trainTicketType: string // "一等座",
  changeServiceFee: number // 4
}

export interface HLY_OrderFlight extends HLY_OrderBase {
  flightOrderInfo: {
    flightOrderInfoOID: string
    travelMoney: number
    changeAmount: number
    refundAmount: number
    cCardPayFee: number
    sendTicketFee: number
    insuranceFee: number
    finishDate: string // '2023-07-04 20:43:31'
    printTicketTime: string // '2023-07-04 20:43:32'
    preBookDays: number
    totalServiceFee: number
    costCenter: string
    costCenter2: string
    deliveryInfo: string // JSON string
  }
  flightOrderDetails: HLY_OrderFlightCoreInfo[]
}

export interface HLY_OrderTrain extends HLY_OrderBase {
  trainOrderDetails: HLY_OrderTrainCoreInfo[]
}

export interface HLY_OrderHotelClientInfo {
  ClientName: string // 旅客姓名
  EmployeeID: string // 员工号
  CostCenter1: string
  CostCenter2: string
  Dept1: string
  Dept3: string
  Dept4: string
}

export interface HLY_OrderHotelRoomInfo {
  RoomName: string
  BedType: string
  ETA: string // 入住时间 '2023-07-11 00:00:00'
  ETD: string // 离店时间 '2023-07-12 00:00:00'
  Price: number
  Currency: string
}

export interface HLY_OrderHotelCoreInfo {
  hotelOrderOID: string
  hotelName: string

  startDate: string // '2023-07-04 23:25:00'
  endDate: string // '2023-07-05 01:40:00'

  cityName: string
  roomName: string
  roomCount: number
  roomDays: number

  clientInfo: HLY_OrderHotelClientInfo[]
  roomInfo: HLY_OrderHotelRoomInfo[]
}

export interface HLY_OrderHotel extends HLY_OrderBase {
  hotelOrderDetail: HLY_OrderHotelCoreInfo
}
