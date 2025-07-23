
export const API_ENDPOINTS = {
  getUsersUrl: '/users',
  getUserByIdUrl: (id: string) => `/users/${id}`, // Base URL for /users/{id}
  getEmployeesUrl: '/employee',
  getDesignationRoleUrl: '/designation',
  addUserUrl: '/users',
  updateUserPermissionUrl: '/users/update-permissions',
  updateUserRoleUrl: '/users/update-permissions'
}
