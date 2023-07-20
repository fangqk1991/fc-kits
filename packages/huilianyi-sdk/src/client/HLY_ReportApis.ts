export const HLY_ReportApis = {
  Report_ReimbursementDataSearch: {
    method: 'POST',
    route: '/gateway/report/api/open/report/searchReimbursement',
    description: '报销单报表',
  },
  ExpenseDetailsDataSearch: {
    method: 'POST',
    route: '/gateway/report/api/open/report/searchExpenseDetails',
    description: '费用明细报表',
  },
  TravelApplyDataSearch: {
    method: 'POST',
    route: '/gateway/report/api/open/report/searchTrvappReport',
    description: '差旅明细报表',
  },
  ContractDataSearch: {
    method: 'POST',
    route: '/gateway/report/api/open/report/searchContractHeaderTableReport',
    description: '合同明细报表',
  },
  CorpExpDetailReportSearch: {
    method: 'POST',
    route: '/gateway/report/api/open/report/searchCorpExpDetailReport',
    description: '对公支付单明细报表',
  },
}
