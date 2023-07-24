import { makeRandomStr } from '@fangcha/tools/lib'
import { HuilianyiSignatureBox } from '../../src/webhook/HuilianyiSignatureBox'

describe('Test HuilianyiSignatureBox.test.ts', () => {
  it(`calcSignature`, async () => {
    const signatureBox = new HuilianyiSignatureBox('AAA')
    const signature = signatureBox.calcSignature({
      timestamp: Date.now(),
      nonce: makeRandomStr(16),
      content: 'AAAA',
    })
    console.info(signature)
  })
})
