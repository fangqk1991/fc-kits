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

export interface HLY_OrderFlight {
  orderId: string
  orderType: 'FLIGHT'
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
  productTypeId: 1
  orderStatus: string
  // 处理中;已取消;全部退票;部分退票;已成交;未出行;
  auditStatus: string // '授权通过'
  employeeId: string
  companyOID: string
  applicant: string
  users: string
  orderCreateDate: string // '2023-07-04 20:40:08'
  stringColumn1: string
  stringColumn2: string
  enableArtInvoice: boolean
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
  withReceipt: boolean
  ticket: boolean
  artInvoice: boolean
  lastModifiedDate: string // '2023-07-04 21:23:25'
}
