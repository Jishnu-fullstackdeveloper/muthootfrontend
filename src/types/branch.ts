export interface ViewBranchProps {
  mode: string
  id: string
  branchTab: string
}

export interface Branch {
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
  branchListData: Branch[] | null // Allow null to handle initial state or errors
  branchListLoading: boolean
  branchListSuccess: boolean
  branchListTotal: number
  branchListFailure: boolean
  branchListFailureMessage: string
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
