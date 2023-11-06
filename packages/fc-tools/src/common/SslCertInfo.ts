export interface SslCertInfo {
  algorithm: string
  issuer: string
  subject: string
  notBefore: string
  notAfter: string
  domains: string[]
}
