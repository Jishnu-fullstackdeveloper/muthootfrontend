import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'

export const fetchJobPostingCustomList = createAsyncThunk(
  'JobPostingCustomList/fetchJobPostingCustomList',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/band-platform-mapping', { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch job postings' })
    }
  }
)

export const createBandPlatformMapping = createAsyncThunk(
  'JobPostingCustomList/createBandPlatformMapping',
  async (
    data: {
      band: string
      jobRole: string
      employeeCategory: string
      platformDetails: { platformName: string; priority: number; platformAge: number }[]
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.post('/band-platform-mapping', data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create band platform mapping' })
    }
  }
)

export const updateBandPlatformMapping = createAsyncThunk(
  'JobPostingCustomList/updateBandPlatformMapping',
  async (
    data: {
      id: string
      band: string
      jobRole: string
      employeeCategory: string
      platformDetails: { platformName: string; priority: number; platformAge: number }[]
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.put(`/band-platform-mapping/${data.id}`, {
        band: data.band,
        jobRole: data.jobRole,
        employeeCategory: data.employeeCategory,
        platformDetails: data.platformDetails
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update band platform mapping' })
    }
  }
)

export const deleteBandPlatformMapping = createAsyncThunk(
  'JobPostingCustomList/deleteBandPlatformMapping',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.delete(`/band-platform-mapping/${id}`)

      return { id, ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete band platform mapping' })
    }
  }
)

export const fetchBandPlatformMappingById = createAsyncThunk(
  'JobPostingCustomList/fetchBandPlatformMappingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`/band-platform-mapping/${id}`)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch band platform mapping by ID' })
    }
  }
)

export const JobPostingSlice = createSlice({
  name: 'JobPosting',
  initialState: {
    jobPostingCustomListData: null,
    isJobPostingCustomListLoading: false,
    jobPostingCustomListSuccess: false,
    jobPostingCustomListFailure: false,
    jobPostingCustomListFailureMessage: '',
    createBandPlatformMappingSuccess: false,
    createBandPlatformMappingFailure: false,
    createBandPlatformMappingFailureMessage: '',
    updateBandPlatformMappingSuccess: false,
    updateBandPlatformMappingFailure: false,
    updateBandPlatformMappingFailureMessage: '',
    deleteBandPlatformMappingSuccess: false,
    deleteBandPlatformMappingFailure: false,
    deleteBandPlatformMappingFailureMessage: '',
    fetchBandPlatformMappingByIdData: null,
    fetchBandPlatformMappingByIdSuccess: false,
    fetchBandPlatformMappingByIdFailure: false,
    fetchBandPlatformMappingByIdFailureMessage: ''
  },
  reducers: {
    resetJobPostingCustomListStatus: state => {
      state.isJobPostingCustomListLoading = false
      state.jobPostingCustomListSuccess = false
      state.jobPostingCustomListFailure = false
      state.jobPostingCustomListFailureMessage = ''
    },
    resetCreateBandPlatformMappingStatus: state => {
      state.createBandPlatformMappingSuccess = false
      state.createBandPlatformMappingFailure = false
      state.createBandPlatformMappingFailureMessage = ''
    },
    resetUpdateBandPlatformMappingStatus: state => {
      state.updateBandPlatformMappingSuccess = false
      state.updateBandPlatformMappingFailure = false
      state.updateBandPlatformMappingFailureMessage = ''
    },
    resetDeleteBandPlatformMappingStatus: state => {
      state.deleteBandPlatformMappingSuccess = false
      state.deleteBandPlatformMappingFailure = false
      state.deleteBandPlatformMappingFailureMessage = ''
    },
    resetFetchBandPlatformMappingByIdStatus: state => {
      state.fetchBandPlatformMappingByIdData = null
      state.fetchBandPlatformMappingByIdSuccess = false
      state.fetchBandPlatformMappingByIdFailure = false
      state.fetchBandPlatformMappingByIdFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJobPostingCustomList.pending, state => {
        state.isJobPostingCustomListLoading = true
        state.jobPostingCustomListSuccess = false
        state.jobPostingCustomListFailure = false
        state.jobPostingCustomListFailureMessage = ''
      })
      .addCase(fetchJobPostingCustomList.fulfilled, (state, action) => {
        state.isJobPostingCustomListLoading = false
        state.jobPostingCustomListSuccess = true
        state.jobPostingCustomListData = action.payload.data
      })
      .addCase(fetchJobPostingCustomList.rejected, (state, action) => {
        state.isJobPostingCustomListLoading = false
        state.jobPostingCustomListFailure = true
        state.jobPostingCustomListFailureMessage =
          typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'Failed to fetch job postings'
      })
      .addCase(createBandPlatformMapping.pending, state => {
        state.createBandPlatformMappingSuccess = false
        state.createBandPlatformMappingFailure = false
        state.createBandPlatformMappingFailureMessage = ''
      })
      .addCase(createBandPlatformMapping.fulfilled, state => {
        state.createBandPlatformMappingSuccess = true
      })
      .addCase(createBandPlatformMapping.rejected, (state, action) => {
        state.createBandPlatformMappingFailure = true
        state.createBandPlatformMappingFailureMessage =
          typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'Failed to create band platform mapping'
      })
      .addCase(updateBandPlatformMapping.pending, state => {
        state.updateBandPlatformMappingSuccess = false
        state.updateBandPlatformMappingFailure = false
        state.updateBandPlatformMappingFailureMessage = ''
      })
      .addCase(updateBandPlatformMapping.fulfilled, state => {
        state.updateBandPlatformMappingSuccess = true
      })
      .addCase(updateBandPlatformMapping.rejected, (state, action) => {
        state.updateBandPlatformMappingFailure = true
        state.updateBandPlatformMappingFailureMessage =
          typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'Failed to update band platform mapping'
      })
      .addCase(deleteBandPlatformMapping.pending, state => {
        state.deleteBandPlatformMappingSuccess = false
        state.deleteBandPlatformMappingFailure = false
        state.deleteBandPlatformMappingFailureMessage = ''
      })
      .addCase(deleteBandPlatformMapping.fulfilled, state => {
        state.deleteBandPlatformMappingSuccess = true
      })
      .addCase(deleteBandPlatformMapping.rejected, (state, action) => {
        state.deleteBandPlatformMappingFailure = true
        state.deleteBandPlatformMappingFailureMessage =
          typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'Failed to delete band platform mapping'
      })
      .addCase(fetchBandPlatformMappingById.pending, state => {
        state.fetchBandPlatformMappingByIdSuccess = false
        state.fetchBandPlatformMappingByIdFailure = false
        state.fetchBandPlatformMappingByIdFailureMessage = ''
      })
      .addCase(fetchBandPlatformMappingById.fulfilled, (state, action) => {
        state.fetchBandPlatformMappingByIdSuccess = true
        state.fetchBandPlatformMappingByIdData = action.payload
      })
      .addCase(fetchBandPlatformMappingById.rejected, (state, action) => {
        state.fetchBandPlatformMappingByIdFailure = true
        state.fetchBandPlatformMappingByIdFailureMessage =
          typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'Failed to fetch band platform mapping by ID'
      })
  }
})

export const {
  resetJobPostingCustomListStatus,
  resetCreateBandPlatformMappingStatus,
  resetUpdateBandPlatformMappingStatus,
  resetDeleteBandPlatformMappingStatus,
  resetFetchBandPlatformMappingByIdStatus
} = JobPostingSlice.actions
export default JobPostingSlice.reducer
