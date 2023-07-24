import * as assert from 'assert'
import { DiffMapper, makeRandomStr } from '@fangcha/tools/lib'
import { HuilianyiEncryptionBox } from '../../src/webhook/HuilianyiEncryptionBox'

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

  it(`encryptFromJSON & decryptToJSON`, async () => {
    const rawBodyData = {
      a: makeRandomStr(16),
      b: Math.random(),
    }
    const encryptionBox = new HuilianyiEncryptionBox(aesKey)
    const encryptedText = encryptionBox.encryptFromJSON(rawBodyData)
    const decryptedBodyData = encryptionBox.decryptToJSON(encryptedText)
    assert.ok(DiffMapper.checkEquals(rawBodyData, decryptedBodyData))
  })
})
