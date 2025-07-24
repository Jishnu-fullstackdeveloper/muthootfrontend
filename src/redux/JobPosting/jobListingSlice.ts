import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { API_ENDPOINTS } from '../ApiUrls/jobPostingApiUrls'

import AxiosLib from '@/lib/AxiosLib'

// Thunk to fetch job postings
export const fetchJobPostings = createAsyncThunk(
  'jobPostings/fetchJobPostings',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchJobPostingsUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch job postings' })
    }
  }
)

// Thunk to fetch candidates for a job
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (params: { jobId?: string; page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchCandidatesUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch candidates' })
    }
  }
)

// Thunk to fetch job posting by ID
export const fetchJobPostingsById = createAsyncThunk(
  'jobPostings/fetchJobPostingsById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.fetchJobPostingsByIdUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch job posting by ID' })
    }
  }
)

export const JobPostingSlice = createSlice({
  name: 'JobPosting',
  initialState: {
    jobPostingsData: null,
    isJobPostingsLoading: false,
    jobPostingsSuccess: false,
    jobPostingsFailure: false,
    jobPostingsFailureMessage: '',

    candidatesData: null,
    isCandidatesLoading: false,
    candidatesSuccess: false,
    candidatesFailure: false,
    candidatesFailureMessage: '',

    jobPostingByIdData: null,
    isJobPostingByIdLoading: false,
    jobPostingByIdSuccess: false,
    jobPostingByIdFailure: false,
    jobPostingByIdFailureMessage: ''
  },
  reducers: {
    resetJobPostingsStatus: state => {
      state.isJobPostingsLoading = false
      state.jobPostingsSuccess = false
      state.jobPostingsFailure = false
      state.jobPostingsFailureMessage = ''
    },
    resetCandidatesStatus: state => {
      state.isCandidatesLoading = false
      state.candidatesSuccess = false
      state.candidatesFailure = false
      state.candidatesFailureMessage = ''
    },
    resetJobPostingByIdStatus: state => {
      // New reducer to reset job posting by ID status
      state.isJobPostingByIdLoading = false
      state.jobPostingByIdSuccess = false
      state.jobPostingByIdFailure = false
      state.jobPostingByIdFailureMessage = ''
    }
  },
  extraReducers: builder => {
    // Job Postings
    builder.addCase(fetchJobPostings.pending, state => {
      state.isJobPostingsLoading = true
      state.jobPostingsSuccess = false
      state.jobPostingsFailure = false
      state.jobPostingsFailureMessage = ''
    })
    builder.addCase(fetchJobPostings.fulfilled, (state, action) => {
      state.jobPostingsData = action.payload?.data || []
      state.isJobPostingsLoading = false
      state.jobPostingsSuccess = true
    })
    builder.addCase(fetchJobPostings.rejected, (state, action: any) => {
      state.isJobPostingsLoading = false
      state.jobPostingsSuccess = false
      state.jobPostingsFailure = true
      state.jobPostingsFailureMessage = action.payload?.message || 'Failed to fetch job postings'
    })

    // Candidates
    builder.addCase(fetchCandidates.pending, state => {
      state.isCandidatesLoading = true
      state.candidatesSuccess = false
      state.candidatesFailure = false
      state.candidatesFailureMessage = ''
    })
    builder.addCase(fetchCandidates.fulfilled, (state, action) => {
      state.candidatesData = action.payload?.data?.candidates || []
      state.isCandidatesLoading = false
      state.candidatesSuccess = true
    })
    builder.addCase(fetchCandidates.rejected, (state, action: any) => {
      state.isCandidatesLoading = false
      state.candidatesSuccess = false
      state.candidatesFailure = true
      state.candidatesFailureMessage = action.payload?.message || 'Failed to fetch candidates'
    })

    // Job Posting by ID
    builder.addCase(fetchJobPostingsById.pending, state => {
      state.isJobPostingByIdLoading = true
      state.jobPostingByIdSuccess = false
      state.jobPostingByIdFailure = false
      state.jobPostingByIdFailureMessage = ''
    })
    builder.addCase(fetchJobPostingsById.fulfilled, (state, action) => {
      state.jobPostingByIdData = action.payload?.data || null
      state.isJobPostingByIdLoading = false
      state.jobPostingByIdSuccess = true
    })
    builder.addCase(fetchJobPostingsById.rejected, (state, action: any) => {
      state.isJobPostingByIdLoading = false
      state.jobPostingByIdSuccess = false
      state.jobPostingByIdFailure = true
      state.jobPostingByIdFailureMessage = action.payload?.message || 'Failed to fetch job posting by ID'
    })
  }
})

export const { resetJobPostingsStatus, resetCandidatesStatus, resetJobPostingByIdStatus } = JobPostingSlice.actions

export default JobPostingSlice.reducer
