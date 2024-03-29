export const HLY_BusinessDataApis = {
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
  TravelApplicationDetailGet: {
    method: 'GET',
    route: '/gateway/api/open/travelApplication/detail',
    description: '查询单个差旅申请单详情(单号)',
  },

  ExpenseApplicationListGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseApplication',
    // 包含明细数据
    description: '增量查询费用申请单',
  },
  ExpenseApplicationDetailGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseApplication/detail',
    description: '查询单个费用申请单详情(单号)',
  },

  InvoiceListGet: {
    method: 'GET',
    route: '/gateway/api/open/invoice',
    // 包含明细数据
    description: '费用增量查询',
  },

  ApplicationCustomFormValueUpdate: {
    method: 'PUT',
    route: '/gateway/api/open/application/update/custom/form/value',
    description: '申请单自定义控件值更新',
  },

  ApprovalPass: {
    method: 'POST',
    route: '/gateway/api/open/approvals/pass',
    description: '当前审批人审批通过',
  },

  /**
   * @description https://opendocs.huilianyi.com/implement/business-data/flight/orders.html
   */
  FlightOrdersGet: {
    method: 'GET',
    route: '/gateway/api/open/flight/orders',
    description: '查询机票订单信息',
  },

  /**
   * @description https://opendocs.huilianyi.com/implement/business-data/flight/orders.html
   */
  TrainOrdersGet: {
    method: 'GET',
    route: '/gateway/api/open/train/orders',
    description: '查询火车订单信息',
  },

  /**
   * @description https://opendocs.huilianyi.com/implement/business-data/hotel/order.html
   */
  HotelOrdersGet: {
    method: 'GET',
    route: '/gateway/api/open/hotel/orders',
    description: '查询酒店订单信息',
  },

  PrepaymentApplyListGet: {
    method: 'GET',
    route: '/gateway/api/open/prepayment/apply',
    // 包含明细数据
    description: '对公收款单增量查询',
  },
}
