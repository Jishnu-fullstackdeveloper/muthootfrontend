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

export interface ResignedEmployeesState {
  employees: ResignedEmployee[]
  loading: boolean
  error: string | null
  totalCount: number
}

export interface FetchResignedEmployeesParams {
  page: number
  limit: number
  isResigned: boolean
  search?: string
  resignationDateFrom?: string
}
