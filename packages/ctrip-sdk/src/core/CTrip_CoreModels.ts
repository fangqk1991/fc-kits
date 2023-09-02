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

export interface CTrip_FlightChangeInfoEntity {
  ChangeOrderId: number
  FlightChangeType: number // 0:航班变化;1:航班取消;2:待定延误;5:取消恢复
  FlightClass: string
  Sequence: number
  ChangeStatus: string // 'S'
  AfterStatus: string // ''
  OrderStatus: string // 'S'
  Passengers: string
  OriginFlight: string // 航班号
  OriginDdate: string // '2023-07-05 20:10:00'
  OriginAdate: string // '2023-07-05 22:40:00'
  OriginDPort: string // 'SHA'
  OriginAPort: string // 'ZUH'
  OriginDBuilding: string // 'T2'
  OriginABuilding: string // ''
  OriginClass: string
  OriginClassDesc: string
  OriginSubClass: string
  OriginCraftType: string
  ProtectFlight: string // 航班号（变更后的）
  ProtectDdate: string // '2023-07-05 22:55:00' （变更后的）
  ProtectAdate: string // '2023-07-06 01:25:00'（变更后的）
  ProtectDPort: string // 'SHA'（变更后的）
  ProtectAPort: string // 'ZUH'（变更后的）
  ProtectDBuilding: string // 'T2'（变更后的）
  ProtectABuilding: string // ''（变更后的）
  ProtectClass: string
  ProtectClassDesc: string
  ProtectSubClass: string
  ProtectCraftType: string
  SmsStatus: string
  ChangeRange: string
  RRStatus: string
  SingleTalk: string
  RebookSingleTalk: string
  CanRefundAll: string
  CanFreeRebook: string
  RebookFlightDateFrom: string // '0001-01-01 00:00:00'
  RebookFlightDateTo: string // '0001-01-01 00:00:00'
  Flight: string // 航班号
  Ddate: string // '2023-07-05 22:55:00'
  Adate: string // '2023-07-06 01:25:00'
  DPort: string // 'SHA'
  APort: string // 'ZUH'
  DBuilding: string // 'T2'
  ABuilding: string // ''
  Class: string
  ClassDesc: string
  SubClass: string
  CraftType: string
  PassengerItems: {
    Passenger: string
    Sequence: number
    TicketNo: string
    AfterStatus: string // ''
    OrderStatus: string // 'S'
    ChangeCount: number
    RRStatus: string // 'A'
    FormingFlight: {
      Flight: string // 航班号
      SubClass: string // 'G'
      RecordNo: string // ''
      TicketNo: string // ''
      DPort: string // 'SHA'
      DTime: string // '2023-07-05 22:55:00'
      DBuilding: string // 'T2'
      APort: string // 'ZUH'
      ATime: string // '2023-07-06 01:25:00'
      ABuilding: string // ''
    }
    RebookRuleCheckResult: {
      CanFreeRebook: string // 'F'
      IsSingleTalk: string // 'F'
      RebookFlightDateFrom: string // '0001-01-01 08:00:00'
      RebookFlightDateTo: string // '0001-01-01 08:00:00'
    }
    RefundRuleCheckResult: {
      CanRefundAll: string // 'F'
      IsSingleTalk: string // 'F'
    }
  }[]
  CreateTime: string // '2023-07-05 14:27:18'
  OriginDepartureDistrictCode: string // '310000'
  OriginArrivalDistrictCode: string // '440400'
  ProtectDepartureDistrictCode: string // '310000'
  ProtectArrivalDistrictCode: string // '440400'
}

export interface CTrip_FlightOrderInfoEntity {
  BasicInfo: {
    OrderID: string
    TripID: string
    OrderStatus: string // '已成交'
    OrderStatusCode: string // 'S'
    UID: string
    PreEmployName: string
    EmployeeID: string
    AccountID: number
    SubAccountID: number
    CorpPayType: string
    CreateTime: string // '2023-07-13 15:07:23'
    FinishDate: string // '2023-07-13 15:07:53'
    PrintTicketTime: string // '2023-07-13 15:07:54'
    FlightClass: string // 'N'
    FlightWay: string // '单程'
    JourneyID: string
    AuditStatus: string // '授权通过'
  }
  FlightChangeInfo: CTrip_FlightChangeInfoEntity[] | null
}

export interface CTripMixedOrder {
  FlightOrderInfoList: null | CTrip_FlightOrderInfoEntity[]
  HotelOrderInfoList: null | any[]
  TrainOrderInfoList: null | CTrip_TrainOrderInfoEntity[]
}
