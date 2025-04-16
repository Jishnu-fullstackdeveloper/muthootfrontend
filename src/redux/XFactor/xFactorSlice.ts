import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/xFactor' // Adjusted to point to XFactor API endpoints

export const fetchXFactor = createAsyncThunk(
  'xFactor/fetchXFactor',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getXfactorUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const fetchDesignation = createAsyncThunk(
  'designation/fetchDesignation',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const createXFactor = createAsyncThunk(
  'xFactor/createXFactor',
  async (params: { data: { designationName: string; xFactor: number }[] }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.createXfactorUrl, params)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while creating X-Factor')
    }
  }
)

export const updateXFactor = createAsyncThunk(
  'xFactor/updateXFactor',
  async ({ id, data }: { id: string; data: { designationName: string; xFactor: number } }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.put(`/system-management/xfactor-config/${id}`, data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while updating X-Factor')
    }
  }
)

export const xFactorSlice = createSlice({
  name: 'xFactor',
  initialState: {
    xFactorData: [],
    totalCount: 0, // Total number of records
    isXFactorLoading: false,
    xFactorSuccess: false,
    xFactorFailure: false,
    xFactorFailureMessage: '',

    designationData: [],
    isDesignationLoading: false,
    designationSuccess: false,
    designationFailure: false,
    designationFailureMessage: '',

    isCreatingXFactor: false,
    createXFactorSuccess: false,
    createXFactorFailure: false,
    createXFactorFailureMessage: ''
  },
  reducers: {
    resetXFactorState: state => {
      state.isXFactorLoading = false
      state.xFactorSuccess = false
      state.xFactorFailure = false
      state.xFactorFailureMessage = ''
      state.createXFactorSuccess = false
      state.createXFactorFailure = false
      state.createXFactorFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchXFactor.pending, state => {
        state.isXFactorLoading = true
      })
      .addCase(fetchXFactor.fulfilled, (state, action) => {
        state.xFactorData = action.payload.data
        state.totalCount = action.payload.pagination.totalItems // Extract totalItems from the API response
        state.isXFactorLoading = false
        state.xFactorSuccess = true
      })
      .addCase(fetchXFactor.rejected, (state, action) => {
        state.isXFactorLoading = false
        state.xFactorFailure = true
        state.xFactorFailureMessage = action.payload || 'Failed to fetch X-Factor data'
      })

      .addCase(fetchDesignation.pending, state => {
        state.isDesignationLoading = true
        state.designationSuccess = false
        state.designationFailure = false
        state.designationFailureMessage = ''
      })
      .addCase(fetchDesignation.fulfilled, (state, action) => {
        state.isDesignationLoading = false
        state.designationSuccess = true
        state.designationData = action.payload.data
      })

      .addCase(fetchDesignation.rejected, (state, action) => {
        state.isDesignationLoading = false
        state.designationFailure = true
        state.designationFailureMessage = action.payload || 'Failed to fetch Designation data'
      })

      .addCase(createXFactor.pending, state => {
        state.isCreatingXFactor = true
        state.createXFactorSuccess = false
        state.createXFactorFailure = false
        state.createXFactorFailureMessage = ''
      })
      .addCase(createXFactor.fulfilled, (state, action) => {
        state.isCreatingXFactor = false
        state.createXFactorSuccess = true
        state.xFactorData.push(action.payload) // Add the new X-Factor to the list
      })
      .addCase(createXFactor.rejected, (state, action) => {
        state.isCreatingXFactor = false
        state.createXFactorFailure = true
        state.createXFactorFailureMessage = action.payload || 'Failed to create X-Factor'
      })
  }
})

export const { resetXFactorState } = xFactorSlice.actions
export default xFactorSlice.reducer
