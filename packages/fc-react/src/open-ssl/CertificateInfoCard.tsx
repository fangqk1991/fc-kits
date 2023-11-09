import React from 'react'
import { SslCertInfo } from '@fangcha/tools'

export const CertificateInfoCard: React.FC<{ certInfo: SslCertInfo }> = ({ certInfo }) => {
  if (!certInfo) {
    return <></>
  }
  return (
    <ul
      style={{
        paddingInlineStart: '12px',
      }}
    >
      <li>
        subject: <b>{certInfo.subject}</b>
      </li>
      <li>issuer: {certInfo.issuer}</li>
      <li>notBefore: {certInfo.notBefore}</li>
      <li>
        notAfter: <b>{certInfo.notAfter}</b>
      </li>
      <li>
        domains: <b>{certInfo.domains.join(', ')}</b>
      </li>
    </ul>
  )
}
