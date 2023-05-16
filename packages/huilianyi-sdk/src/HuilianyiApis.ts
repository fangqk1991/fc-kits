export const HuilianyiApis = {
  // https://opendocs.huilianyi.com/implement.html#%E8%8E%B7%E5%8F%96accesstoken
  AccessTokenRequest: {
    method: 'POST',
    route: '/oauth/token',
    description: '获取 AccessToken',
  },
  CompanyListGet: {
    method: 'GET',
    route: '/gateway/api/open/company/tenant/all',
    description: '查询租户下所有公司',
  },
  CompanyInfoGet: {
    method: 'GET',
    route: '/gateway/api/open/company/:companyCode',
    description: '查看公司详情',
  },
  UserGroupListGet: {
    method: 'GET',
    route: '/gateway/api/open/userGroup/all',
    description: '查询租户下所有人员组',
  },
  UserGroupMembersGet: {
    method: 'GET',
    route: '/gateway/api/open/userGroup/:groupCode',
    description: '根据人员组 OID 或者编码查询该人员组详情',
  },
}
