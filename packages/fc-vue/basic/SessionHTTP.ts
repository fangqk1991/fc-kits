import { RetainedSessionApis, SessionInfo } from '@fangcha/app-models'
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
