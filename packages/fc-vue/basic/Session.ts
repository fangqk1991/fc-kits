import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { SessionUserInfo } from './SessionHTTP'
import { MyAxios } from './MyAxios'
import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'

export interface EmptyConfig {}

export class Session<T extends EmptyConfig = {}> {
  public config: T
  public codeVersion = ''

  public curUser: SessionUserInfo | null = null

  public constructor(config?: T) {
    this.config = config || ({} as any)
  }

  public async reloadSessionInfo() {
    const request = MyAxios(RetainedSessionApis.SessionInfoGet)
    request.setMute(true)
    try {
      const response = await request.quickSend<SessionInfo<T>>()
      this.codeVersion = response.codeVersion || ''
      this.curUser = response.userInfo
      Object.assign(this.config, response.config)
      return response
    } catch (err) {
      console.error(err)
    }
    return null
  }

  public async handleIfCodeVersionChanged(handler: () => Promise<void>) {
    const prevVersion = this.getCodeVersionFromLocal()
    this.saveCodeVersion()
    if (prevVersion && prevVersion !== this.codeVersion) {
      await handler()
    }
  }

  public getCodeVersionFromLocal() {
    try {
      const codeVersion = window.localStorage.getItem('codeVersion')
      return codeVersion || ''
    } catch (e) {}
    return ''
  }

  public saveCodeVersion() {
    try {
      window.localStorage.setItem('codeVersion', this.codeVersion)
    } catch (e) {}
  }

  public async reloadIfVersionChanged() {}

  public checkLogin() {
    return !!this.curUser
  }
}
