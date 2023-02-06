export interface SessionInfo<
  T = {
    [key: string]: any
  }
> {
  env: string
  tags: string[]
  codeVersion: string
  config: T

  userInfo: {
    email: string
  } | null
}
