import { OpenSSL } from '../../src/openssl'

describe('OpenSSL.test.ts', () => {
  it(`getDomainCertExpireTime`, async () => {
    console.info(OpenSSL.getDomainCertExpireTime('google.com'))
  })

  it(`checkKeyPairsMatch`, async () => {
    // console.info(OpenSSL.getCertificateSign(''))
    // console.info(OpenSSL.getPrivateKeySign(''))
  })
})
