import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { MyAxios } from './MyAxios'

export interface SessionUserInfo {
  email: string
  [p: string]: any
}

export class SessionHTTP {
  public static async getSessionInfo<Config = {}>() {
    return await MyAxios(RetainedSessionApis.SessionInfoGet).quickSend<SessionInfo<Config>>()
  }

  public static async getUserInfo() {
    return await MyAxios(RetainedSessionApis.UserInfoGet).quickSend<SessionUserInfo>()
  }
}
