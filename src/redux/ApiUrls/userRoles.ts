export const API_ENDPOINTS = {
  getDesignationRole: '/roles/designation-roles',
  getDesignationRoleByIdUrl: (id: string) => `/roles/designation-roles/${id}`,

  getGroupRole: '/roles/group-roles',
  getGroupRoleByIdUrl: (id: string) => `/roles/group-roles/${id}`,

  getPermssions: '/roles/permissions',

  updateGroupRole: '/roles/update-group-roles',
  updtaeGroupPermission:'/roles/update-group-role-permissions',

  addGroupRole:'/roles/group-role'

  // getUserRoleDetailsUrl: (id: string) => `/roles/${id}`,
  // patchUserRoleUrl: '/roles/update-permissions',
  // getUserDesignationsUrl: '/designation'
}
