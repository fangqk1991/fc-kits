import * as assert from 'assert'
import { EncryptionBox, makeRandomStr } from '../src'

const keyData = {
  key1: makeRandomStr(30),
  key2: makeRandomStr(30),
  key3: makeRandomStr(30),
}

const encryptionBox = new EncryptionBox(makeRandomStr(30))
encryptionBox.addKeyData(keyData)

describe('Test EncryptionBox.test.ts', () => {
  it(`encrypt`, async () => {
    const plainText = `Hello+${makeRandomStr(8)}+中文+😄`
    const encryptedText = encryptionBox.encrypt(plainText)
    const decryptedText = encryptionBox.decrypt(encryptedText)
    console.info(`plainText: `, plainText)
    console.info(`encryptedText: `, encryptedText)
    console.info(`decryptedText: `, decryptedText)
    assert.ok(plainText === decryptedText)
  })

  it(`different keys`, async () => {
    const plainText = `Hello+${makeRandomStr(8)}+中文+😄`
    for (const keyId of Object.keys(keyData)) {
      const encryptedText = encryptionBox.encrypt(plainText, keyId)
      const decryptedText = encryptionBox.decrypt(encryptedText)
      console.info(`plainText: `, plainText)
      console.info(`encryptedText: `, encryptedText)
      console.info(`decryptedText: `, decryptedText)
      console.info(`==================================`)
      assert.ok(plainText === decryptedText)
    }
  })
})
