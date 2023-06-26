export const CTripDataApis = {
  OrderTicketRequest: {
    method: 'POST',
    route: '/SwitchAPI/Order/Ticket',
    description: '获取 Order Ticket',
  },
  OrderSearch: {
    method: 'POST',
    route: '/SwitchAPI/Order/SearchOrder',
    description: '订单查询 SearchOrder',
  },
  OrderIdListQuery: {
    method: 'POST',
    route: '/order/queryOrderIdList',
    description: '订单取数查询订单号',
  },
}
