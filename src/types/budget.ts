export interface ApprovalStatusStep {
  designation: string
  label: string
  approverName: string
  employeeCode: string
  status: string
}

export interface Budget {
  id?: number | string
  jobTitle?: string
  openings?: number
  grade?: string
  designation?: string
  businessRole?: string
  experienceMin?: number
  experienceMax?: number
  campusLateral?: string
  employeeCategory?: string
  employeeType?: string
  hiringManager?: string
  startingDate?: string
  closingDate?: string
  company?: string
  businessUnit?: string
  department?: string
  territory?: string
  zone?: string
  region?: string
  area?: string
  cluster?: string
  branchName?: string
  branchCode?: string
  cityClassification?: string
  state?: string
  budgetDepartment?: string
  position?: string
  count?: number
  yearOfBudget?: string
  status?: string
  approvalId?: number | string
  approvalStatus?: string
  approvalStatusLevel?: ApprovalStatusStep[]
  additionalDetails?: string
  approvalRequestId?: string
}

export interface BudgetDepartment {
  id: string
  deletedBy: string | null
  name: string

  positionCategories: {
    designationName: string
    count: number
  }[]
  createdAt: string
  updatedAt: string
  updatedBy: string
  deletedAt: string | null
  data: any
  totalCount: number
}

export interface BudgetDepartmentResponse {
  status: string
  message: string
  totalCount: number
  data: BudgetDepartment[]
  page: number
  limit: number
}

// Type for Budget Management State
export interface BudgetManagementState {
  fetchBudgetDepartmentLoading: boolean
  fetchBudgetDepartmentSuccess: boolean
  fetchBudgetDepartmentData: BudgetDepartmentResponse | null
  fetchBudgetDepartmentTotal: number
  fetchBudgetDepartmentFailure: boolean
  fetchBudgetDepartmentFailureMessage: string
  createBudgetIncreaseRequestLoading: boolean
  createBudgetIncreaseRequestSuccess: boolean
  createBudgetIncreaseRequestData: BudgetIncreaseRequestResponse | null
  createBudgetIncreaseRequestFailure: boolean
  createBudgetIncreaseRequestFailureMessage: string
  fetchBudgetIncreaseRequestListLoading: boolean
  fetchBudgetIncreaseRequestListSuccess: boolean
  fetchBudgetIncreaseRequestListData: BudgetIncreaseRequestListResponse | null
  fetchBudgetIncreaseRequestListTotal: number
  fetchBudgetIncreaseRequestListFailure: boolean
  fetchBudgetIncreaseRequestListFailureMessage: string
  approveRejectBudgetIncreaseRequestLoading: boolean
  approveRejectBudgetIncreaseRequestSuccess: boolean
  approveRejectBudgetIncreaseRequestData: BudgetIncreaseRequestApproveRejectResponse | null
  approveRejectBudgetIncreaseRequestFailure: boolean
  approveRejectBudgetIncreaseRequestFailureMessage: string
  fetchBudgetIncreaseRequestByIdLoading: boolean
  fetchBudgetIncreaseRequestByIdSuccess: boolean
  fetchBudgetIncreaseRequestByIdData: BudgetIncreaseRequestDetailResponse | null
  fetchBudgetIncreaseRequestByIdFailure: boolean
  fetchBudgetIncreaseRequestByIdFailureMessage: string
  fetchTerritoryLoading: boolean
  fetchTerritorySuccess: boolean
  fetchTerritoryData: any
  fetchTerritoryTotal: number
  fetchTerritoryFailure: boolean
  fetchTerritoryFailureMessage: string
  fetchClusterLoading: boolean
  fetchClusterSuccess: boolean
  fetchClusterData: ClusterResponse | null
  fetchClusterTotal: number
  fetchClusterFailure: boolean
  fetchClusterFailureMessage: string
  fetchCityLoading: boolean
  fetchCitySuccess: boolean
  fetchCityData: CityResponse['data'] | null
  fetchCityTotal: number
  fetchCityFailure: boolean
  fetchCityFailureMessage: string
  fetchBranchData?: any
  fetchBranchLoading?: any
  fetchAreaData?: any
  fetchAreaLoading?: any
  fetchRegionData?: any
  fetchRegionLoading?: any
  fetchZoneData?: any
  fetchZoneLoading?: any
}

// Type for Budget Increase Request (POST Request Body and Response Data)
export interface BudgetIncreaseRequest {
  jobTitle: string
  jobRole: string
  openings: any
  businessRole?: string
  experienceMin: any
  experienceMax: any
  campusOrLateral: string
  hiringManager: string
  startingDate: string
  closingDate: string
  company: string
  businessUnit: string
  employeeCategory: string
  employeeType: string
  department: string
  designation: string
  grade: string
  territory: string
  zone: string
  region: string
  area: string
  cluster: string
  branchName: string
  branchCode: string
  city: string
  state: string
  approvalCategoryId: string
  raisedById: string
  status?: string
  approvalStatus?: string[]
  updatedAt?: string
  createdAt?: string
  deletedBy?: string | null
  approvalRequestId?: string
  deletedAt?: string | null
}

// Type for Budget Increase Request Response (POST)
export interface BudgetIncreaseRequestResponse {
  status: string
  message: string
  data: BudgetIncreaseRequest
}

// Type for Budget Increase Request List Response (GET List)
export interface BudgetIncreaseRequestListResponse {
  success: boolean
  message: string
  totalCount: number
  data: BudgetIncreaseRequest[]
  page: number
  limit: number
}

// Type for Budget Increase Request Approve/Reject Response (PUT)
export interface BudgetIncreaseRequestApproveRejectResponse {
  status: string
  message: string
}

// Type for Budget Increase Request Detail Response (GET by ID)
export interface BudgetIncreaseRequestDetailResponse {
  success: boolean
  message: string
  data: BudgetIncreaseRequest
}

export interface JobRole {
  id: string
  deletedBy: string | null
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface JobRoleResponse {
  success: boolean
  message: string
  data: JobRole[]
  totalCount: number
  page: number
  limit: number
}

export interface Employee {
  id: string
  deletedBy: string | null
  employeeCode: string
  title: string | null
  firstName: string
  middleName: string | null
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
    band: string
    grade: string
    groupDOJ: string
    designation: string
    dateOfJoining: string
    employmentType: string
    confirmationDate: string
    employmentStatus: string
    confirmationStatus: string
  }
  companyStructure: {
    company: string
    branchCode: string | null
    department: string
    businessUnitFunction: string
  }
  managementHierarchy: {
    hrManagerCode: string
    l1ManagerCode: string
    l2ManagerCode: string
    matrixManagerCode: string
    functionalManagerCode: string
  }
  payrollDetails: {
    esiNo: string
    panNo: string
    bankName: string
    ifscCode: string
    uanNumber: string
    pfAccountNo: string
    pfApplicable: boolean
    pfGrossLimit: string
    bankAccountNo: string
    esiApplicable: boolean
    lwfApplicable: boolean
  }
  address: {
    state: string
    permanentCity: string
    residenceCity: string
    permanentCountry: string
    residenceCountry: string
    permanentLandline: string
    residenceLandline: string
    cityClassification: string
    permanentPostalCode: string
    residencePostalCode: string
    permanentAddressLine1: string
    permanentAddressLine2: string
    permanentAddressLine3: string
    permanentAddressLine4: string
    permanentAddressLine5: string
    residenceAddressLine1: string
    residenceAddressLine2: string
    residenceAddressLine3: string
    residenceAddressLine4: string
    residenceAddressLine5: string
  }
  emergencyContact: {
    emergencyContactName: string
    emergencyContactMobilePhone: string
    emergencyContactRelationship: string
  }
  experienceDetails: {
    ageYYMM: string
    retirementDate: string
    totalExperience: string
    currentCompanyExperience: string
  }
  personalDetails: {
    gender: string
    religion: string
    birthPlace: string
    bloodGroup: string
    citizenShip: string
    dateOfBirth: string
    marriageDate: string
    maritalStatus: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  businessUnit: {
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  band: {
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  grade: {
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  department: {
    id: string
    deletedBy: string | null
    name: string
    employeeCategoryTypeId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  designation: {
    id: string
    deletedBy: string | null
    name: string
    departmentId: string
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

export interface EmployeeResponse {
  success: boolean
  message: string
  totalCount: number
  data: Employee[]
  page: number
  limit: number
}

export interface BusinessUnit {
  id: string
  deletedBy: string | null
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface BusinessUnitResponse {
  success: boolean
  message: string
  data: BusinessUnit[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface EmployeeCategoryType {
  id: string
  deletedBy: string | null
  name: string
  businessUnitId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  BusinessUnit: BusinessUnit
}

export interface EmployeeCategoryTypeResponse {
  success: boolean
  message: string
  data: EmployeeCategoryType[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface Department {
  id: string
  deletedBy: string | null
  name: string
  employeeCategoryTypeId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  employeeCategoryType: EmployeeCategoryType
}

export interface DepartmentResponse {
  success: boolean
  message: string
  data: Department[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface Designation {
  id: string
  deletedBy: string | null
  name: string
  departmentId: string
  type: 'branch' | 'area'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  department: Department
}

export interface DesignationResponse {
  success: true
  message: string
  data: Designation[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface Grade {
  id: string
  deletedBy: string | null
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface GradeResponse {
  success: true
  message: string
  data: Grade[]
  totalCount: number
  currentPage: number | string
  limit: number | string
}

export interface Zone {
  id: string
  deletedBy: string | null
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ZoneResponse {
  success: true
  message: string
  data: Zone[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface Region {
  id: string
  deletedBy: string | null
  name: string
  zoneId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  zone: Zone
}

export interface RegionResponse {
  success: true
  message: string
  data: Region[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface Area {
  id: string
  deletedBy: string | null
  name: string
  regionId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  region: Region
}

export interface AreaResponse {
  success: true
  message: string
  data: Area[]
  totalCount: number
  currentPage: number
  limit: number
}

export interface Branch {
  id: string
  deletedBy: string | null
  name: string
  branchCode: string
  areaId: string
  districtId: string
  stateId: string
  bucketName: string
  createdAt: string
  updatedAt: string
  area: Area
  district: {
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  state: {
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  branchBucket: {
    id: string
    deletedBy: string | null
    name: string
    positionCategories: { designationName: string; count: number }[]
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

export interface BranchResponse {
  success: true
  message: string
  totalCount: number
  data: Branch[]
  page: number
  limit: number
}

export interface State {
  id: string
  deletedBy: string | null
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface StateResponse {
  success: true
  message: string
  data: State[]
  totalCount: number
  currentPage: number | string
  limit: number | string
}

export interface ApprovalMatrix {
  id: string
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  approvalCategoryId: string
  designation: string
  grade: string
  level: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ApprovalCategory {
  id: string
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  ApprovalMatrices: ApprovalMatrix[]
}

export interface ApprovalCategoryResponse {
  status: 'Success'
  message: string
  data: ApprovalCategory[]
  totalCount: number
  page: number
  limit: number
}

export interface TerritoryResponse {
  success: boolean
  message: string
  data: Array<{
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
  }>
  totalCount: number
  page: number
  limit: number
}

export interface ClusterResponse {
  success: boolean
  message: string
  data: Array<{
    id: string
    deletedBy: string | null
    name: string
    areaId: string
    createdAt: string
    updatedAt: string
  }>
  totalCount: number
  page: number
  limit: number
}

export interface CityResponse {
  success: boolean
  message: string
  data: Array<{
    id: string
    deletedBy: string | null
    name: string
    createdAt: string
    updatedAt: string
  }>
  totalCount: number
  page: number
  limit: number
}

export interface DepartmentBudgetResponse {
  data: {
    id: string
    jobTitle: string
    grade: string
    designation: string
    jobRole: string
    openings: number
    experienceMin: number
    experienceMax: number
    campusOrLateral: 'Campus' | 'Lateral'
    employeeCategory: string
    employeeType: 'Fulltime' | 'Parttime'
    hiringManager: string
    startingDate: string
    closingDate: string
    company: 'Muthoot Fincorp Ltd.' | 'Muthoot Papachan'
    businessUnit: string
    department: string
    territory: string
    zone: string
    region: string
    area: string
    cluster: string
    branch: string
    branchCode: string
    city: string
    state: string
    origin: 'MANUAL'
    status: 'Open' | 'Closed' | 'Pending'
    [key: string]: any // For additional fields
  }
}

export interface DepartmentBudgetVacancyResponse {
  data: {
    id: string
    jobTitle: string
    grade: string
    designation: string
    jobRole: string
    openings: number
    [key: string]: any // For additional fields
  }[]
  total: number
}
