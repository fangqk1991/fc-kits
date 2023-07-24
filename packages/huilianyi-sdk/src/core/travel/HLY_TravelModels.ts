import { HLY_StaffCoreDTO } from '../basic/HLY_CoreModels'
import { HLY_CustomFormItem } from '../basic/HLY_CustomFormModels'
import { HLY_TravelStatus } from './HLY_TravelStatus'
import { HLY_OrderFlight, HLY_OrderFlightCoreInfo, HLY_OrderTrainTicketInfo } from './HLY_TravelOrderModels'

export interface ItineraryFlight extends HLY_OrderFlight {
  flightItineraryOID: string
  applicationOID: string
  fromCity: string
  fromCityCode: string
  toCity: string
  toCityCode: string
  itineraryType: number // 行程类型：1001 单程 1002 往返（可为空，行程级管控时必填）
  itineraryDirection: number // 行程方向 往返有效 1001 去程 1002 返程 单程为空
  startDate: string
  endDate: string
  remark: string
  createdDate: string
  lastModifiedDate: string
  ticketPrice: number | null
  seatClass: string // 舱等，经济舱/超级经济舱/公务舱/头等舱
  disabled: boolean
  isExtend: boolean
}

export interface ItineraryTrain {
  trainItineraryOID: string
  applicationOID: string
  fromCity: string
  fromCityCode: string
  toCity: string
  toCityCode: string
  startDate: string
  endDate: string
  remark: string
  createdDate: string
  lastModifiedDate: string
  ticketPrice: number | null
  seatClass: string // 舱等、火车座席
  disabled: boolean
  isExtend: boolean
  trainOrderInfoList: HLY_OrderTrainTicketInfo[]
}

export interface ItineraryHotel {
  hotelItineraryOID: string
  applicationOID: string
  city: string
  cityCode: string
  fromDate: string
  leaveDate: string
  roomNumber: number
  remark: string
  createdDate: string
  lastModifiedDate: string
  maxPrice: number | null
  minPrice: number | null
  seatClass: string // 舱等、火车座席
  disabled: boolean
  isExtend: boolean
}

export interface ItineraryOther {
  otherItineraryOID: string
  applicationOID: string
  itineraryType: number // 行程类型：1001 单程 1002 往返（可为空，行程级管控时必填）
  trafficType: number // 交通类型: 1001 轮船、1002 汽车、1003 其他
  trafficTypeName: string // 交通类型名称，当交通类型为其他时可以自行设置

  fromCity: string
  fromCityCode: string
  toCity: string
  toCityCode: string

  startDate: string
  endDate: string

  remark: string

  createdDate: string
  lastModifiedDate: string
  disabled: boolean
  isExtend: boolean
}

export interface ItineraryRemark {
  itineraryRemarkOID: string
  applicationOID: string

  remarkDate: string
  remark: string

  createdDate: string
  lastModifiedDate: string
  itineraryDetails: {}
  itineraryShowDetails: []
}

export interface TravelSubsidiesRequestItemDetailDTO {
  travelSubsidiesDetailsOID: string
  applicationOID: string
  expenseTypeOID: string
  expenseTypeName: string // '差旅-出差补助'
  userOID: string
  userName: string
  amount: number
  currencyCode: string // 'CNY'
  baseCurrencyAmount: number
  status: number // 1001
  subsidiesDate: string // '2023-07-23T16:00:00Z'
  currencyRate: number
  baseCurrencyRate: number
  comment: null
  baseAmount: number
  lastModifiedDate: string // '2023-07-05T13:10:26Z'
  deleted: boolean
  areaCode: string // 'CHN011000000'
  cityName: string // '北京'
  cityPath: string // ''
  travelSubsidiesRequestID: string
  isDuplicateSubsidies: null
  amountType: number
  ruleCurrencyCode: string // 'CNY'
  ruleAmount: number
}

export interface ItineraryBudgetDTO {
  itineraryHeadId: string
  applicationCustomBudgetId: string
  expenseBudgetOID: string
  expenseTypeId: string
  expenseTypeOID: string
  expenseTypeName: string // '差旅-出差补助'
  expenseTypeCode: string
  expenseTypeIconName: string
  expenseTypeIconURL: string
  itineraryFormType: null
  itineraryType: number // 1006
  itineraryRoundType: null
  itineraryDirection: null
  productType: null
  isInternational: null
  itineraryOID: string
  widgetMessageKey: null
  budgetFormOID: string
  applicationOID: string
  supplierOID: null
  supplierName: null
  supplierServiceName: null
  supplierConfig: null
  supplierIconUrl: null
  amount: number
  currencyCode: string // 'CNY'
  baseCurrencyCode: null
  paymentType: number // 1001
  baseCurrencyAmount: number
  companyCurrencyRate: number
  actualCurrencyRate: null
  withApportion: boolean
  withBudget: boolean
  travelStandardAmount: number
  budgetCurrencyCode: string // 'CNY'
  travelRuleMatchedResult: null
  apportionmentDTOList: null
  expenseBudgetCustomValueDTOs: any[]
  regulationId: null
  regulationName: null
  approvalType: null
  carPickUpType: null
  carPickUpTypeDescription: null
  travelCarItineraryTrips: null
  diningSceneId: null
  diningSceneDTO: null
  isExtend: boolean
  disabled: boolean
  deleted: boolean
  remark: null
  customCombinationValue: null
  approvalNumber: null
  bookedStatus: null
  expiredDate: null
  isMultiSupplier: boolean
  unitPrice: null
  quantity: null
  businessType: null
  travelSubsidiesRequestItemDetailDTOs: TravelSubsidiesRequestItemDetailDTO[]
  travelSubsidiesRequestItemDTOs: []
  ctripOrders: null
  flightOrderDetails: HLY_OrderFlightCoreInfo[]
  travelHotelOrderInfoDTOs: null
  trainOrderInfoList: HLY_OrderTrainTicketInfo[]
  carOrders: null
  labelList: null
  orderList: []
  travelRecommendResult: null
  exceedingReason: null
  averageBaseCurrencyAmount: null
  averageCurrencyAmount: null
  userCount: null
  vendorInfoId: null
  contractExpenseId: null
}

export interface ItineraryHeadDTO {
  itineraryHeadId: string // Long	行程头id
  applicationOID: string //	申请单OID
  startDate: string //	开始时间
  endDate: string //	结束时间
  fromCityName: string //	出发地
  fromCityCode: string //	出发地 code
  toCityName: string //	目的地
  toCityCode: string //	目的地 code
  remark: string //	备注
  itineraryDirection: number //	往返类型 1001表示去程，1002表示返程； 单程为空	2021-09-16
  refItineraryHeadId: string //	对应的 去程/返程 行程头id	2021-09-16
  travelSubsidiesCustList: any[] // List(#TravelSubsidiesCustList)	差补行程值列表	2021-10-26
  itineraryBudgetDTOList: ItineraryBudgetDTO[] // (#ItineraryBudgetDTO)	行程预算
  customFormvalues: any[] //(#ItineraryHeadFormValue)	行程头表单自定义值	2022-05-26
}

export interface ItinerarySubsidies {}

export interface ItineraryMap {
  FLIGHT?: ItineraryFlight[]
  TRAIN?: ItineraryTrain[]
  HOTEL?: ItineraryHotel[]
  OTHER?: ItineraryOther[]
  REMARK?: ItineraryRemark[]
  SUBSIDIES?: ItinerarySubsidies[]
}

export interface TravelApplication {
  businessCode: string

  applicationOID: string
  baseCurrencyAmount: number
  bookingClerkOID: string
  carManageType: 1002
  carUniformBooking: false
  companyCurrencyRate: number // 1
  currencyCode: string // 'CNY'
  departmentOID: string
  diningBookingClerkOID: string
  diningUniformBooking: boolean
  emergencyFlyback: boolean
  enableItineraryHead: boolean
  endDate: string // '2023-06-16T15:59:00Z'
  externalParticipantNumber: number
  hotelBookingClerkOID: string
  hotelManageType: 1002
  hotelUniformBooking: true

  itineraryHeadDTOs?: ItineraryHeadDTO[]

  itineraryMap: ItineraryMap
  itineraryTypes: '1005'
  manageType: 1002
  participantNum: number
  startDate: string // '2023-06-15T16:00:00Z'
  subCompanyOID: string
  totalBudget: number
  totalSubsidiesBudget: number
  trainManageType: number
  trainUniformBooking: boolean
  travelDays: number
  travelItinerarys: []
  uniformBooking: boolean
  uniformReimbursement: boolean
  userRankMap: {}
}

export interface ReferenceEntityDTO {
  entityType: number //	Integer	单据实体类型枚举
  entityOID: string //	UUID	单据oid
  businessCode: string //	String	单据编号
  formOID: string //	UUID	表单OID
  formTypeId: string //	Integer	表单类型id
  formName: string //	String	表单名称
}

export interface HLY_TravelModel {
  applicationId: string
  businessCode: string
  applicationOID: string

  applicantOID: string
  applicant: HLY_StaffCoreDTO

  companyOID: string
  departmentOID: string
  corporationOID: string

  formCode: string
  formType: number // 2001
  formOID: string
  formName: string

  type: number // 1002
  status: HLY_TravelStatus // 1002
  title: string
  submittedBy: string
  submittedDate: string // '2023-06-16T08:40:14Z'

  createdBy: string
  createdDate: string // '2023-06-16T08:40:07Z'

  /**
   * @deprecated
   */
  applicationParticipants?: []
  simpleApplicationParticipants: HLY_StaffCoreDTO[]
  budgetCheckMessage: string
  budgetClosed: number // ? 1000
  budgetLabelCode: string // 'BUD_000'
  client: string
  closeEnabled: boolean
  closed: boolean
  companyCode: string
  companyPaymentAmount: number // 0
  createdUser: HLY_StaffCoreDTO
  currencyCode: string // 'CNY'
  custFormValues: HLY_CustomFormItem[]
  departmentName: string
  docCompanyOID: string
  duplicate: boolean
  enableCustomBudget: boolean
  enablePublicShop: boolean
  entityOID: string
  entityOwner: string
  entityType: string // 'APPLICATION'
  externalParticipantDTOs: any[]
  filterFlag: boolean
  forceOccupyFlag: boolean
  ignoreBudget: boolean
  ignoreBudgetWarningFlag: boolean
  ignoreWarnCheck: boolean
  isGrayDisplay: boolean
  isSubmit: boolean
  jobId: string
  lastModifiedDate: string // '2023-06-16T08:41:16Z'
  lastRejectType: number // 1000
  loanableAmount: number
  originCurrencyCode: string // 'CNY'
  originCurrencyTotalAmount: number
  overBudget: boolean
  participantClosed: boolean
  passFlag: boolean
  personalPaymentAmount: number
  quotaCurrencyCode: string
  quotaStatus: number // 1001
  reimbursed: boolean
  rejectType: number // 1000
  remark: string
  setOfBooksId: string
  showAmount: boolean
  showDeliverButton: boolean
  subCompanyOID: string
  supportBudget: boolean
  tenantId: string
  timeZoneOffset: number // 480
  totalAmount: number
  totalBudget: number
  travelApplication: TravelApplication
  travelOperationRecords: []
  travelOrders: []
  version: number
  warningList: string
  withApportionment: boolean
  withdrawFlag: string // 'Y'

  referenceExpenseReports: ReferenceEntityDTO[]
}

export interface HLY_TravelParticipant {
  avatar: string
  fullName: string
  participantOID: string
  userOID: string
}
