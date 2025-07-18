export type ViewMode = 'grid' | 'table'

export interface ResignedEmployee {
  id: string
  employeeCode: string
  firstName: string
  middleName?: string
  lastName: string
  designation: { name: string }
  department: { name: string }
  dateOfJoining?: any
  groupDateOfJoining?: any
  spurious?: any
  grade?: any
  band?: any
  location?: any
  l1Manager?: any
  l2Manager?: any
  hrManager?: any
  officialEmail?: any
  personalEmail?: any
  confirmationStatus?: any
  leaveBalanceOnLWD?: any
  correspondenceEmail?: any
  correspondenceNumber?: any
  correspondenceAddress?: any
  employeeDetails?: any
  officeEmailAddress?: any
  personalEmailAddress?: any
  companyStructure: {
    branchCode?: any
  }
  emergencyContact: {
    emergencyContactMobilePhone?: any
  }
  managementHierarchy: {
    l1Manager?: any
    l2Manager?: any
    hrManager?: any
  }
  address: {
    residenceAddressLine1?: any
    residenceAddressLine2?: any
    residenceCity?: any
    residenceState?: any
    residenceCountry?: any
    residencePostalCode?: any
  }
  actions?: any
  resignationDetails: {
    dateOfResignation: string
    lwd: string
    noticePeriod: string
    relievingDateAsPerNotice: string
    notes?: string
    resignationCode?: any
    stage?: any
    status?: any
  }
}

export interface FetchResignedEmployeesParams {
  page: number
  limit: number
  isResigned: boolean
  search?: string
  resignationDateFrom?: string
}

export interface ResignedEmployeesState {
  employees: ResignedEmployee[]
  loading: boolean
  error: string | null
  totalCount: number
  syncLoading: boolean // New field for sync API loading state
  syncError: string | null // New field for sync API error
  syncProcessId: string | null // New field to store the process ID from sync
}

export interface ResignationData {
  designationId: string
  designationName: string
  departmentId: string
  departmentName: string
  branchName: string
  count: number
}
