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
}

export interface SchedulerConfigListResponse {
  statusCode: number
  message: string
  data: SchedulerConfig[]
  totalCount: number
  page: number
  limit: number
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

export interface SchedulerManagementState {
  schedulerConfigListLoading: boolean
  schedulerConfigListSuccess: boolean
  schedulerConfigListData: SchedulerConfig[] | null
  schedulerConfigListTotal: number
  schedulerConfigListFailure: boolean
  schedulerConfigListFailureMessage: string
  updateSchedulerConfigLoading: boolean
  updateSchedulerConfigSuccess: boolean
  updateSchedulerConfigData: SchedulerConfig | null
  updateSchedulerConfigFailure: boolean
  updateSchedulerConfigFailureMessage: string
  toggleSchedulerConfigLoading: boolean
  toggleSchedulerConfigSuccess: boolean
  toggleSchedulerConfigData: SchedulerConfig | null
  toggleSchedulerConfigFailure: boolean
  toggleSchedulerConfigFailureMessage: string
}
