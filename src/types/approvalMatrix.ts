export interface LevelOption {
  id: string
  name: string
}

export interface ApprovalCategory {
  id: string
  name: string
  description: string
  approverType?: string
  createdBy?: string | null
  updatedBy?: string | null
  deletedBy?: string | null
  context?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface Designation {
  id: string
  name: string
}

export interface Grade {
  id: string
  name: string
}

export interface Section {
  designationName: Designation | null
  level: LevelOption | null
  grade: Grade | null
}

export interface ApprovalMatrixFormValues {
  id: string
  approvalCategory: ApprovalCategory | null
  numberOfLevels: number
  description: string
  sections: Section[]
  draggingIndex: number | null
}

export interface ApprovalMatrix {
  id: string
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
  approvalCategoryId: string
  approver: string
  grade: string
  level: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  approvalCategories: ApprovalCategory
}

export interface GroupedCategory {
  id: string
  approvalCategories: ApprovalMatrix['approvalCategories']
  matrices: ApprovalMatrix[]
}

export interface FormattedData {
  id: string
  approvalCategories: {
    id: string
    name: string
    description: string
  }
  approver: string[]
  grades: string[]
  level: number
  matrixIds: string[]
}

export interface PaginatedGroupedData {
  data: FormattedData[]
  totalCount: number
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface ApprovalMatrixState {
  approvalCategories: ApprovalCategory[]
  approvalMatrixData: ApprovalMatrix[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  totalItems: number
  options: Array<{ id: number; name: string }>
  designations: Designation[]
  grades: Grade[]
  page: number
  limit: number
  totalPages: number
  message: string
  createApprovalCategoryResponse: any
  updateApprovalCategoryResponse: any
  createApprovalMatrixResponse: any
  updateApprovalMatrixResponse: any
}
