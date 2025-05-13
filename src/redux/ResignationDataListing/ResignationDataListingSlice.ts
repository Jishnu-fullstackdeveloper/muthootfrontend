import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import type { ResignedEmployeesState, FetchResignedEmployeesParams } from '@/types/resignationDataListing'
import { API_ENDPOINTS } from '../ApiUrls/employeeApiUrls'

// Async thunk to fetch resigned employees
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

const resignedEmployeesSlice = createSlice({
  name: 'resignedEmployees',
  initialState: {
    employees: [],
    loading: false,
    error: null,
    totalCount: 0
  } as ResignedEmployeesState,
  reducers: {},
  extraReducers: builder => {
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
      })
  }
})

export default resignedEmployeesSlice.reducer
