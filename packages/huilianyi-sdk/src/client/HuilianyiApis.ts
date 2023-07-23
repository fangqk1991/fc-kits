export const HuilianyiApis = {
  // https://opendocs.huilianyi.com/implement.html#%E8%8E%B7%E5%8F%96accesstoken
  AccessTokenRequest: {
    method: 'POST',
    route: '/gateway/oauth/token',
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
  ReceiptedInvoiceListGet: {
    method: 'GET',
    route: '/gateway/api/open/receiptedInvoice',
    description: '查询开票信息',
  },
  NotificationSend: {
    method: 'POST',
    route: '/gateway/api/open/notification/send',
    description: '第三方应用消息推送',
  },
}
