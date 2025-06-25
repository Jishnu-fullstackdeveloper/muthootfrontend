import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/noticePeriodApiUrls'
import type { NoticePeriodState } from '@/types/noticePeriod'

const initialState: NoticePeriodState = {
  resignedData: [],
  resignedTotalCount: 0,
  resignedStatus: 'idle',
  vacancyData: [],
  vacancyTotalCount: 0,
  vacancyStatus: 'idle',
  updateStatus: 'idle',
  createStatus: 'idle',
  deleteStatus: 'idle',
  error: null,
  updateResponse: null,
  createResponse: null,
  deleteResponse: null,
  page: 1,
  limit: 10
}

// Fetch notice period data for a specific type (resigned or vacancy)
export const fetchNoticePeriod = createAsyncThunk(
  'noticePeriod/fetchNoticePeriod',
  async (
    params: { page: number; limit: number; search?: string; type: 'resigned' | 'vacancy' },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getNoticePeriodUrl, { params })
      const { data = [], pagination = { totalItems: 0 } } = response.data || {}

      return { data, totalItems: pagination.totalItems, type: params.type, page: params.page, limit: params.limit }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch notice period data')
    }
  }
)

// Update notice period data for a specific ID
export const updateNoticePeriod = createAsyncThunk(
  'noticePeriod/updateNoticePeriod',
  async (
    {
      id,
      data,
      type
    }: { id: string; data: { minDays: number; maxDays: number; xFactor: number }; type: 'resigned' | 'vacancy' },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.put(API_ENDPOINTS.updateNoticePeriodUrl(id), { ...data, type })

      return { data: response.data.data, type }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update notice period')
    }
  }
)

// Add create notice period data
export const createNoticePeriod = createAsyncThunk(
  'noticePeriod/createNoticePeriod',
  async (
    { data, type }: { data: { minDays: number; maxDays: number; xFactor: number }; type: 'resigned' | 'vacancy' },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createNoticePeriodUrl, { ...data, type })

      return { data: response.data.data, type }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create notice period')
    }
  }
)

// Delete notice period data for a specific ID
export const deleteNoticePeriod = createAsyncThunk(
  'noticePeriod/deleteNoticePeriod',
  async ({ id, type }: { id: string; type: 'resigned' | 'vacancy' }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.delete(API_ENDPOINTS.deleteNoticePeriodUrl(id))

      return { id, type, data: response.data.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete notice period')
    }
  }
)

const noticePeriodSlice = createSlice({
  name: 'noticePeriod',
  initialState,
  reducers: {
    resetNoticePeriodState: state => {
      state.resignedStatus = 'idle'
      state.vacancyStatus = 'idle'
      state.updateStatus = 'idle'
      state.createStatus = 'idle'
      state.deleteStatus = 'idle'
      state.error = null
      state.updateResponse = null
      state.createResponse = null
      state.deleteResponse = null
    }
  },
  extraReducers: builder => {
    builder

      // Fetch Notice Period
      .addCase(fetchNoticePeriod.pending, (state, action) => {
        const type = action.meta.arg.type

        if (type === 'resigned') {
          state.resignedStatus = 'loading'
        } else {
          state.vacancyStatus = 'loading'
        }
      })
      .addCase(fetchNoticePeriod.fulfilled, (state, action) => {
        const { data, totalItems, type, page, limit } = action.payload

        if (type === 'resigned') {
          state.resignedStatus = 'succeeded'
          state.resignedData = data
          state.resignedTotalCount = totalItems
          state.page = page
          state.limit = limit
          state.error = null
        } else {
          state.vacancyStatus = 'succeeded'
          state.vacancyData = data
          state.vacancyTotalCount = totalItems
          state.page = page
          state.limit = limit
          state.error = null
        }
      })
      .addCase(fetchNoticePeriod.rejected, (state, action) => {
        const type = action.meta.arg.type

        if (type === 'resigned') {
          state.resignedStatus = 'failed'
          state.error = action.payload as string
        } else {
          state.vacancyStatus = 'failed'
          state.error = action.payload as string
        }
      })

      // Update Notice Period
      .addCase(updateNoticePeriod.pending, state => {
        state.updateStatus = 'loading'
        state.updateResponse = null
      })
      .addCase(updateNoticePeriod.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateResponse = action.payload.data
        const { type, data } = action.payload

        if (type === 'resigned') {
          state.resignedData = state.resignedData.map(item => (item.id === data.id ? data : item))
        } else {
          state.vacancyData = state.vacancyData.map(item => (item.id === data.id ? data : item))
        }
      })
      .addCase(updateNoticePeriod.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.error = action.payload as string
        state.updateResponse = null
      })

      // Create Notice Period
      .addCase(createNoticePeriod.pending, state => {
        state.createStatus = 'loading'
        state.createResponse = null
      })
      .addCase(createNoticePeriod.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createResponse = action.payload.data
        const { type, data } = action.payload

        if (type === 'resigned') {
          state.resignedData.push(data)
          state.resignedTotalCount += 1
        } else {
          state.vacancyData.push(data)
          state.vacancyTotalCount += 1
        }
      })
      .addCase(createNoticePeriod.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.payload as string
        state.createResponse = null
      })

      // Delete Notice Period
      .addCase(deleteNoticePeriod.pending, state => {
        state.deleteStatus = 'loading'
        state.deleteResponse = null
      })
      .addCase(deleteNoticePeriod.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.deleteResponse = action.payload.data
        const { id, type } = action.payload

        if (type === 'resigned') {
          state.resignedData = state.resignedData.filter(item => item.id !== id)
          state.resignedTotalCount -= 1
        } else {
          state.vacancyData = state.vacancyData.filter(item => item.id !== id)
          state.vacancyTotalCount -= 1
        }
      })
      .addCase(deleteNoticePeriod.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.error = action.payload as string
        state.deleteResponse = null
      })
  }
})

export const { resetNoticePeriodState } = noticePeriodSlice.actions
export default noticePeriodSlice.reducer
