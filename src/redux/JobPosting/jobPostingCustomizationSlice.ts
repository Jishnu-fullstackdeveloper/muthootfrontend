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

export const JobPostingSlice = createSlice({
  name: 'JobPosting',
  initialState: {
    jobPostingCustomListData: null,
    isJobPostingCustomListLoading: false,
    jobPostingCustomListSuccess: false,
    jobPostingCustomListFailure: false,
    jobPostingCustomListFailureMessage: ''
  },
  reducers: {
    resetJobPostingCustomListStatus: state => {
      state.isJobPostingCustomListLoading = false
      state.jobPostingCustomListSuccess = false
      state.jobPostingCustomListFailure = false
      state.jobPostingCustomListFailureMessage = ''
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
        state.jobPostingCustomListData = action.payload
      })
      .addCase(fetchJobPostingCustomList.rejected, (state, action) => {
        state.isJobPostingCustomListLoading = false
        state.jobPostingCustomListFailure = true
        state.jobPostingCustomListFailureMessage =
          typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'Failed to fetch job postings'
      })
  }
})

export const { resetJobPostingCustomListStatus } = JobPostingSlice.actions
export default JobPostingSlice.reducer
