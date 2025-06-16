import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'

// Thunk for fetching user data by ID
export const fetchUser = createAsyncThunk('user/fetchUser', async (id: string, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.get(`/users/${id}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch user')
    }

    return response.data.data // Ensure data contains designation
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
  }
})

// Thunk for fetching approvals
export const fetchApprovals = createAsyncThunk(
  'approvals/fetchApprovals',
  async (
    {
      groupByCategory

      //approverDesignation
    }: { groupByCategory: boolean },
    { rejectWithValue }
  ) => {
    // if (!approverDesignation || typeof approverDesignation !== 'string') {
    //   return rejectWithValue('approverDesignation must be a non-empty string')
    // }

    try {
      const response = await AxiosLib.get('/approval-service/approval-status/report', {
        params: {
          groupByCategory

          //approverDesignation
        }
      })

      console.log('Approvals API response:', response.data) // Debug log (remove after testing)

      return response.data // Returns { status, message, data, approvalCount, totalCount, page, limit }
    } catch (error: any) {
      console.error('Error fetching approvals:', error) // Debug log

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch approvals')
    }
  }
)

// Create the slice
export const approvalsSlice = createSlice({
  name: 'approvals',
  initialState: {
    fetchUserLoading: false,
    fetchUserSuccess: false,
    fetchUserData: null,
    fetchUserFailure: false,
    fetchUserFailureMessage: '',
    fetchApprovalsLoading: false,
    fetchApprovalsSuccess: false,
    fetchApprovalsData: [],
    fetchApprovalsTotalCount: 0,
    fetchApprovalsFailure: false,
    fetchApprovalsFailureMessage: ''
  },
  reducers: {
    clearUser: state => {
      state.fetchUserData = null
      state.fetchUserSuccess = false
      state.fetchUserFailure = false
      state.fetchUserFailureMessage = ''
    },
    clearApprovals: state => {
      state.fetchApprovalsData = []
      state.fetchApprovalsSuccess = false
      state.fetchApprovalsFailure = false
      state.fetchApprovalsFailureMessage = ''
      state.fetchApprovalsTotalCount = 0
    }
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, fetchUser, 'fetchUser')
    handleAsyncThunkStates(builder, fetchApprovals, 'fetchApprovals')
  }
})

export const { clearUser, clearApprovals } = approvalsSlice.actions
export default approvalsSlice.reducer
