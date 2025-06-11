import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '@/redux/ApiUrls/employeeApiUrls'
import type { ResignedEmployee } from '@/types/resignationDataListing'

// Define params interface for fetching resigned employees
interface FetchResignedEmployeesParams {
  page: number
  limit: number
  isResigned?: boolean
  search?: string
  resignationDateFrom?: string
}

// Define the state interface
interface ResignationDataListingState {
  employees: ResignedEmployee[]
  loading: boolean
  error: string | null
  totalCount: number
  syncLoading: boolean
  syncError: string | null
  syncProcessId: string | null
  selectedEmployee: ResignedEmployee | null // Add selectedEmployee to store the fetched employee
}

// Define initial state
const initialState: ResignationDataListingState = {
  employees: [],
  loading: false,
  error: null,
  totalCount: 0,
  syncLoading: false,
  syncError: null,
  syncProcessId: null,
  selectedEmployee: null // Initialize selectedEmployee
}

// Existing thunk to fetch resigned employees (unchanged)
export const fetchResignedEmployees = createAsyncThunk(
  'resignedEmployees/fetchResignedEmployees',
  async (
    { page, limit, isResigned, search, resignationDateFrom }: FetchResignedEmployeesParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.EMPLOYEES, {
        params: {
          page,
          limit,
          isResigned,
          search,
          resignationDateFrom
        }
      })

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch resigned employees')
      }

      return {
        employees: response.data.data,
        totalCount: response.data.totalCount
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while fetching resigned employees')
    }
  }
)

// New thunk to fetch a single employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'resignedEmployees/fetchEmployeeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(`${API_ENDPOINTS.EMPLOYEES}/${id}`)

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch employee details')
      }

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while fetching employee details')
    }
  }
)

// Existing thunk for syncing resigned employees (unchanged)
export const syncResignedEmployees = createAsyncThunk(
  'resignedEmployees/syncResignedEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.SYNC_RESIGNED_EMPLOYEES)

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to sync resigned employees')
      }

      return {
        message: response.data.message,
        processId: response.data.processId
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while syncing resigned employees')
    }
  }
)

// Create the slice
const resignationDataListingSlice = createSlice({
  name: 'resignationDataListing',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Fetch resigned employees
    builder
      .addCase(fetchResignedEmployees.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResignedEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload.employees
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchResignedEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.employees = []
        state.totalCount = 0
      })

    // Fetch single employee by ID
    builder
      .addCase(fetchEmployeeById.pending, state => {
        state.loading = true
        state.error = null
        state.selectedEmployee = null
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedEmployee = action.payload
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.selectedEmployee = null
      })

    // Sync resigned employees
    builder
      .addCase(syncResignedEmployees.pending, state => {
        state.syncLoading = true
        state.syncError = null
        state.syncProcessId = null
      })
      .addCase(syncResignedEmployees.fulfilled, (state, action) => {
        state.syncLoading = false
        state.syncProcessId = action.payload.processId
      })
      .addCase(syncResignedEmployees.rejected, (state, action) => {
        state.syncLoading = false
        state.syncError = action.payload as string
      })
  }
})

export default resignationDataListingSlice.reducer
