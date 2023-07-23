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
  DepartmentListGet: {
    method: 'GET',
    route: '/gateway/api/open/department',
    description: '增量查询部门',
  },
  DepartmentInfoGet: {
    method: 'GET',
    route: '/gateway/api/open/department/:departmentOID',
    description: '查询指定部门',
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
