import * as crypto from 'crypto'
import { makeRandomStr } from '@fangcha/tools'

export class HuilianyiEncryptionBox {
  private readonly aesKeyBuffer: Buffer
  private readonly ivBuffer: Buffer
  private readonly suffix: string

  constructor(encodingAesKey: string, suffix: string = '') {
    this.aesKeyBuffer = Buffer.from(`${encodingAesKey}=`, 'base64')
    this.ivBuffer = this.aesKeyBuffer.subarray(0, 16)
    this.suffix = suffix
  }

  public encrypt(plainText: string) {
    const nonce = makeRandomStr(16)
    const length = plainText.length

    const lengthBuff = Buffer.alloc(4)
    lengthBuff.writeUInt32BE(length)
    const rawBuffer = Buffer.concat([Buffer.from(nonce), lengthBuff, Buffer.from(plainText), Buffer.from(this.suffix)])
    const cipher = crypto.createCipheriv('aes-256-cbc', this.aesKeyBuffer, this.ivBuffer)
    return Buffer.concat([cipher.update(rawBuffer), cipher.final()]).toString('base64')
  }

  public encryptFromJSON(data: {}) {
    return this.encrypt(JSON.stringify(data))
  }

  public extractTenantId(encryptedText: string) {
    const { tenantId } = this._decrypt(encryptedText)
    return tenantId
  }

  public decrypt(encryptedText: string) {
    const { bodyText } = this._decrypt(encryptedText)
    return bodyText
  }

  public decryptToJSON(encryptedText: string) {
    return JSON.parse(this.decrypt(encryptedText))
  }

  private _decrypt(encryptedText: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKeyBuffer, this.ivBuffer)
    const decryptedBuffer = Buffer.concat([decipher.update(encryptedText, 'base64'), decipher.final()])
    const length = decryptedBuffer.subarray(16, 20).readUInt32BE()
    const decryptedText = decryptedBuffer.subarray(20, 20 + length).toString()
    return {
      tenantId: decryptedBuffer.subarray(20 + length).toString(),
      bodyText: decryptedText,
    }
  }
}
