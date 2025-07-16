import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/positionMatrixApiUrls'

export interface PositionBudgetState {
  positionMatrixData: any[]
  totalCount: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  page: number
  limit: number
}

const initialState: PositionBudgetState = {
  positionMatrixData: [],
  totalCount: 0,
  status: 'idle',
  error: null,
  page: 1,
  limit: 10
}

// Fetch position matrix data
export const fetchPositionMatrix = createAsyncThunk(
  'positionBudget/fetchPositionMatrix',
  async (params: { page: number; limit: number; filterType?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getPositionMatrixUrl, {
        params: {
          ...params,
          filterType: params.filterType ? params.filterType.toLowerCase() : undefined
        }
      })

      const { data = [], pagination = { totalCount: 0 } } = response.data || {}

      return { data, totalCount: pagination.totalCount, page: params.page, limit: params.limit }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch position matrix data')
    }
  }
)

// Create position matrix data
export const createPositionMatrix = createAsyncThunk(
  'positionBudget/createPositionMatrix',
  async (
    data: {
      expectedCount: number
      actualCount: number
      additionalCount: number
      temporaryCount: number
      employeeCodes: string[]
      employees: any[]
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createPositionMatrixUrl, data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create position matrix data')
    }
  }
)

// Create employee count data
export const createEmployeeCount = createAsyncThunk(
  'positionBudget/createEmployeeCount',
  async (
    data: {
      expectedCount: number
      actualCount: number
      additionalCount: number
      temporaryCount: number
      employeeCodes: string[]
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createEmployeeCountUrl, data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create employee count data')
    }
  }
)

const positionBudgetSlice = createSlice({
  name: 'positionBudget',
  initialState,
  reducers: {
    resetPositionBudgetState: state => {
      state.status = 'idle'
      state.error = null
      state.positionMatrixData = []
      state.totalCount = 0
      state.page = 1
      state.limit = 10
    }
  },
  extraReducers: builder => {
    builder

      // Fetch Position Matrix
      .addCase(fetchPositionMatrix.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchPositionMatrix.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.positionMatrixData = action.payload.data
        state.totalCount = action.payload.totalCount
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.error = null
      })
      .addCase(fetchPositionMatrix.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Create Position Matrix
      .addCase(createPositionMatrix.pending, state => {
        state.status = 'loading'
      })
      .addCase(createPositionMatrix.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.positionMatrixData.push(action.payload)
        state.totalCount += 1
        state.error = null
      })
      .addCase(createPositionMatrix.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Create Employee Count
      .addCase(createEmployeeCount.pending, state => {
        state.status = 'loading'
      })
      .addCase(createEmployeeCount.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.positionMatrixData.push(action.payload)
        state.totalCount += 1
        state.error = null
      })
      .addCase(createEmployeeCount.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { resetPositionBudgetState } = positionBudgetSlice.actions
export default positionBudgetSlice.reducer
