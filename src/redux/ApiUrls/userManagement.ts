export const API_ENDPOINTS = {
  getUsersUrl: '/users',
  getUserByIdUrl: (id: string) => `/users/${id}`, // Base URL for /users/{id}
  getEmployeesUrl: '/employee',
  getRolesUrl: '/roles',
  addUserUrl: '/users',
  updateUserRolesUrl: '/users/update-roles'
}
