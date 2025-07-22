export const API_ENDPOINTS = {
  fetchBudgetDepartmentUrl: '/department-budget',
  budgetIncreaseRequestUrl: '/budget-increase-request', // POST URL
  budgetIncreaseRequestListUrl: '/budget-increase-request', // GET URL for list
  budgetIncreaseRequestApproveRejectUrl: '/budget-increase-request/approve-reject?approvalRequestId=', // PUT URL
  budgetIncreaseRequestDetailUrl: '/budget-increase-request', // GET URL for detail by ID (with {id} parameter)
  jobRoleUrl: '/jobRole',
  jobRoleNamesByRoleUrl: '/jobRole/names-by-role',
  employeeUrl: '/employee',
  businessUnitUrl: '/businessUnit',
  employeeCategoryTypeUrl: '/employeeCategoryType',
  departmentUrl: '/department',
  designationUrl: '/designation',
  gradeUrl: '/grade',
  zoneUrl: '/zone',
  regionUrl: '/region',
  areaUrl: '/area',
  branchUrl: '/branch',
  stateUrl: '/state',
  approvalCategoriesUrl: '/approval-service/approval-categories',
  territoryUrl: '/territory',
  clusterUrl: '/cluster',
  cityUrl: '/city',
  departmentBudgetUrl: '/department-budget',
  departmentBudgetVacancyUrl: '/department-budget/vacancy'
}
