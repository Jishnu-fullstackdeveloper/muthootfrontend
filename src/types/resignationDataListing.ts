export type ViewMode = 'grid' | 'table'

export interface ResignedEmployee {
  id: string
  employeeCode: string
  firstName: string
  middleName?: string
  lastName: string
  designation: { name: string }
  department: { name: string }
  resignationDetails: {
    dateOfResignation: string
    lwd: string
    noticePeriod: string
    relievingDateAsPerNotice: string
    notes?: string
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
