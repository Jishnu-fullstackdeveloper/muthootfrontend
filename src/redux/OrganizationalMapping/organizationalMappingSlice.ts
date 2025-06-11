import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/OrganizationalMapping'

// Type definitions for better type safety
interface FetchParams {
  [key: string]: any // Replace with specific params if known
}

// Async thunk for fetching designations
export const fetchDesignation = createAsyncThunk(
  'organizationalMapping/fetchDesignation',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationsUrl, { params })

      return response.data // Return only the data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' })
    }
  }
)

// Async thunk for fetching departments
export const fetchDepartment = createAsyncThunk(
  'organizationalMapping/fetchDepartment',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDepartmentsUrl, { params })

      return response.data // Return only the data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' })
    }
  }
)

// Async thunk for fetching department-designation mappings
export const fetchDepartmentDesignation = createAsyncThunk(
  'organizationalMapping/fetchDepartmentDesignation',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDepartmentDesignationUrl, { params })

      return response.data // Return only the data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' })
    }
  }
)

export const addDepartmentDesignation = createAsyncThunk<any, any>(
  'organizationalMapping/addDepartmentDesignation',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.addDepartmentDesignationUrl, params)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add role'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode || 500
      })
    }
  }
)

export const updateDepartmentDesignation = createAsyncThunk(
  'organizationalMapping/updateDepartmentDesignation',
  async (
    { id, data }: { id: string; data: { designationName: string; departmentIds: string[]; locationType: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await AxiosLib.put(API_ENDPOINTS.updateDepartmentDesignationUrl(id), data)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while updating X-Factor')
    }
  }
)

// Initial state
const initialState = {
  designationData: null,
  isDesignationLoading: false,
  designationSuccess: false,
  designationFailure: false,
  designationFailureMessage: '',

  departmentData: null,
  isDepartmentLoading: false,
  departmentSuccess: false,
  departmentFailure: false,
  departmentFailureMessage: '',

  departmentDesignationData: null,
  isDepartmentDesignationLoading: false,
  departmentDesignationSuccess: false,
  departmentDesignationFailure: false,
  departmentDesignationFailureMessage: '',

  addDepartmentDesignationData: null,
  isAddDepartmentDesignationLoading: false,
  addDepartmentDesignationSuccess: false,
  addDepartmentDesignationFailure: false,
  addDepartmentDesignationFailureMessage: ''
}

// Slice
const organizationalMappingSlice = createSlice({
  name: 'organizationalMapping',
  initialState,
  reducers: {
    fetchDesignationDismiss: state => {
      state.isDesignationLoading = false
      state.designationSuccess = false
      state.designationFailure = false
      state.designationFailureMessage = ''
    },
    fetchDepartmentDismiss: state => {
      state.isDepartmentLoading = false
      state.departmentSuccess = false
      state.departmentFailure = false
      state.departmentFailureMessage = ''
    },
    fetchDepartmentDesignationDismiss: state => {
      state.isDepartmentDesignationLoading = false
      state.departmentDesignationSuccess = false
      state.departmentDesignationFailure = false
      state.departmentDesignationFailureMessage = ''
    },
    resetAddDepartmentDesignationStatus: state => {
      state.isAddDepartmentDesignationLoading = false
      state.addDepartmentDesignationSuccess = false
      state.addDepartmentDesignationFailure = false
      state.addDepartmentDesignationFailureMessage = ''
    }
  },
  extraReducers: builder => {
    // Designation cases
    builder
      .addCase(fetchDesignation.pending, state => {
        state.isDesignationLoading = true
        state.designationSuccess = false
        state.designationFailure = false
        state.designationFailureMessage = ''
      })
      .addCase(fetchDesignation.fulfilled, (state, action) => {
        state.designationData = action.payload
        state.isDesignationLoading = false
        state.designationSuccess = true
      })
      .addCase(fetchDesignation.rejected, (state, action) => {
        state.isDesignationLoading = false
        state.designationData = null
        state.designationFailure = true
        state.designationFailureMessage =
          (action.payload as { message?: string })?.message || 'Fetching Designations Failed'
      })
      .addCase(addDepartmentDesignation.pending, state => {
        state.isAddDepartmentDesignationLoading = true
        state.addDepartmentDesignationSuccess = false
        state.addDepartmentDesignationFailure = false
        state.addDepartmentDesignationFailureMessage = ''
      })

    // Department cases
    builder
      .addCase(fetchDepartment.pending, state => {
        state.isDepartmentLoading = true
        state.departmentSuccess = false
        state.departmentFailure = false
        state.departmentFailureMessage = ''
      })
      .addCase(fetchDepartment.fulfilled, (state, action) => {
        state.departmentData = action.payload
        state.isDepartmentLoading = false
        state.departmentSuccess = true
      })
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.isDepartmentLoading = false
        state.departmentData = null
        state.departmentFailure = true
        state.departmentFailureMessage =
          (action.payload as { message?: string })?.message || 'Fetching Departments Failed'
      })

    // Department-Designation cases
    builder
      .addCase(fetchDepartmentDesignation.pending, state => {
        state.isDepartmentDesignationLoading = true
        state.departmentDesignationSuccess = false
        state.departmentDesignationFailure = false
        state.departmentDesignationFailureMessage = ''
      })
      .addCase(fetchDepartmentDesignation.fulfilled, (state, action) => {
        state.departmentDesignationData = action.payload
        state.isDepartmentDesignationLoading = false
        state.departmentDesignationSuccess = true
      })
      .addCase(fetchDepartmentDesignation.rejected, (state, action) => {
        state.isDepartmentDesignationLoading = false
        state.departmentDesignationData = null
        state.departmentDesignationFailure = true
        state.departmentDesignationFailureMessage =
          (action.payload as { message?: string })?.message || 'Fetching Department-Designation Mappings Failed'
      })
      .addCase(addDepartmentDesignation.fulfilled, (state, action) => {
        state.isAddDepartmentDesignationLoading = false
        state.addDepartmentDesignationSuccess = true
        state.addDepartmentDesignationFailure = false
        state.addDepartmentDesignationData = action.payload
      })
  }
})

export const { fetchDesignationDismiss, fetchDepartmentDismiss, fetchDepartmentDesignationDismiss } =
  organizationalMappingSlice.actions
export default organizationalMappingSlice.reducer
