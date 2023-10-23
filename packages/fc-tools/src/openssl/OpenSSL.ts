import * as shell from 'shelljs'

export class OpenSSL {
  public static getDomainCertExpireTime(domain: string) {
    const result = shell.exec(
      `printf Q | openssl s_client -servername ${domain} -connect ${domain}:443 | openssl x509 -noout -dates`,
      {
        silent: true,
      }
    )
    const matches = result.stdout.match('notAfter=(.*)')
    if (!matches) {
      throw new Error(result.stderr)
    }
    return new Date(matches[1])
  }
}
