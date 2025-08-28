import dayjs from 'dayjs'

export type EmployeeDetails = {
  employee_id?: string
  employee_code?: string
  employee_name?: string
} | null

export type PayrollConfig = {
  payroll_config_id: string
  name: string
  type: string
  input_type: string
  department: string
}

export type IncentiveRow = {
  id: number
  employeeCode: string
  remarks: string
  amount: string
  attachment: File | null
  error?: string
  employeeDetails?: EmployeeDetails
  loading?: boolean
}

export type TaskStatus = {
  task_id: string
  status: string
  ready: boolean
  progress: number
  result?: {
    success: boolean
    payroll_input_id: string
    total_rows: number
    unique_employees: number
    total_amount: number
    progress: number
  }
}

export type PayrollState = {
  file: File | null
  selectedDate: dayjs.Dayjs | null
  incentiveType: string
  mode: 'bulk' | 'manual' | null
  loading: boolean
  error: string | null
  successMessage: string | null
  rows: IncentiveRow[]
  rowIdCounter: number
  taskId: string | null
  taskStatus: TaskStatus | null
  isProcessing: boolean
  payrollConfigs: PayrollConfig[]
}
