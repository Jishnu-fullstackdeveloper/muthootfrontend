// File: types/scheduler.ts

export interface SchedulerConfig {
  id: string
  deletedBy: string | null
  functionName: string
  duration: number
  isActive: boolean
  params: { [key: string]: string }
  lastRunAt: string
  nextRunAt: string
  schedule: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  totalCount?: any
  data?: any
}

export interface SchedulerConfigListResponse {
  data: Array<{
    id: string
    deletedBy: string | null
    url: string
    category: string
    duration: number
    isActive: boolean
    params: { [key: string]: string | number }
    lastRunAt: string | null
    nextRunAt: string
    cronExpression: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }>
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UpdateSchedulerConfigResponse {
  statusCode: number
  message: string
  data: SchedulerConfig
}

export interface ToggleSchedulerConfigResponse {
  statusCode: number
  message: string
  data: SchedulerConfig
}

export interface CreateSchedulerConfigResponse {
  success: boolean
  message: string
  data: {
    id: string
    url: string
    category: string
    duration: number
    cronExpression: string
    params: { [key: string]: string | number }
    isActive: boolean
    nextRunAt: string
    updatedAt: string
    createdAt: string
    deletedBy: string | null
    lastRunAt: string | null
    deletedAt: string | null
  }
}

export interface SchedulerManagementState {
  schedulerConfigListLoading: boolean
  schedulerConfigListSuccess: boolean
  schedulerConfigListData: SchedulerConfigListResponse['data'] | null
  schedulerConfigListTotal: number
  schedulerConfigListFailure: boolean
  schedulerConfigListFailureMessage: string
  updateSchedulerConfigLoading: boolean
  updateSchedulerConfigSuccess: boolean
  updateSchedulerConfigData: UpdateSchedulerConfigResponse | null
  updateSchedulerConfigFailure: boolean
  updateSchedulerConfigFailureMessage: string
  createSchedulerLoading: boolean
  createSchedulerSuccess: boolean
  createSchedulerData: CreateSchedulerConfigResponse | null
  createSchedulerFailure: boolean
  createSchedulerFailureMessage: string
}
