import { HuilianyiWebhookBody } from './webhook/HuilianyiWebhookModels'
import { HuilianyiSignatureBox } from './webhook/HuilianyiSignatureBox'
import { HuilianyiEncryptionBox } from './webhook/HuilianyiEncryptionBox'
import assert from '@fangcha/assert'
import { HuilianyiApiCode } from './core/HuilianyiApiCode'
import { HuilianyiEventHandlerBase } from './webhook/HuilianyiEventHandlerBase'

interface Options {
  tenantId: string
  encodingAesKey: string
  signatureToken: string
  webhookHandler?: (apiCode: HuilianyiApiCode) => HuilianyiEventHandlerBase
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

  public async handle(webhookBody: HuilianyiWebhookBody): Promise<{
    code: 'SUCCESS' | 'ERROR'
    message?: string
    body?: {}
  }> {
    try {
      const response = await this._handle(webhookBody)
      return {
        ...response,
        code: 'SUCCESS',
      }
    } catch (e: any) {
      return {
        code: 'ERROR',
        message: e.message,
      }
    }
  }

  private async _handle(webhookBody: HuilianyiWebhookBody) {
    const sign = this.signatureBox.calcSignature({
      content: webhookBody.message,
      nonce: webhookBody.nonce,
      timestamp: webhookBody.timestamp,
    })
    assert.ok(sign === webhookBody.signature, '验签失败')

    const decryptedData = this.encryptionBox.decryptToJSON(webhookBody.message)
    if (this.options.webhookHandler) {
      const handler = this.options.webhookHandler(webhookBody.apiCode)
      assert.ok(!!handler, `${webhookBody.apiCode} 处理器未定义`, 500)
      return await handler.onExecute(decryptedData)
    }
    return {
      message: '',
    }
  }
}
