import { HuilianyiWebhookBody } from './HuilianyiWebhookModels'
import { HuilianyiSignatureBox } from './HuilianyiSignatureBox'
import { HuilianyiEncryptionBox } from './HuilianyiEncryptionBox'
import assert from '@fangcha/assert'
import { HuilianyiApiCode } from './HuilianyiApiCode'
import { HuilianyiEventHandlerBase } from './HuilianyiEventHandlerBase'

export type HuilianyiWebhookHandler = (apiCode: HuilianyiApiCode, data: any) => HuilianyiEventHandlerBase

interface Options {
  tenantId: string
  encodingAesKey: string
  signatureToken: string
  webhookHandler?: HuilianyiWebhookHandler
}

export class HuilianyiWebHookService {
  private readonly options: Options
  public readonly signatureBox: HuilianyiSignatureBox
  public readonly encryptionBox: HuilianyiEncryptionBox

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
      const handler = this.options.webhookHandler(webhookBody.apiCode, decryptedData)
      return await handler.onExecute(decryptedData)
    }
    return ''
  }
}
