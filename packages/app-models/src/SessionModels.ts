export interface SessionUserInfo {
  email: string
  nickName: string
  isAdmin?: boolean
  permissionKeyMap?: {
    [p: string]: 1
  }
  [p: string]: any
}

export interface SessionInfo<
  T = {
    [key: string]: any
  }
> {
  env: string
  tags: string[]
  codeVersion: string
  config: T

  userInfo: SessionUserInfo | null
}
