export interface ViewBranchProps {
  mode: string
  id: string
  branchTab: string
}

export interface Branch {
  map: any
  id: string
  name: string
  branchCode: string
  turnoverCode: string
  bucketName: string
  branchStatus: string
  areaId: string
  districtId: string
  stateId: string
  createdAt: string
  updatedAt: string
  data: any
  bucket: {
    id: string
    name: string
    positionCategories: {
      designationName: string
      count: number
      grade: string
    }[]
    turnoverCode: string
    notes: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  cluster: {
    name: any
    area?: {
      name?: any
      region?: {
        name?: any
        zone?: {
          name?: any
          territory?: {
            name?: any
          }
        }
      }
    }
  }
  area: {
    id: string
    name: string
    regionId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  district: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  state: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

export interface BranchDetailsResponse {
  status: string
  message: string
  data: Branch
}

export interface BranchListResponse {
  [x: string]: any
  status: string
  message: string
  totalCount: number
  data: Branch[]
  page: number
  limit: number
}

export interface Employee {
  id: string
  employeeCode: string
  title: string
  firstName: string
  middleName: string
  lastName: string
  officeEmailAddress: string
  personalEmailAddress: string
  mobileNumber: string
  businessUnitId: string
  resignedEmployeeId: string | null
  departmentId: string
  gradeId: string
  bandId: string
  designationId: string
  employeeDetails: {
    position: string
    experience: string
  }
  companyStructure: {
    structure: string
  }
  managementHierarchy: {
    hierarchy: string
  }
  payrollDetails: {
    tax: string
    salary: string
  }
  address: {
    city: string
    street: string
    country: string
  }
  emergencyContact: {
    name: string
    contact: string
    relation: string
  }
  experienceDetails: {
    previousCompany: string
    yearsOfExperience: number
  }
  personalDetails: {
    dob: string
    nationality: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  band: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  businessUnit: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  grade: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designation: {
    id: string
    name: string
    departmentId: string
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  department: {
    id: string
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

export interface BranchManagementState {
  branchDetailsData: Branch | null
  branchDetailsLoading: boolean
  branchDetailsSuccess: boolean
  branchDetailsFailure: boolean
  branchDetailsFailureMessage: string
  employeeListData: EmployeeListResponse | null // Updated to store the full API response
  branchListData: BranchListResponse | null // Allow null to handle initial state or errors
  branchListLoading: boolean
  branchListSuccess: boolean
  branchListTotal: number
  branchListFailure: boolean
  branchListFailureMessage: string
  resignedEmployeesData: any
  resignedEmployeesTotal: any
  fetchBranchReportLoading: boolean
  fetchBranchReportSuccess: boolean
  fetchBranchReportData: BranchReportResponse | null
  fetchBranchReportFailure: boolean
  fetchBranchReportFailureMessage: string
  fetchVacancyReportLoading: boolean
  fetchVacancyReportSuccess: boolean
  fetchVacancyReportData: VacancyReportResponse | null
  fetchVacancyReportFailure: boolean
  fetchVacancyReportFailureMessage: string
  fetchBubblePositionsLoading: boolean
  fetchBubblePositionsSuccess: boolean
  fetchBubblePositionsData: BubblePositionResponse | null
  fetchBubblePositionsFailure: boolean
  fetchBubblePositionsFailureMessage: string
  fetchVacanciesLoading: boolean
  fetchVacanciesSuccess: boolean
  fetchVacanciesData: VacancyResponse | null
  fetchVacanciesFailure: boolean
  fetchVacanciesFailureMessage: string
}

export interface EmployeeDetails {
  id: string
  employeeCode: string
  title: string
  firstName: string
  middleName: string
  lastName: string
  officeEmailAddress: string
  personalEmailAddress: string
  mobileNumber: string
  businessUnitId: string
  resignedEmployeeId: string | null
  departmentId: string
  gradeId: string
  bandId: string
  designationId: string
  employeeDetails: {
    position: string
    experience: string
  }
  companyStructure: {
    structure: string
  }
  managementHierarchy: {
    hierarchy: string
  }
  payrollDetails: {
    tax: string
    salary: string
  }
  address: {
    city: string
    street: string
    country: string
  }
  emergencyContact: {
    name: string
    contact: string
    relation: string
  }
  experienceDetails: {
    previousCompany: string
    yearsOfExperience: number
  }
  personalDetails: {
    dob: string
    nationality: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  band: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  businessUnit: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  grade: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designation: {
    id: string
    name: string
    departmentId: string
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  department: {
    id: string
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

export interface EmployeeListResponse {
  status: string
  message: string
  totalCount: number
  data: EmployeeDetails[]
  page: number
  limit: number
}

export interface Area {
  id: string
  name: string
  regionId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  region: {
    id: string
    name: string
    zoneId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    deletedBy: string | null
    zone: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
      deletedAt: string | null
      deletedBy: string | null
    }
  }
}

export interface AreaListResponse {
  status: string
  message: string
  totalCount: number
  data: Area[]
  currentPage: number
  limit: string
}

export interface ResignedEmployeesResponse {
  status: string
  message: string
  data: Array<{
    id: string
    deletedBy: string | null
    employeeCode: string
    dateOfResignation: string
    noticePeriod: string
    relievingDateAsPerNotice: string
    notes: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    firstName: string
    departmentName: string
  }>
  totalCount: number
  page: number
  limit: number
}

export interface BubblePosition {
  designationName: string
  count: number
}

export interface BranchReportData {
  branchId: string
  employeeCount: number
  bubblePositions: BubblePosition[]
}

export interface BranchReportResponse {
  status: string
  message: string
  data: BranchReportData
}

export interface VacancyReportData {
  branchId: string
  vacancyCount: number
}

export interface VacancyReportResponse {
  status: string
  message: string
  data: VacancyReportData
}

export interface BubblePositionItem {
  branchId?: string
  designations?: string
  count?: number
}

export interface BubblePositionResponse {
  status: string
  message: string
  data: BubblePositionItem[]
}

export interface VacancyItem {
  branchId?: string
  designations?: string
  count?: number
}

export interface VacancyResponse {
  status: string
  message: string
  data: VacancyItem[]
  totalCount: number
}
