import { Context } from 'koa'
import assert from '@fangcha/assert'
import { base64ToUtf8 } from '@fangcha/tools'
import { FangchaSession } from './FangchaSession'
import { OpenVisitor } from '../basic'
import { _SessionApp } from './_SessionApp'

export class FangchaOpenSession<T = OpenVisitor> extends FangchaSession {
  public visitor!: T
  public readonly visitorId: string = ''
  protected readonly secret: string = ''

  public constructor(ctx: Context) {
    super(ctx)
    {
      const authorization = base64ToUtf8((this.headers['authorization'] || '').replace(/^Basic /, ''))
      const matches = authorization.match(/^([^:]+):(.*)$/) as any[]
      if (matches) {
        const [, visitorId, secret] = matches
        this.visitorId = visitorId
        this.secret = secret
      }
    }

    this.logger.addContext('user', this.visitorId || '-')
  }

  public curUserStr() {
    return this.visitorId || '-'
  }

  public auth() {
    assert.ok(!!this.visitorId && !!this.secret, 'Authorization missing.', 401)
    assert.ok(!!_SessionApp.basicAuthProtocol, 'basicAuthProtocol missing', 500)
    this.visitor = _SessionApp.basicAuthProtocol.findVisitor(this.visitorId, this.secret) as any
    assert.ok(!!this.visitor, `visitor[${this.visitorId}] not found.`, 401)
    // if (this.visitor.secureMode) {
    //   const whiteMap = VisitorCenter.whiteIpMapForVisitor(this.visitor)
    //   const ipv6 = this.realIP
    //   const ipv4 = this.realIP.replace('::ffff:', '')
    //   assert.ok(whiteMap[ipv6] || whiteMap[ipv4], `The IP Address[${this.realIP}] is allowed.`, 401)
    // }
  }
}
