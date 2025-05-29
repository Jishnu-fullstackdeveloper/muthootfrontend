export type Section = {
  level: any
  designationName: { id: string; name: string } | null // Updated id to string to match API
  grade: { id: string; name: string } | null // Updated id to string to match API
}

export type ApprovalMatrixFormValues = {
  id: string
  approvalCategory: string
  numberOfLevels: number
  description: string
  sections: Section[]
  draggingIndex: number | null
}

// approvalMatrixTypes.ts

// Type for the Approval Matrix data (based on the API response structure)
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
  approvalCategories: {
    id: string
    createdBy: string | null
    updatedBy: string | null
    deletedBy: string | null
    name: string
    description: string
    approverType: string
    context: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

// Type for the grouped structure by approvalCategoryId
export interface GroupedCategory {
  id: string
  approvalCategories: ApprovalMatrix['approvalCategories']
  matrices: ApprovalMatrix[]
}

// Type for the formatted data used in the table
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

// Type for the Redux state slice
export interface ApprovalMatrixState {
  approvalMatrixData: ApprovalMatrix[]
  status: 'loading' | 'failed' | 'succeeded'
}

// Type for the paginated grouped data
export interface PaginatedGroupedData {
  data: FormattedData[]
  totalCount: number
}

// Type for pagination state
export interface PaginationState {
  pageIndex: number
  pageSize: number
}
