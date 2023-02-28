import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { ReactRequest } from './ReactRequest'

export interface SessionUserInfo {
  email: string
  [p: string]: any
}

export class SessionHTTP {
  public static async getSessionInfo<Config = {}>() {
    return await ReactRequest(RetainedSessionApis.SessionInfoGet).quickSend<SessionInfo<Config>>()
  }

  public static async getUserInfo() {
    return await ReactRequest(RetainedSessionApis.UserInfoGet).quickSend<SessionUserInfo>()
  }
}
