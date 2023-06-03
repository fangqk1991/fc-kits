import { HuilianyiEncryptionBox } from '../../src/HuilianyiEncryptionBox'
import * as assert from 'assert'
import { makeRandomStr } from '@fangcha/tools/lib'

describe('Test HuilianyiEncryptionBox.test.ts', () => {
  const aesKey = makeRandomStr(43)

  it(`extractTenantId`, async () => {
    const rawText = 'hahaha'
    const tenantId = 'TTTTTT'
    const encryptionBox = new HuilianyiEncryptionBox(aesKey, tenantId)
    const encryptedText = encryptionBox.encrypt(rawText)
    assert.ok(tenantId === encryptionBox.extractTenantId(encryptedText))
  })

  it(`encrypt & decrypt`, async () => {
    const rawText = 'hahaha'
    const encryptionBox = new HuilianyiEncryptionBox(aesKey)
    const encryptedText = encryptionBox.encrypt(rawText)
    const decryptedText = encryptionBox.decrypt(encryptedText)
    assert.ok(rawText === decryptedText)
  })
})
