import { Api } from '@fangcha/swagger'

export const RetainedHealthApis = {
  Ping: {
    method: 'GET',
    route: `/api/health/ping`,
    description: 'Ping',
    skipAuth: true,
  } as Api,
  PingHealth: {
    method: 'GET',
    route: `/api/health/ping-health`,
    description: 'Ping Health',
    skipAuth: true,
  } as Api,
  PingPrint: {
    method: 'GET',
    route: `/api/health/ping-print`,
    description: 'Ping (Log query)',
    skipAuth: true,
  } as Api,
  PingAuth: {
    method: 'GET',
    route: `/api/health/ping-auth`,
    description: 'Ping (Need authorization)',
  } as Api,
  PingQuery: {
    method: 'GET',
    route: `/api/health/ping/query`,
    description: 'Ping (Return query)',
    skipAuth: true,
  } as Api,
  PingFullData: {
    method: 'POST',
    route: `/api/health/ping/body`,
    description: 'Ping (Return headers / query / body)',
    parameters: [
      {
        name: 'bodyData',
        type: 'object',
        in: 'body',
        description: '',
      },
    ],
  } as Api,
  PingError: {
    method: 'POST',
    route: `/api/health/ping/error`,
    description: 'Trigger error',
    skipAuth: true,
  } as Api,
  SystemInfoGet: {
    method: 'GET',
    route: `/api/health/system-info`,
    description: 'Return _FangchaState.appInfo',
  } as Api,
}
