export const permissionsMap = {
  userManagement: ['user_create', 'user_read', 'user_update', 'user_delete'],
  userRoles: ['role_create', 'role_read', 'role_update', 'role_delete'],
  approvalManagement: ['approval_create', 'approval_read', 'approval_update', 'approval_delete'],
  jdManagement: ['jd_create', 'jd_read', 'jd_update', 'jd_delete', 'jd_approval', 'jd_upload'],
  vacancyManagement: ['vacancy_create', 'vacancy_read', 'vacancy_update', 'vacancy_delete'],
  recruitmentManagement: [
    'recruitment_create',
    'recruitment_read',
    'recruitment_update',
    'recruitment_delete',
    'recruitment_approval'
  ],
  branchManagement: ['branch_read'],
  bucketManagement: ['bucket_create', 'bucket_read', 'bucket_update', 'bucket_delete'],
  approvalMatrix: ['approvalmatrix_create', 'approvalmatrix_read', 'approvalmatrix_update', 'approvalmatrix_delete']
}

export default permissionsMap
