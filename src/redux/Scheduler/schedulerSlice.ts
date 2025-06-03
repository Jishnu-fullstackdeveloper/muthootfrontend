import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/schedulerUrls' // Adjust the path as needed

// Import the interfaces
import type {
  SchedulerConfigListResponse,
  UpdateSchedulerConfigResponse,
  ToggleSchedulerConfigResponse,
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

    return response.data
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
    functionName: string
    schedule: string
    duration: number
    isActive: boolean
    params: { [key: string]: string }
  }
>(
  'schedulerManagement/updateSchedulerConfig',
  async ({ id, functionName, schedule, duration, isActive, params }, { rejectWithValue }) => {
    try {
      const requestBody = { functionName, schedule, duration, isActive, params }

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

// Thunk for toggling a scheduler config's active status
export const toggleSchedulerConfig = createAsyncThunk<ToggleSchedulerConfigResponse, { id: string; isActive: boolean }>(
  'schedulerManagement/toggleSchedulerConfig',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const requestBody = { isActive }

      console.log('Sending API request to toggle scheduler config for ID:', id, 'with body:', requestBody)
      const response = await AxiosLib.put(API_ENDPOINTS.toggleSchedulerConfigUrl(id), requestBody)

      console.log('API Response for toggling scheduler config:', response.data)

      return response.data
    } catch (error: any) {
      console.error('Toggle Scheduler Config Error:', error)

      return rejectWithValue(error.response?.data?.message || 'Failed to toggle scheduler config')
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
    toggleSchedulerConfigLoading: false,
    toggleSchedulerConfigSuccess: false,
    toggleSchedulerConfigData: null,
    toggleSchedulerConfigFailure: false,
    toggleSchedulerConfigFailureMessage: ''
  } as SchedulerManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, getSchedulerConfigList, 'schedulerConfigList')
    handleAsyncThunkStates(builder, updateSchedulerConfig, 'updateSchedulerConfig')
    handleAsyncThunkStates(builder, toggleSchedulerConfig, 'toggleSchedulerConfig')
  }
})

export const {} = schedulerManagementSlice.actions
export default schedulerManagementSlice.reducer
