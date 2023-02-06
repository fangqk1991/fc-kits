import { WebAuthProtocol } from './WebAuthProtocol'
import assert from '@fangcha/assert'
import { AuthMode } from '@fangcha/account/lib/common/models'

class __WebAuthState {
  public authProtocol!: WebAuthProtocol

  public setAuthProtocol(protocol: WebAuthProtocol) {
    protocol.authMode = protocol.authMode || AuthMode.Simple
    if (protocol.authMode === AuthMode.SSO) {
      assert.ok(!!protocol.ssoAuth, `WebAuthProtocol.ssoAuth invalid.`, 500)
    } else {
      assert.ok(!!protocol.simpleAuth, `WebAuthProtocol.simpleAuth invalid.`, 500)
    }
    this.authProtocol = protocol
    return this
  }
}

export const _WebAuthState = new __WebAuthState()
