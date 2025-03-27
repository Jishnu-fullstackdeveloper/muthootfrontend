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
  noOfOpenings?: number
  grade?: string
  designation?: string
  businessRole?: string
  experienceMin?: number
  experienceMax?: number
  campusLateral?: string
  employeeCategory?: string
  employeeType?: string
  hiringManager?: string
  startDate?: string
  closingDate?: string
  company?: string
  businessUnit?: string
  department?: string
  territory?: string
  zone?: string
  region?: string
  area?: string
  cluster?: string
  branch?: string
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
}
