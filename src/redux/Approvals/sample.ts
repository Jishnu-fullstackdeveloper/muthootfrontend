import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { getUserId } from '@/utils/functions'

// Fetch user designation
export const fetchUserDesignation = createAsyncThunk(
  'approvals/fetchUserDesignation',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId()

      console.log('Fetching user details for ID:', userId) // Debug log

      if (!userId) {
        return rejectWithValue('User ID not found')
      }

      const response = await axios.get(`/users/${userId}`)

      console.log('Full User API response:', JSON.stringify(response.data, null, 2)) // Debug log
      const userData = response.data.data || response.data || {} // Fallback to response.data if data is not nested
      const designation = userData.designation

      console.log('User data:', userData) // Debug log
      console.log('Extracted designation:', designation) // Debug log

      if (designation === undefined || designation === null) {
        console.warn('Designation is missing or null:', userData)

        return null // Handle missing or null designation
      }

      if (Array.isArray(designation)) {
        if (designation.length === 0) {
          console.warn('Designation array is empty:', designation)

          return null
        }

        return designation[0] // Return first designation
      }

      if (typeof designation === 'string') {
        console.log('Designation is a string:', designation)

        return designation // Handle string designation
      }

      console.warn('Designation has unexpected format:', designation)

      return null // Handle unexpected formats
    } catch (error) {
      console.error('Error fetching user designation:', error) // Debug log

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user designation')
    }
  }
)

// Fetch approvals data
export const fetchApprovals = createAsyncThunk(
  'approvals/fetchApprovals',
  async (
    {
      page,
      limit,
      search,
      approverDesignation
    }: { page: number; limit: number; search: string; approverDesignation: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get('/approval-service/approval-status', {
        params: { page, limit, search, approverDesignation }
      })

      console.log('Approvals API response:', response.data) // Debug log

      return response.data // Assumes API returns { data: [], totalCount: number }
    } catch (error) {
      console.error('Error fetching approvals:', error) // Debug log

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch approvals')
    }
  }
)

const approvalsSlice = createSlice({
  name: 'approvals',
  initialState: {
    userDesignation: null as string | null,
    approvalsData: [] as any[],
    isApprovalsLoading: false,
    totalCount: 0,
    error: null as string | null
  },
  reducers: {},
  extraReducers: builder => {
    builder

      // fetchUserDesignation
      .addCase(fetchUserDesignation.pending, state => {
        state.isApprovalsLoading = true
        state.error = null
      })
      .addCase(fetchUserDesignation.fulfilled, (state, action) => {
        state.userDesignation = action.payload
        state.isApprovalsLoading = false
      })
      .addCase(fetchUserDesignation.rejected, (state, action) => {
        state.isApprovalsLoading = false
        state.error = action.payload as string
      })

      // fetchApprovals
      .addCase(fetchApprovals.pending, state => {
        state.isApprovalsLoading = true
        state.error = null
      })
      .addCase(fetchApprovals.fulfilled, (state, action) => {
        state.approvalsData = action.payload.data
        state.totalCount = action.payload.totalCount
        state.isApprovalsLoading = false
      })
      .addCase(fetchApprovals.rejected, (state, action) => {
        state.isApprovalsLoading = false
        state.error = action.payload as string
      })
  }
})

export default approvalsSlice.reducer
