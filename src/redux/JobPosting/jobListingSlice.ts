import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'

// Thunk to fetch job postings
export const fetchJobPostings = createAsyncThunk(
  'jobPostings/fetchJobPostings',
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/job-management', { params })

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
      const response = await AxiosLib.get('/candidate-management', { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch candidates' })
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
    candidatesFailureMessage: ''
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
  }
})

export const { resetJobPostingsStatus, resetCandidatesStatus } = JobPostingSlice.actions

export default JobPostingSlice.reducer
