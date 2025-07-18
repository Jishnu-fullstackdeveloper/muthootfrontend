export const API_ENDPOINTS = {
  APPROVAL_CATEGORIES: '/approval-service/approval-categories',
  APPROVAL_CATEGORIES_BY_ID: (id: string) => `/approval-service/approval-categories/${id}`,
  APPROVAL_MATRICES: '/approval-service/approval-matrices',
  APPROVAL_MATRICES_BY_ID: (id: string) => `/approval-service/approval-matrices/${id}`,
  LEVELS: '/approval-service/approval-matrices/levels',
  DESIGNATIONS: '/designation',
  GRADES: '/grade'

  // Note: Commented out endpoint for getApprovalMatrixOptions as it's disabled in the slice
  // APPROVAL_MATRIX_OPTIONS: '/appproval-actions/designations'
} as const
