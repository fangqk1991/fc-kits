export interface HuilianyiWebhookBody {
  apiCode: string
  apiVersion: string
  // tenantId: number

  message: string
  nonce: string
  signature: string
  timestamp: string
  pushType: 'TENANT' | 'COMPANY'
}
