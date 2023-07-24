import { HLY_CustomFormValue, HLY_StaffCoreDTO } from '../basic/HLY_CoreModels'
import { HLY_PublicApplicationStatus } from './HLY_PublicApplicationStatus'

export interface HLY_PublicApplicationDTO {
  applicant: HLY_StaffCoreDTO
  applicationOID: string
  businessCode: string
  closed: boolean
  companyCode: string
  companyOID: string
  createdBy: string
  createdDate: string // '2023-06-01T10:19:37Z'
  currencyCode: string // 'CNY'
  custFormValues: HLY_CustomFormValue[]
  formCode: string
  formName: string // '对公申请单'
  jobId: string
  originCurrencyCode: string // 'CNY'
  originCurrencyTotalAmount: number
  participantClosed: boolean
  status: HLY_PublicApplicationStatus
  title: string
  totalAmount: number
  version: number
}
