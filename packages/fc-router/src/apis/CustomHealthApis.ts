import { Api } from '@fangcha/swagger'

export const CustomHealthApis = {
  AppPermissionInfoGet: {
    method: 'GET',
    route: `/api/health/app-permission-info`,
    description: '应用权限信息获取',
  } as Api,
  AppPermissionInfoReload: {
    method: 'POST',
    route: `/api/health/app-permission-info`,
    description: '应用权限信息重新加载',
  } as Api,
  AppConfigInfoGet: {
    method: 'GET',
    route: `/api/health/app-config-info`,
    description: '应用配置信息获取',
  } as Api,

  SystemInfoGet: {
    method: 'GET',
    route: `/api/health/system-info`,
    description: '系统信息获取',
  } as Api,
}
