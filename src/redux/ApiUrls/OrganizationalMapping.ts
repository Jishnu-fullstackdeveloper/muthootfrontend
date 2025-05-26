export const API_ENDPOINTS = {
  getDesignationsUrl: '/designation',
  getDepartmentsUrl: '/department',
  getDepartmentDesignationUrl: '/department-designation',
  addDepartmentDesignationUrl: '/department-designation',
  updateDepartmentDesignationUrl: (id: string) => `/department-designation?id=${id}`
}
