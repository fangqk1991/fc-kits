import assert from '@fangcha/assert'
import { BasicAuthProtocol, JWTProtocol, PermissionProtocol } from '../basic'

class __SessionApp implements PermissionProtocol {
  public baseURL: string = ''
  public availableHostMap: { [host: string]: string } = {}
  public jwtProtocol!: JWTProtocol
  public basicAuthProtocol!: BasicAuthProtocol

  public setBaseURL(val: string) {
    const urls = val.split(',').map((item) => item.trim())
    this.baseURL = urls[0]
    this.availableHostMap = urls.reduce((result, url) => {
      const matches = url.match(/https?:\/\/([^:\/\s]+)/)
      if (matches) {
        result[matches[1]] = url
      }
      return result
    }, {})
  }

  public getBaseURL(host: string) {
    return this.availableHostMap[host] || this.baseURL
  }

  public checkUserIsAdmin = (_email: string) => {
    return false
  }

  public checkUserHasPermission = (_email: string, _permissionKey: string) => {
    return false
  }

  public checkUserInAnyGroup = (_email: string, ..._groupIds: string[]) => {
    return false
  }

  public assertUserIsAdmin(email: string) {
    assert.ok(this.checkUserIsAdmin(email), `${email} 必须为应用的管理员`, 403)
  }

  public assertUserHasPermission(email: string, permissionKey: string) {
    assert.ok(this.checkUserHasPermission(email, permissionKey), `${email} 不具备权限 "${permissionKey}"`, 403)
  }

  public assertUserInAnyGroup(email: string, ...groupIds: string[]) {
    assert.ok(this.checkUserInAnyGroup(email, ...groupIds), `${email} 不 "${groupIds.join(' | ')}" 组中`, 403)
  }

  public setPermissionProtocol(protocol: PermissionProtocol) {
    this.checkUserIsAdmin = protocol.checkUserIsAdmin
    this.checkUserHasPermission = protocol.checkUserHasPermission
    this.checkUserInAnyGroup = protocol.checkUserInAnyGroup
    return this
  }

  public setJWTProtocol(protocol: JWTProtocol) {
    assert.ok(!!protocol.jwtKey, 'jwtProtocol.jwtKey error', 500)
    assert.ok(!!protocol.jwtSecret, 'jwtProtocol.jwtSecret error', 500)
    this.jwtProtocol = protocol
    return this
  }
}

export const _SessionApp = new __SessionApp()
