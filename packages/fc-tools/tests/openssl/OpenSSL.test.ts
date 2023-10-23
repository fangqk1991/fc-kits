import { OpenSSL } from '../../src/openssl/OpenSSL'

describe('OpenSSL.test.ts', () => {
  it(`getDomainCertExpireTime`, async () => {
    console.info(OpenSSL.getDomainCertExpireTime('google.com'))
  })
})
