export const HLY_BusinessDataApis = {
  ExpenseReportListGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseReport',
    // 包含明细数据
    description: '报销单明细增量查询',
  },
  TravelApplicationListGet: {
    method: 'GET',
    route: '/gateway/api/open/travelApplication',
    // 包含明细数据
    description: '增量查询差旅申请单',
  },
}
