export type CTripResponseDTO<T = any> = {
  Status: {
    Success: boolean
    ErrorCode: number
    Message: string
  }
} & T

export interface CTripSimpleOrder {
  OrderId: number
  OrderType: number
}

export interface CTripDatetimeRange {
  from: string
  to: string
}

export interface CTrip_TrainOrderInfoEntity {
  BasicInfo: {
    OrderID: string
    EmployeeID: string
    OrderAmount: number
    DealAmount: number
    TotalQuantity: number
    Remark: string
    OrderTicketType: number // 0
    OrderTicketTypeDesc: string // '普通票'
    // OrderStatus: 'C'
    // OrderType: 'E'
    ContactName: string
    ContactMobile: string
    ContactEmail: string
    UID: string
    UserName: string
    DataChange_CreateTime: string // '2023-07-16 08:48:21'
    DeliverFee: 0
    PaperTicketFee: 0
    AccountName: string
    ConfirmPerson: 'AUTOPASS_APPROVER'
    ConfirmPersonCC: null
    ConfirmType: 'A1;C0'
    ConfirmType2: null
    AuditResult: 'T'
    AuditResultDesc: string // '授权通过'
    OrderStatusName: string // '已取消'
    DockingVendorPlatformAccount: string
    CorpDockingInfoList: null
    TripType: ''
    NewOrderStatus: string // 'C'
    NewOrderStatusName: string // '已取消'
    PayWay: string
    UserNamePinYin: string
  }
  PassengerInfoList: [
    {
      PassengerID: number
      PassengerIDLong: number
      PassengerName: string
      TicketPassengerName: string
      EmployeeID: string
      CorpUserID: string
    }
  ]
  TicketInfoList: [
    {
      TicketInfoID: number
      TrainID: number
      TrainName: string
      TicketID: number
      DepartureCityID: number
      DepartureCityName: string
      DepartureDateTime: string // '2023-07-16 09:15:00'
      DepartureStationName: string
      DepartureStationEn: string
      ArrivalCityID: number
      ArrivalCityName: string
      ArrivalStationName: string
      ArrivalStationEn: string
      ArrivalDateTime: string
      ArriveStopType: number
      FirstSeatTypeID: number
      FirstSeatTypeName: string
      TicketPrice: number
      TrainTypeID: number
      ElectronicOrderNo: string
      ServiceFee: number
      CustomType: number
      CustomDetail: string
      DeliverFee: number
      PaperTicketFee: number
      TrainTicketType: string
      ChangeServiceFee: number
      GrabServiceFee: number
      ChangeStatus: null
      AccpetTrainName: string // 'G123,G234'
      AcceptSeatName: string // '无座'
      AcceptDepartureDate: string // '2023-07-16'
      GrabCutOffTime: string // '2023-07-16 11:20:00'
      LowestTicketPrice: 226
      GrabServiceFeeType: string // 'HIGH'
      RcCodeID: null
      RcCodeName: null
      TicketEntrance: null
      DealID: string
      ChangeCode: null
      PurchaseFee: number
      TicketSupplierType: number
      TrainSeatPriceData: {
        TrainList: {
          TrainName: string
          UseTime: number
          SeatList: {
            ID: number
            Name: string // '无座'
            Price: number
          }[]
        }[]
      }
      PaymentTypeList: string[]
      AfterTakeTicketFee: number
      DepartureProvinceId: number
      DepartureProvinceName: string
      DepartureLocationId: number
      DepartureLocationName: string
      DepartureLocationCategoryId: number
      ArrivalProvinceId: number
      ArrivalProvinceName: string
      ArrivalLocationId: number
      ArrivalLocationName: string
      ArrivalLocationCategoryId: number
      Sequence: number
      DepartureDistrictCode: string
      ArrivalDistrictCode: string
      DealTicketPrice: null
    }
  ]
  CorpOrderInfo: {
    JourneyID: string
  }
  TicketDeliveryInfo: {
    OrderID: string
  }
}

export interface CTripMixedOrder {
  FlightOrderInfoList: null | any[]
  HotelOrderInfoList: null | any[]
  TrainOrderInfoList: null | CTrip_TrainOrderInfoEntity[]
}
