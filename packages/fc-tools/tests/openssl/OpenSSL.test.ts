import { OpenSSL } from '../../src/openssl'

describe('OpenSSL.test.ts', () => {
  const domain = 'fangcha.net'

  it(`getDomainCertText`, async () => {
    console.info(OpenSSL.getDomainCertText(domain))
  })

  it(`parseDomain`, async () => {
    console.info(OpenSSL.parseDomain(domain))
  })

  it(`parseCertText`, async () => {
    const text = OpenSSL.getDomainCertText(domain)
    const infos = OpenSSL.parseCertText(text)
    console.info(infos)
  })

  it(`getDomainCertExpireTime`, async () => {
    console.info(OpenSSL.getDomainCertExpireTime(domain))
  })

  it(`getCertExpireTime`, async () => {
    const text = OpenSSL.getDomainCertText(domain)
    console.info(OpenSSL.getCertExpireTime(text))
  })

  it(`checkKeyPairsMatch`, async () => {
    // console.info(OpenSSL.getCertificateSign(''))
    // console.info(OpenSSL.getPrivateKeySign(''))
  })
})
