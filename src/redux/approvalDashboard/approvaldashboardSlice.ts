import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface ApprovalItem {
  payroll_input_id: string
  payroll_config: string
  month: string
  year: number
  status: 'Pending' | 'Approved' | 'Rejected'
  remarks: string | null
  type: string
}

interface ConfigItem {
  payroll_input_config_id: string
  name: string
  type: string
}

interface ApprovalData {
  configs: ConfigItem[]
  payroll_inputs: ApprovalItem[]
}

interface ApprovalState {
  data: ApprovalData | null
  loading: boolean
  error: string | null
  filters: {
    search: string
    department: string
    status: string
  }
}

const initialState: ApprovalState = {
  data: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    department: 'All',
    status: 'All'
  }
}

// Async thunk to fetch approval data
export const fetchApprovalData = createAsyncThunk(
  'approval/fetchData',
  async (employeeCode: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://payroll-dev.gnxsolutions.app/api/v1/approval/approver/review/?employeeCode=${employeeCode}`
      )
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch approval data'
      return rejectWithValue(errorMessage)
    }
  }
)

const approvalSlice = createSlice({
  name: 'approval',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload
    },
    setDepartmentFilter: (state, action) => {
      state.filters.department = action.payload
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload
    },
    resetFilters: state => {
      state.filters = initialState.filters
    },
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchApprovalData.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchApprovalData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchApprovalData.rejected, (state, action) => {
        state.loading = false
        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else {
          state.error = 'An unknown error occurred'
        }
      })
  }
})

export const { setSearchFilter, setDepartmentFilter, setStatusFilter, resetFilters, clearError } = approvalSlice.actions
export default approvalSlice.reducer
