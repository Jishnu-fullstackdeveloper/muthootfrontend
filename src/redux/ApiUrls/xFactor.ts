export const API_ENDPOINTS = {
  getResignedXfactorUrl: '/resigned-xfactor-config',
  UpdateResignedXfactorUrl: (id: string) => `/resigned-xfactor-config?id=${id}`,

  // createXfactorUrl:'/system-management/xfactor-config',
  getDesignationUrl: '/designation',

  getVacancyXfactorUrl: '/vacancy-xfactor-config',
  UpdateVacancyXfactorUrl: (id: string) => `/vacancy-xfactor-config?id=${id}`

  // patchUserRoleUrl:'/users/roles/permissions'
}
