import { Api } from '@fangcha/swagger'

export const RetainedSessionApis = {
  SessionInfoGet: {
    method: 'GET',
    route: '/api/session/v1/session-info',
    description: 'Get session info',
    skipAuth: true,
  } as Api,
  UserInfoGet: {
    method: 'GET',
    route: '/api/session/v1/user-info',
    description: 'Get user info',
  } as Api,
}
