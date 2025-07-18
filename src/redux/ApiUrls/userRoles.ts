

export const API_ENDPOINTS = {
  getUserRolesUrl: '/roles',
  getUserRoleDetailsUrl: (id: string) => `/roles/${id}`,
  patchUserRoleUrl: '/roles/update-permissions',
  getUserDesignationsUrl: '/designation'
}
