import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { handleAsyncThunkStates } from '@/utils/functions'
import { API_ENDPOINTS } from '../ApiUrls/budget'
import type { BudgetDepartmentResponse, BudgetManagementState } from '@/types/budget'

// Thunk for fetching budget department data
export const fetchBudgetDepartment = createAsyncThunk<
  BudgetDepartmentResponse,
  { search?: string; page: number; limit: number }
>('budgetManagement/fetchBudgetDepartment', async ({ search, page, limit }, { rejectWithValue }) => {
  try {
    const params: { page: number; limit: number; search?: string } = { page, limit }

    if (search) params.search = search

    const response = await AxiosLib.get(API_ENDPOINTS.fetchBudgetDepartmentUrl, { params })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

// Create the slice
export const budgetManagementSlice = createSlice({
  name: 'budgetManagement',
  initialState: {
    fetchBudgetDepartmentLoading: false,
    fetchBudgetDepartmentSuccess: false,
    fetchBudgetDepartmentData: null,
    fetchBudgetDepartmentTotal: 0,
    fetchBudgetDepartmentFailure: false,
    fetchBudgetDepartmentFailureMessage: ''
  } as BudgetManagementState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: builder => {
    handleAsyncThunkStates(builder, fetchBudgetDepartment, 'fetchBudgetDepartment')
  }
})

export const {} = budgetManagementSlice.actions
export default budgetManagementSlice.reducer
