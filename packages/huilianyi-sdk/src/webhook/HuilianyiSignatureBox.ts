import * as crypto from 'crypto'

export interface SignatureParams {
  timestamp: string | number
  nonce: string
  content: string
}

export class HuilianyiSignatureBox {
  private readonly token: string

  constructor(token: string) {
    this.token = token
  }

  public calcSignature(params: SignatureParams) {
    const strList = [this.token, `${params.timestamp}`, params.nonce, params.content]
    strList.sort()
    return crypto.createHash('sha1').update(strList.join('')).digest('hex')
  }
}
