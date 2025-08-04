import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/schedulerUrls' // Adjust the path as needed

// Import the interfaces
import type {
  SchedulerConfigListResponse,
  UpdateSchedulerConfigResponse,
  CreateSchedulerConfigResponse,
  SchedulerManagementState
} from '@/types/scheduler'

// Thunk for fetching scheduler config list
export const getSchedulerConfigList = createAsyncThunk<
  SchedulerConfigListResponse,
  { page: number; limit: number; search?: string }
>('schedulerManagement/getSchedulerConfigList', async ({ page, limit, search }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string } = { page, limit }

    if (search) params.search = search.trim()

    console.log('Sending API request for scheduler configs with params:', params)
    const response = await AxiosLib.get(API_ENDPOINTS.getSchedulerConfigListUrl, { params })

    console.log('API Response for scheduler configs:', response.data)

    return response.data // Matches the response: { data: [{ id, url, category, duration, isActive, params, lastRunAt, nextRunAt, cronExpression, createdAt, updatedAt, deletedAt }], total, page, limit, totalPages }
  } catch (error: any) {
    console.error('Fetch Scheduler Configs Error:', error)

    return rejectWithValue(error.response?.data?.message || 'Failed to fetch scheduler configs')
  }
})

// Thunk for updating a scheduler config
export const updateSchedulerConfig = createAsyncThunk<
  UpdateSchedulerConfigResponse,
  {
    id: string
    url: string
    category: string
    duration: number
    cronExpression: string
    params: { [key: string]: string }
    isActive: boolean
  }
>(
  'schedulerManagement/updateSchedulerConfig',
  async ({ id, url, category, duration, cronExpression, params, isActive }, { rejectWithValue }) => {
    try {
      const requestBody = { url, category, duration, cronExpression, params, isActive }

      console.log('Sending API request to update scheduler config for ID:', id, 'with body:', requestBody)
      const response = await AxiosLib.put(API_ENDPOINTS.updateSchedulerConfigUrl(id), requestBody)

      console.log('API Response for updating scheduler config:', response.data)

      return response.data
    } catch (error: any) {
      console.error('Update Scheduler Config Error:', error)

      return rejectWithValue(error.response?.data?.message || 'Failed to update scheduler config')
    }
  }
)

// Thunk for creating a scheduler config
export const createScheduler = createAsyncThunk<
  CreateSchedulerConfigResponse,
  {
    url: string
    category: string
    duration: number
    cronExpression: string
    params: { [key: string]: string }
    isActive: boolean
  }
>(
  'schedulerManagement/createScheduler',
  async ({ url, category, duration, cronExpression, params, isActive }, { rejectWithValue }) => {
    try {
      const requestBody = { url, category, duration, cronExpression, params, isActive }

      console.log('Sending API request to create scheduler config with body:', requestBody)
      const response = await AxiosLib.post(API_ENDPOINTS.createSchedulerConfigUrl, requestBody)

      console.log('API Response for creating scheduler config:', response.data)

      return response.data
    } catch (error: any) {
      console.error('Create Scheduler Config Error:', error)

      return rejectWithValue(error.response?.data?.message || 'Failed to create scheduler config')
    }
  }
)

// Create the slice
export const schedulerManagementSlice = createSlice({
  name: 'schedulerManagement',
  initialState: {
    schedulerConfigListLoading: false,
    schedulerConfigListSuccess: false,
    schedulerConfigListData: null,
    schedulerConfigListTotal: 0,
    schedulerConfigListFailure: false,
    schedulerConfigListFailureMessage: '',
    updateSchedulerConfigLoading: false,
    updateSchedulerConfigSuccess: false,
    updateSchedulerConfigData: null,
    updateSchedulerConfigFailure: false,
    updateSchedulerConfigFailureMessage: '',
    createSchedulerLoading: false,
    createSchedulerSuccess: false,
    createSchedulerData: null,
    createSchedulerFailure: false,
    createSchedulerFailureMessage: ''
  } as SchedulerManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, getSchedulerConfigList, 'schedulerConfigList')
    handleAsyncThunkStates(builder, updateSchedulerConfig, 'updateSchedulerConfig')
    handleAsyncThunkStates(builder, createScheduler, 'createScheduler')
  }
})

export const {} = schedulerManagementSlice.actions
export default schedulerManagementSlice.reducer
