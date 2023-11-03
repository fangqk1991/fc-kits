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
}
