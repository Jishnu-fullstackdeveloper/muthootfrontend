export const API_ENDPOINTS = {
  getBranchListUrl: '/branch',
  getBranchDetailsUrl: (id: string) => `/branch/${id}`,
  getEmployeeDetailsWithBranchIdUrl: (branchId: string) => `/employee-branch/employee/${branchId}`,
  fetchArea: `/area`,
  fetchResignedEmployeesUrl: (id: string) => `/resigned-employees/${id}`,
  fetchBranchReportUrl: `/branch/report-branch`,
  fetchVacancyReportUrl: `/vacancy/vacancy-report`,
  fetchBubblePositionsUrl: (branchId: string) => `/bubble-position/branch/${branchId}`,
  fetchVacanciesUrl: (branchId: string) => `/vacancy/${branchId}`
}
