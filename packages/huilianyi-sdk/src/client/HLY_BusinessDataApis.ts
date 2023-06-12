export const HLY_BusinessDataApis = {
  ApprovalMatrixListGet: {
    method: 'POST',
    route: '/gateway/api/open/approval/matrix/list',
    description: '审批矩阵查询',
  },
  PublicApplicationListGet: {
    method: 'GET',
    route: '/gateway/api/open/publicApplication',
    // 包含明细数据
    description: '增量查询对公申请单',
  },
  PublicApplicationDetailGet: {
    method: 'GET',
    route: '/gateway/api/open/publicApplication/detail',
    description: '查询单个对公申请单详情(单号)',
  },
  ExpenseReportListGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseReport',
    // 包含明细数据
    description: '报销单明细增量查询',
  },
  ExpenseReportListGetV2: {
    method: 'POST',
    route: '/gateway/api/open/expenseReport/v2',
    // 包含明细数据
    description: '报销单明细增量查询 V2',
  },
  ExpenseReportDetailGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseReport/detail',
    description: '报销单详情查询',
  },
  TravelApplicationListGet: {
    method: 'GET',
    route: '/gateway/api/open/travelApplication',
    // 包含明细数据
    description: '增量查询差旅申请单',
  },

  ApplicationCustomFormValueUpdate: {
    method: 'PUT',
    route: '/gateway/api/open/application/update/custom/form/value',
    description: '申请单自定义控件值更新',
  },
}
