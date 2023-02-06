export const KitSsoApis = {
  Login: {
    method: 'GET',
    route: '/api/v1/login',
    description: '登录',
  },
  Logout: {
    method: 'GET',
    route: '/api/v1/logout',
    description: '登出',
  },
  SSOHandle: {
    method: 'GET',
    route: '/api/v1/handleSSO',
    description: '处理 SSO 回调',
  },
}
