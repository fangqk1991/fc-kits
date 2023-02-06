import { Api } from '@fangcha/swagger'

export const KitAuthApis = {
  Login: {
    method: 'POST',
    route: '/api/auth-sdk/v1/login',
    description: 'Login',
    parameters: [
      {
        name: 'bodyData',
        type: 'object',
        in: 'body',
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'admin@example.com',
            },
            password: {
              type: 'string',
              example: 'admin',
            },
          },
        },
      },
    ],
  } as Api,
  Logout: {
    method: 'GET',
    route: '/api/auth-sdk/v1/logout',
    description: 'Logout',
  } as Api,
  RedirectLogin: {
    method: 'GET',
    route: '/api-302/auth-sdk/v1/login',
    description: 'Login (302)',
  } as Api,
  RedirectLogout: {
    method: 'GET',
    route: '/api-302/auth-sdk/v1/logout',
    description: 'Logout (302)',
  } as Api,
  RedirectHandleSSO: {
    method: 'GET',
    route: '/api-302/auth-sdk/v1/handle-sso',
    description: 'AuthorizationCode handler (302)',
    parameters: [
      {
        name: 'code',
        type: 'string',
        in: 'query',
        description: 'AuthorizationCode',
      },
      {
        name: 'state',
        type: 'string',
        in: 'query',
        description: 'State',
      },
    ],
  } as Api,
}
