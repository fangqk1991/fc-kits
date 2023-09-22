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
    ChangeTicketStatus?: string
    ChangeTicketStatusName?: string
    PayWay: string
    UserNamePinYin: string
  }
  PassengerInfoList: {
    PassengerID: number
    PassengerIDLong: number
    PassengerName: string
    TicketPassengerName: string
    EmployeeID: string
    CorpUserID: string

    OrderTicket: {
      TicketInfoID: number
      OrderTicketID: number
      EnableRefundTicket: boolean
      DealTicketServiceFee: 0
      TicketType: string // 'C'
      ChangeStatus: string // 'S'
      EnableChangeTicket: boolean
      LongTicketNo: string
      RefundChangeTime: string // '2023-08-11 21:37:56'
      AfterTakeTicketId: number
      AfterTakeTicketFee: number
      ChangePreApprovalId: string
      RefundTicketStatus: string // 'S': 退票成功
      Sequence: number
    }[]
  }[]
  TicketInfoList: {
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
    TrainTicketType: string // 车次类型: D 原车次, C 改签车次
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
  }[]
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
  PassengerInfo: {
    PassengerBasic: {
      CorpEid: string // 工号
      PassengerName: string
      PassengerNamePY: string
      NonEmployee: false
    }
    // SequenceInfo.length === FlightInfo.length
    SequenceInfo: {
      Sequence: 1
      TicketInfo: {
        AirLineCode: string
        TicketNo: string // xxx
        Status: string // '2'
        StatusDesc: string // '已使用'
      }[]
      ChangeInfo: {
        Sequence: number
        RebookId: number
        PassengerName: string
        CStatus: string // '改签成功'
        RebookingTime: string // '2023-07-18 18:52:49'
        RebookedTime: string // '2023-07-18 18:57:41'
        OriTicketNO: string
        PreTicketNO: string
        CTicketNO: string
        CAirline: string // 'CZ'
        CFlight: string // 'CZ3721'
        CTakeOffTime: string // '2023-07-19 07:40:00'
        CArrivalTime: string // '2023-07-19 09:35:00'
        CDCityName: string // '长沙'
        CDPortName: string // '黄花国际机场'
        CDTerminal: string // 'T2'
        CACityName: string // '西安'
        CAPortName: string // '咸阳国际机场'
        CATerminal: string // 'T3'
        RebookStatus: string // 'S'
        JounaryNo: ''
        CDPortCode: string // 'CSX'
        CAPortCode: string // 'XIY'
        CACityCode: string // 'SIA'
        CDCityCode: string // 'CSX'
        TaxDifferential: 0
        TakeOffTimeUTC: string // '2023-07-18T23:40:00Z'
        ArrivalTimeUTC: string // '2023-07-19T01:35:00Z'
        DepartureCountryCode: string // 'CN'
        ArrivalCountryCode: string // 'CN'
      }[]
    }[]
  }[]
  FlightInfo: {
    Flight: string // 'CZ3947'
    TakeoffTime: string // '2023-07-18 18:55:00'
    ArrivalTime: string // '2023-07-18 20:45:00'
    DCityName: string // '长沙'
    DCityName_EN: string // 'Changsha'
    DCityCode: string // 'CSX'
    DPortName: string // '黄花国际机场'
    DPortCode: string // 'CSX'
    ACityName: string // '西安'
    ACityName_EN: string // "Xi'an"
    ACityCode: string // 'SIA'
    APortName: string // '咸阳国际机场'
    APortCode: string // 'XIY'
    FlightTime: number // 110
    AirlineRecordNo: string // 'NVGG6R'
    DepartureCountryCode: string // 'CN'
    ArrivalCountryCode: string //'CN'
    TakeOffTimeUTC: string // '2023-07-18T10:55:00Z'
    ArrivalTimeUTC: string // '2023-07-18T12:45:00Z'
  }[]
  FlightChangeInfo: CTrip_FlightChangeInfoEntity[] | null
}

export interface CTripMixedOrder {
  FlightOrderInfoList: null | CTrip_FlightOrderInfoEntity[]
  HotelOrderInfoList: null | any[]
  TrainOrderInfoList: null | CTrip_TrainOrderInfoEntity[]
}
