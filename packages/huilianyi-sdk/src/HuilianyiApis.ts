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
  LegalEntityListGet: {
    method: 'GET',
    route: '/gateway/api/open/legalEntity',
    description: '查询租户下所有法人',
  },
  LegalEntityInfoGet: {
    method: 'GET',
    route: '/gateway/api/open/legalEntity/:legalEntityOID',
    description: '根据法人实体 OID 查询该法人实体详情',
  },
  CostCenterListGet: {
    method: 'GET',
    route: '/gateway/api/open/costCenter',
    description: '查询成本中心',
    // 说明：不包含成本中心项列表
  },
  CostCenterDetailGet: {
    method: 'POST',
    route: '/gateway/api/open/costCenter/get',
    description: '查询成本中心详情',
  },
}
