export const HLY_BusinessDataApis = {
  PublicApplicationListGet: {
    method: 'GET',
    route: '/gateway/api/open/publicApplication',
    // 包含明细数据
    description: '增量查询对公申请单',
  },
  ExpenseReportListGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseReport',
    // 包含明细数据
    description: '报销单明细增量查询',
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
}
