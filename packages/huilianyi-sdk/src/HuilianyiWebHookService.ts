import { HuilianyiWebhookBody } from './HuilianyiWebhookModels'
import { HuilianyiSignatureBox } from './HuilianyiSignatureBox'
import { HuilianyiEncryptionBox } from './HuilianyiEncryptionBox'
import assert from '@fangcha/assert'
import { HuilianyiApiCode } from './HuilianyiApiCode'

export type HuilianyiWebhookHandler = (apiCode: HuilianyiApiCode, data: any) => Promise<any>

interface Options {
  tenantId: string
  encodingAesKey: string
  signatureToken: string
  webhookHandler?: HuilianyiWebhookHandler
}

export class HuilianyiWebHookService {
  private readonly options: Options
  private readonly signatureBox: HuilianyiSignatureBox
  private readonly encryptionBox: HuilianyiEncryptionBox

  constructor(options: Options) {
    this.options = options
    this.signatureBox = new HuilianyiSignatureBox(options.signatureToken)
    this.encryptionBox = new HuilianyiEncryptionBox(options.encodingAesKey, options.tenantId)
  }

  public async handle(webhookBody: HuilianyiWebhookBody) {
    const sign = this.signatureBox.calcSignature({
      content: webhookBody.message,
      nonce: webhookBody.nonce,
      timestamp: webhookBody.timestamp,
    })
    assert.ok(sign === webhookBody.signature, '验签失败')

    const decryptedData = this.encryptionBox.decryptToJSON(webhookBody.message)
    if (this.options.webhookHandler) {
      return this.options.webhookHandler(webhookBody.apiCode, decryptedData)
    }
    return {
      code: 'SUCCESS',
      message: '',
    }
  }
}
