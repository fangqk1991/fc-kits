import * as shell from 'shelljs'

export class OpenSSL {
  public static getDomainCertExpireTime(domain: string) {
    const result = shell.exec(
      `printf Q | openssl s_client -servername ${domain} -connect ${domain}:443 | openssl x509 -noout -dates`,
      {
        silent: true,
      }
    )
    return this.extractExpireTime(result)
  }

  public static getCertExpireTime(certText: string) {
    const result = shell.exec(`echo "${certText}" | openssl x509 -noout -dates`, {
      silent: true,
    })
    return this.extractExpireTime(result)
  }

  private static extractExpireTime(certResult: shell.ShellString) {
    const matches = certResult.stdout.match('notAfter=(.*)')
    if (!matches) {
      throw new Error(certResult.stderr)
    }
    return new Date(matches[1])
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
