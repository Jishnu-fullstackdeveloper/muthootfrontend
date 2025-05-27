export const API_ENDPOINTS = {
  EMPLOYEES: '/employee',
  VACANCY_REQUEST: '/vacancy-request',
  EMPLOYEE_BY_ID: (id: string) => `/employee/${id}`,
  SYNC_EMPLOYEES: '/resigned-employees/sync'
}
