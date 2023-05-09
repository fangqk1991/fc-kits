import * as crypto from 'crypto'
import * as assert from 'assert'

interface KeyBufferMapper {
  [keyId: string]: Buffer
}

type KeyDataLoader = () => Promise<{ [keyId: string]: string }>

export class EncryptionBox {
  private readonly _keyMapper: KeyBufferMapper
  private _loader?: KeyDataLoader

  constructor(defaultKey?: string) {
    this._keyMapper = {}
    if (defaultKey) {
      this._keyMapper['_default'] = Buffer.from(crypto.createHash('md5').update(defaultKey).digest('hex'))
    }
  }

  public setKeyDataLoader(loader: KeyDataLoader) {
    this._loader = loader
  }

  public async reloadKeyData() {
    if (this._loader) {
      const keyData = await this._loader()
      this.addKeyData(keyData)
    }
  }

  public addKeyData(keyData: { [keyId: string]: string }) {
    for (const keyId of Object.keys(keyData)) {
      const keyText = keyData[keyId]
      this._keyMapper[keyId] = Buffer.from(crypto.createHash('md5').update(keyText).digest('hex'))
    }
  }

  public encrypt(plainText: string, keyId: string = '_default') {
    const keyBuffer = this._keyMapper[keyId]
    assert.ok(!!keyBuffer, `key missing error. keyId = ${keyId}`)

    const ivBuffer = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer)
    return [
      Buffer.from(keyId).toString('base64'),
      ivBuffer.toString('base64'),
      Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]).toString('base64'),
    ].join('.')
  }

  public decrypt(encryptedText: string) {
    const items = encryptedText.split('.')
    assert.ok(items.length === 3, `encryptedText's format error.`)

    const keyId = Buffer.from(items[0], 'base64').toString('utf8')
    const ivBuffer = Buffer.from(items[1], 'base64')
    const contentBase64 = items[2]

    const keyBuffer = this._keyMapper[keyId]
    assert.ok(!!keyBuffer, `key missing error. keyId = ${keyId}`)

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer)
    const decrypted = Buffer.concat([decipher.update(contentBase64, 'base64'), decipher.final()])
    return decrypted.toString()
  }
}
