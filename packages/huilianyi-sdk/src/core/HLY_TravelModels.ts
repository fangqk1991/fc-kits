import { HLY_StaffCoreDTO } from './HLY_CoreModels'
import { HLY_CustomFormItem } from './HLY_CustomFormModels'
import { HLY_TravelStatus } from './HLY_TravelStatus'

export interface HLY_Travel {
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
  travelApplication: {
    applicationOID: '487f4391-90da-4189-af76-4925604f2c45'
    baseCurrencyAmount: 0
    bookingClerkOID: 'd6ed60d5-5d8f-4712-b913-acca3d3ef420'
    businessCode: 'TA00988382'
    carManageType: 1002
    carUniformBooking: false
    companyCurrencyRate: 1
    currencyCode: 'CNY'
    departmentOID: '3354c2f7-058b-4ef2-a9be-0090677d9475'
    diningBookingClerkOID: 'd6ed60d5-5d8f-4712-b913-acca3d3ef420'
    diningUniformBooking: true
    emergencyFlyback: false
    enableItineraryHead: true
    endDate: '2023-06-16T15:59:00Z'
    externalParticipantNumber: 0
    hotelBookingClerkOID: 'd6ed60d5-5d8f-4712-b913-acca3d3ef420'
    hotelManageType: 1002
    hotelUniformBooking: true
    itineraryMap: {
      REMARK: []
    }
    itineraryTypes: '1005'
    manageType: 1002
    participantNum: 1
    startDate: '2023-06-15T16:00:00Z'
    subCompanyOID: '34de59ca-36c8-4884-adaa-54981cc6f9d7'
    totalBudget: 0
    totalSubsidiesBudget: 0
    trainManageType: 1002
    trainUniformBooking: true
    travelDays: 1
    travelItinerarys: []
    uniformBooking: true
    uniformReimbursement: false
    userRankMap: {}
  }
  travelOperationRecords: []
  travelOrders: []
  version: number
  warningList: string
  withApportionment: boolean
  withdrawFlag: string // 'Y'
}
