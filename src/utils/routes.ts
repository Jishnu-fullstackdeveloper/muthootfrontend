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
  APPROVALS_VIEW: `/approvals/approval-detail/view`,
  APPROVALS_VACANCY_GROUP: `/approvals/approval-detail/Vacancy-Request-Group`,
  APPROVALS_VACANCY_REQUEST: ({
    designation,
    department,
    grade,
    branch,
    cluster,
    area,
    region,
    zone,
    territory,
    locationType
  }) => {
    const params = new URLSearchParams({ designation, department, grade })

    const locationMap: Record<string, string | undefined> = {
      BRANCH: branch,
      CLUSTER: cluster,
      AREA: area,
      REGION: region,
      ZONE: zone,
      TERRITORY: territory
    }

    const locationKey = locationType?.toUpperCase()

    if (locationKey && locationMap[locationKey]) {
      params.append(locationKey.toLowerCase(), locationMap[locationKey]!)
    }

    return `/approvals/approval-detail/Vacancy-Request-Group/request?${params.toString()}`
  },
  VACANCY_DETAIL: (id: string) => `/approvals/approval-detail/Vacancy-Request-Group/request/details?id=${id}`,
  INTERVIEW_MANAGEMENT: `/interview-management`,
  HIRING_MANAGEMENT: {
    JOB_POSTING: '/hiring-management/job-posting',
    // INTERVIEW_MANAGEMENT: '/interview-management',
    CV_POOL: '/hiring-management/cv-pool',
    ONBOARDING: '/hiring-management/onboard-management',
    RESIGNED_EMPLOYEE: '/hiring-management/resigned-employee',
    RESIGNED_EMPLOYEE_DETAIL: (id: string) => `/hiring-management/resigned-employee/view/detail?id=${id}`,
    VACANCY_MANAGEMENT: {
      VACANCY_LIST: '/hiring-management/vacancy-management/vacancy-list',
      VACANCY_LIST_VIEW: ({
        designation,
        department,
        grade,
        branch,
        cluster,
        area,
        region,
        zone,
        territory,
        locationType
      }) => {
        const params = new URLSearchParams({ designation, department, grade })

        const locationMap: Record<string, string | undefined> = {
          BRANCH: branch,
          CLUSTER: cluster,
          AREA: area,
          REGION: region,
          ZONE: zone,
          TERRITORY: territory
        }

        const locationKey = locationType?.toUpperCase()

        if (locationKey && locationMap[locationKey]) {
          params.append(locationKey.toLowerCase(), locationMap[locationKey]!)
        }

        return `/hiring-management/vacancy-management/vacancy-list/view/vacancy-details?${params.toString()}`
      },

      VACANCY_LIST_VIEW_DETAIL: (id: string) =>
        `/hiring-management/vacancy-management/vacancy-list/view/detail?id=${id}`,
      VACANCY_REQUEST: '/hiring-management/vacancy-management/vacancy-request',
      VACANCY_REQUEST_DETAIL: (id: string) =>
        `/hiring-management/vacancy-management/vacancy-request/view/Detail?id=${id}`,
      RESIGNED_DETAILS: (id: string) =>
        `/hiring-management/vacancy-management/vacancy-request/resignation-detail?id=${id}`
    },
    BUDGET: {
      BUDGET_REQUEST: '/hiring-management/budget-management/budget-request',
      BUDGET_REQUEST_VIEW: (jobTitle: string, id: string) =>
        `/hiring-management/budget-management/budget-request/view/${jobTitle}?id=${id}`,
      BUDGET_REQUEST_EDIT: (id: string) => `/hiring-management/budget-management/budget-request/edit/detail?id=${id}`,
      BUDGET_REQUEST_ADD: '/hiring-management/budget-management/budget-request/add/new',
      POSITION_MATRIX: '/hiring-management/budget-management/position-budget-matrix'
    },
    BUDGET_ADD: '/hiring-management/budget-management/budget-request/add/new',
    BUDGET_VIEW: (jobTitle: string, id: string) =>
      `/hiring-management/budget-management/budget-request/view/${jobTitle}?id=${id}`
  },
  JD_MANAGEMENT: '/jd-management',
  BRANCH_MANAGEMENT: '/branch-management',
  SYSTEM_MANAGEMENT: {
    X_FACTOR: {
      RESIGNED_X_FACTOR: '/system-management/x-factor/resigned-x-factor',
      VACANCY_X_FACTOR: '/system-management/x-factor/vacancy-x-factor',
      NOTICE_PERIOD: '/system-management/x-factor/notice-period'
    },
    DATA_UPLOAD: '/system-management/data-upload',
    APPROVAL_CATEGORY: '/system-management/approval-category',
    ORGANIZATIONAL_MAPPING: '/system-management/organizational-mapping',
    APPROVAL_MATRIX: '/system-management/approval-matrix',
    APPROVAL_MATRIX_ADD: '/system-management/approval-matrix/add/new',
    APPROVAL_MATRIX_EDIT: (queryParams: any) => `/system-management/approval-matrix/edit/edit-approval?${queryParams}`,
    SCHEDULER: '/system-management/scheduler',
    INTERVIEW_CUSTOMIZATION: '/system-management/interview-customization'
  }
}
