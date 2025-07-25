import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/userRoles'

export const fetchDesignationRole = createAsyncThunk(
  'userRoles/fetchDesignationRole',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationRole, { params })

      return response.data // Ensure the full response.data is returned
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch designation roles' })
    }
  }
)

export const fetchDesignationRoleById = createAsyncThunk(
  'userManagement/fetchDesignationRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationRoleByIdUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Create the slice
export const userRoleSlice = createSlice({
  name: 'userRoles',
  initialState: {
    designationRoleData: {
      data: [],
      totalCount: 0
    },
    isDesignationRoleLoading: false,
    designationRoleSuccess: false,
    designationRoleFailure: false,
    designationRoleFailureMessage: '',

    selectedDesignationRoleData: null,
    isSelectedDesignationRoleLoading: false,
    selectedDesignationRoleSuccess: false,
    selectedDesignationRoleFailure: false,
    selectedDesignationRoleFailureMessage: ''
  },
  reducers: {
    fetchDesignationRoleDismiss: state => {
      state.isDesignationRoleLoading = false
      state.designationRoleSuccess = false
      state.designationRoleFailure = false
      state.designationRoleFailureMessage = ''
    },
    resetAddUserStatus: state => {
      state.designationRoleSuccess = false
      state.designationRoleFailure = false
      state.designationRoleFailureMessage = ''
    }
  },
  extraReducers: builder => {
    // Fetch Designation Role List
    builder
      .addCase(fetchDesignationRole.pending, state => {
        state.isDesignationRoleLoading = true
        state.designationRoleSuccess = false
        state.designationRoleFailure = false
        state.designationRoleFailureMessage = ''
      })
      .addCase(fetchDesignationRole.fulfilled, (state, action) => {
        state.designationRoleData = action.payload.data // Adjust based on actual response structure
        state.isDesignationRoleLoading = false
        state.designationRoleSuccess = true
        state.designationRoleFailure = false
        state.designationRoleFailureMessage = ''
      })
      .addCase(fetchDesignationRole.rejected, (state, action) => {
        state.isDesignationRoleLoading = false
        state.designationRoleData = { data: [], totalCount: 0 }
        state.designationRoleFailure = true
        state.designationRoleFailureMessage =
          (action.payload as any)?.message || 'Failed to fetch designation role data'
      })

    // Fetch Designation Role By ID
    builder
      .addCase(fetchDesignationRoleById.pending, state => {
        state.isSelectedDesignationRoleLoading = true
        state.selectedDesignationRoleSuccess = false
        state.selectedDesignationRoleFailure = false
        state.selectedDesignationRoleFailureMessage = ''
      })
      .addCase(fetchDesignationRoleById.fulfilled, (state, action) => {
        state.selectedDesignationRoleData = action.payload.data || null // Store the data field
        state.isSelectedDesignationRoleLoading = false
        state.selectedDesignationRoleSuccess = true
        state.selectedDesignationRoleFailure = false
        state.selectedDesignationRoleFailureMessage = ''
      })
      .addCase(fetchDesignationRoleById.rejected, (state, action) => {
        state.isSelectedDesignationRoleLoading = false
        state.selectedDesignationRoleData = null
        state.selectedDesignationRoleSuccess = false
        state.selectedDesignationRoleFailure = true
        state.selectedDesignationRoleFailureMessage =
          (action.payload as any)?.message || 'Failed to fetch designation role'
      })
  }
})

// Export actions
export const { fetchDesignationRoleDismiss, resetAddUserStatus } = userRoleSlice.actions

// Export reducer
export default userRoleSlice.reducer
