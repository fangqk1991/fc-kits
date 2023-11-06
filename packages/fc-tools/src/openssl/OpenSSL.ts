import * as shell from 'shelljs'
import * as moment from 'moment/moment'
import { SslCertInfo } from '../common'

export class OpenSSL {
  public static getDomainCertText(domain: string) {
    const result = shell.exec(`printf Q | openssl s_client -servername ${domain} -connect ${domain}:443`, {
      silent: true,
    })
    const matches1 = result.stdout.match(/(-+BEGIN CERTIFICATE-+[\s\S]*?-+END CERTIFICATE-+)/)
    if (!matches1) {
      throw new Error('certificate info error')
    }
    return matches1[1]
  }

  public static parseDomain(domain: string) {
    const text = OpenSSL.getDomainCertText(domain)
    return OpenSSL.parseCertText(text)
  }

  public static parseCertText(certText: string): SslCertInfo {
    const result = shell.exec(`echo "${certText}" | openssl x509 -noout -text`, {
      silent: true,
    })
    if (result.stderr) {
      throw new Error(result.stderr)
    }
    const text = result.stdout
    // console.info(text)
    return {
      algorithm: text.match(/\n\s*Signature Algorithm: (\w+)/)![1],
      issuer: text.match(/\n\s*Issuer: (.*)/)![1],
      subject: text.match(/\n\s*Subject: CN\s*=\s*([^\s,]*)/)![1],
      notBefore: moment(new Date(text.match(/\n\s*Not Before: (.*)/)![1])).format(),
      notAfter: moment(new Date(text.match(/\n\s*Not After\s*: (.*)/)![1])).format(),
      domains: text
        .match(/\s*Subject Alternative Name:[\s\S]*?(DNS:.*)\n/)![1]
        .split(',')
        .map((item) => item.trim().replace(/^DNS:/, '')),
    }
  }

  public static getDomainCertExpireTime(domain: string) {
    return this.parseDomain(domain).notAfter
  }

  public static getCertExpireTime(certText: string) {
    return this.parseCertText(certText).notAfter
  }

  public static getCertificateSign(certText: string) {
    const result = shell.exec(`echo "${certText}" | openssl x509 -pubkey -noout -outform pem | shasum`, {
      silent: true,
    })
    if (result.stderr) {
      throw new Error(result.stderr)
    }
    const matches = result.stdout.match(/^(\w{40})/)
    if (!matches) {
      throw new Error('getCertificateSign error')
    }
    return matches[1]
  }

  public static getPrivateKeySign(keyText: string) {
    const result = shell.exec(`echo "${keyText}" | openssl pkey -pubout -outform pem | shasum`, {
      silent: true,
    })
    if (result.stderr) {
      throw new Error(result.stderr)
    }
    const matches = result.stdout.match(/^(\w{40})/)
    if (!matches) {
      throw new Error('getCertificateSign error')
    }
    return matches[1]
  }

  public static checkKeyPairsMatch(certText: string, keyText: string) {
    return this.getCertificateSign(certText) === this.getPrivateKeySign(keyText)
  }
}
