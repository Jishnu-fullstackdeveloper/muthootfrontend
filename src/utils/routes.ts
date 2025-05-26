export const ROUTES = {
  HOME: '/home',
  USER_MANAGEMENT: {
    USER: '/user-management/user',
    USER_EDIT: (empCode: string, query: string) => `/user-management/user/edit/${empCode}?${query}`,
    ROLE: '/user-management/role',
    ROLE_VIEW: (query: string, name: string) => `/user-management/role/view//${name.replace(/\s+/g, '-')}?${query}`,
    ROLE_EDIT: (query: string, name: string) => `/user-management/role/edit/${name.replace(/\s+/g, '-')}?${query}`,
    ROLE_ADD: '/user-management/role/add/new',
    EMPLOYEE: '/user-management/employee',
    EMPLOYEE_VIEW: (id: string) => `/user-management/employee/view/profile-?id=${id}`
  },
  APPROVALS: '/approvals',
  HIRING_MANAGEMENT: {
    JOB_POSTING: '/hiring-management/job-posting',
    INTERVIEW_MANAGEMENT: '/hiring-management/interview-management',
    CV_POOL: '/hiring-management/cv-pool',
    ONBOARDING: '/hiring-management/onboard-management',
    RESIGNED_EMPLOYEE: '/hiring-management/resigned-employee',
    VACANCY: '/hiring-management/vacancy-management',
    VACANCY_VIEW: (id: string) => `/hiring-management/vacancy-management/view/vacancy-details?id=${id}`,
    BUDGET: '/hiring-management/budget-management',
    BUDGET_ADD: '/hiring-management/budget-management/add/new',
    BUDGET_VIEW: (jobTitle: string, id: string) => `/hiring-management/budget-management/view/${jobTitle}?id=${id}`
  },
  JD_MANAGEMENT: '/jd-management',
  BRANCH_MANAGEMENT: '/branch-management',
  SYSTEM_MANAGEMENT: {
    X_FACTOR: {
      RESIGNED_X_FACTOR: '/system-management/x-factor/resigned-x-factor',
      VACANCY_X_FACTOR: '/system-management/x-factor/vacancy-x-factor'
    },
    DATA_UPLOAD: '/system-management/data-upload',
    APPROVAL_CATEGORY: '/system-management/approval-category',
    ORGANIZATIONAL_MAPPING: '/system-management/organizational-mapping',
    APPROVAL_MATRIX: '/system-management/approval-matrix',
    APPROVAL_MATRIX_ADD: '/system-management/approval-matrix/add/new',
    SCHEDULER: '/system-management/scheduler',
    INTERVIEW_CUSTOMIZATION: '/system-management/interview-customization'
  }
}
