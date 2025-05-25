import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/userRoles'

// Define interfaces for type safety
interface UserRoleState {
  userRoleData: { data: any[] } | null
  isUserRoleLoading: boolean
  userRoleSuccess: boolean
  userRoleFailure: boolean
  userRoleFailureMessage: string
  isAddUserRoleLoading: boolean
  addUserRoleSuccess: boolean
  addUserRoleFailure: boolean
  addUserRoleFailureMessage: string
  designationData: { data: any[] } | null
  isDesignationLoading: boolean
  designationSuccess: boolean
  designationFailure: boolean
  designationFailureMessage: string
}

interface AddUserRoleParams {
  designation: string
  des_role_description: string
  group_designation: string
  grp_role_description: string
  permissions: string[]
}

interface UpdateUserRoleParams {
  id: string // Designation ID
  groupRoleId?: string // Group role ID (for group role-wise editing)
  params: {
    designation: string
    newGroupDesignations?: string[] // Used for designation-wise edit
    newPermissionNames?: string[] // Used for designation-wise edit
    targetGroupDesignation?: string // Used for group role-wise edit
    targetGroupPermissions?: string[] // Used for group role-wise edit
    groupRoleDescription?: string // Used for group role-wise edit
    editType: 'designation' | 'groupRole' // Explicitly specify edit type
  }
}

// Async thunks
export const fetchUserRole = createAsyncThunk(
  'userManagement/fetchUserRole',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getUserRolesUrl, { params })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user roles'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.status || 500
      })
    }
  }
)
export const getUserRoleDetails = createAsyncThunk(
  'userManagement/getUserRoleDetails',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getUserRoleDetailsUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchDesignation = createAsyncThunk(
  'userManagement/fetchDesignation',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getUserDesignationsUrl, { params })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch designations'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.status || 500
      })
    }
  }
)

export const addNewUserRole = createAsyncThunk(
  'userManagement/addNewUserRole',
  async (params: AddUserRoleParams, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/roles', {
        designation: params.designation,
        des_role_description: params.des_role_description,
        group_designation: params.group_designation,
        grp_role_description: params.grp_role_description,
        permissions: params.permissions
      })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add role'

      return rejectWithValue({
        message: Array.isArray(errorMessage)
          ? errorMessage.map((err: any) =>
              typeof err === 'string' ? err : err.constraints?.whitelistValidation || 'Unknown error'
            )
          : [errorMessage],
        statusCode: error.response?.status || 500
      })
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'userManagement/updateUserRole',
  async ({ id, groupRoleId, params }: UpdateUserRoleParams, { rejectWithValue }) => {
    try {
      let requestBody: any

      if (!groupRoleId) {
        // Designation-wise edit
        requestBody = {
          designation: params.designation,
          newGroupDesignations: params.newGroupDesignations || [],
          newPermissionNames: params.newPermissionNames || []
        }
      } else {
        // Group role-wise edit
        requestBody = {
          designation: params.designation,
          targetGroupDesignation: params.targetGroupDesignation,
          targetGroupPermissions: params.targetGroupPermissions || []
        }
      }

      const response = await AxiosLib.patch('/roles/update-permissions', requestBody)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update role'

      return rejectWithValue({
        message: Array.isArray(errorMessage)
          ? errorMessage.map((err: any) =>
              typeof err === 'string' ? err : err.constraints?.whitelistValidation || 'Unknown error'
            )
          : [errorMessage],
        statusCode: error.response?.status || 500
      })
    }
  }
)

// Initial state
const initialState: UserRoleState = {
  userRoleData: null,
  isUserRoleLoading: false,
  userRoleSuccess: false,
  userRoleFailure: false,
  userRoleFailureMessage: '',
  isAddUserRoleLoading: false,
  addUserRoleSuccess: false,
  addUserRoleFailure: false,
  addUserRoleFailureMessage: '',
  designationData: null,
  isDesignationLoading: false,
  designationSuccess: false,
  designationFailure: false,
  designationFailureMessage: ''
}

// Slice
export const UserRoleSlice = createSlice({
  name: 'UserRole',
  initialState,
  reducers: {
    fetchUserRoleDismiss: state => {
      state.isUserRoleLoading = false
      state.userRoleSuccess = false
      state.userRoleFailure = false
      state.userRoleFailureMessage = ''
    },
    resetAddUserRoleStatus: state => {
      state.isAddUserRoleLoading = false
      state.addUserRoleSuccess = false
      state.addUserRoleFailure = false
      state.addUserRoleFailureMessage = ''
    },
    fetchDesignationDismiss: state => {
      state.isDesignationLoading = false
      state.designationSuccess = false
      state.designationFailure = false
      state.designationFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserRole.pending, state => {
        state.isUserRoleLoading = true
        state.userRoleSuccess = false
        state.userRoleFailure = false
        state.userRoleFailureMessage = ''
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.userRoleData = action.payload
        state.isUserRoleLoading = false
        state.userRoleSuccess = true
      })
      .addCase(fetchUserRole.rejected, (state, action: any) => {
        state.isUserRoleLoading = false
        state.userRoleData = null
        state.userRoleFailure = true
        state.userRoleFailureMessage = action.payload?.message?.join(', ') || 'Failed to fetch user roles'
      })
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
      .addCase(fetchDesignation.rejected, (state, action: any) => {
        state.isDesignationLoading = false
        state.designationData = null
        state.designationFailure = true
        state.designationFailureMessage = action.payload?.message?.join(', ') || 'Failed to fetch designations'
      })
      .addCase(addNewUserRole.pending, state => {
        state.isAddUserRoleLoading = true
        state.addUserRoleSuccess = false
        state.addUserRoleFailure = false
        state.addUserRoleFailureMessage = ''
      })
      .addCase(addNewUserRole.fulfilled, state => {
        state.isAddUserRoleLoading = false
        state.addUserRoleSuccess = true
      })
      .addCase(addNewUserRole.rejected, (state, action: any) => {
        state.isAddUserRoleLoading = false
        state.addUserRoleSuccess = false
        state.addUserRoleFailure = true
        state.addUserRoleFailureMessage = action.payload?.message?.join(', ') || 'Failed to add role'
      })
      .addCase(updateUserRole.pending, state => {
        state.isAddUserRoleLoading = true
        state.addUserRoleSuccess = false
        state.addUserRoleFailure = false
        state.addUserRoleFailureMessage = ''
      })
      .addCase(updateUserRole.fulfilled, state => {
        state.isAddUserRoleLoading = false
        state.addUserRoleSuccess = true
      })
      .addCase(updateUserRole.rejected, (state, action: any) => {
        state.isAddUserRoleLoading = false
        state.addUserRoleSuccess = false
        state.addUserRoleFailure = true
        state.addUserRoleFailureMessage = action.payload?.message?.join(', ') || 'Failed to update role'
      })
      .addCase(getUserRoleDetails.pending, state => {
        state.isUserRoleLoading = true
        state.userRoleSuccess = false
        state.userRoleFailure = false
        state.userRoleFailureMessage = ''
      })
      .addCase(getUserRoleDetails.fulfilled, (state, action) => {
        state.userRoleData = { data: [action.payload] } // Store as an array for consistency
        state.isUserRoleLoading = false
        state.userRoleSuccess = true
      })
      .addCase(getUserRoleDetails.rejected, (state, action: any) => {
        state.isUserRoleLoading = false
        state.userRoleData = null
        state.userRoleFailure = true
        state.userRoleFailureMessage = action.payload?.message?.join(', ') || 'Failed to fetch role details'
      })
  }
})

export const { fetchUserRoleDismiss, resetAddUserRoleStatus, fetchDesignationDismiss } = UserRoleSlice.actions
export default UserRoleSlice.reducer
