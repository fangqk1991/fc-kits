export const HLY_BasicDataApis = {
  ExpenseTypeListGet: {
    method: 'GET',
    route: '/gateway/api/open/expenseType',
    description: '查询费用类型',
  },
  StaffListGet: {
    method: 'GET',
    route: '/gateway/api/open/user',
    description: '增量查询员工',
  },
  DepartmentListGet: {
    method: 'GET',
    route: '/gateway/api/open/department',
    description: '增量查询员工',
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
  CostCenterItemsGet: {
    method: 'GET',
    route: '/gateway/api/open/costCenterItem/incremental',
    description: '分页查询成本中心项',
  },
}
