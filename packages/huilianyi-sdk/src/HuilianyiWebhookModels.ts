import { HuilianyiApiCode } from './HuilianyiApiCode'

export interface HuilianyiWebhookBody {
  apiCode: HuilianyiApiCode
  apiVersion: string
  // tenantId: number

  message: string
  nonce: string
  signature: string
  timestamp: string
  pushType: 'TENANT' | 'COMPANY'
}
