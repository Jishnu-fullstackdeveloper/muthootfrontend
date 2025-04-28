import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/userRoles'

export const fetchUserRole = createAsyncThunk(
  'userManagement/fetchUserRole',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getUserRolesUrl, { params })

      return response
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)



export const addNewUserRole = createAsyncThunk<any, any>(
  'userManagement/addNewUserRole',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/roles', params)

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

export const updateUserRole = createAsyncThunk<
  any,
  { id: string; params: { roleName: string; newPermissionNames: string[] } }
>('userManagement/updateUserRole', async ({ id, params }, { rejectWithValue }) => {
  try {
    id

    const response = await AxiosLib.patch(API_ENDPOINTS.patchUserRoleUrl, {
      roleName: params.roleName,
      newPermissionNames: params.newPermissionNames
    })

    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update role'

    return rejectWithValue({
      message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      statusCode: error.response?.data?.statusCode || 500
    })
  }
})

export const UserRoleSlice = createSlice({
  name: 'UserRole',
  initialState: {
    userRoleData: null,
    isUserRoleLoading: false,
    userRoleSuccess: false,
    userRoleFailure: false,
    userRoleFailureMessage: '',

    addNewRoleData: [],
    isAddRoleLoading: false,
    addUserRoleSuccess: false,
    addUserRoleFailure: false,
    addUserRoleFailureMessage: '',

    
    updateNewRoleData: [],
    isUpdateRoleLoading: false,
    updateUserRoleSuccess: false,
    updateUserRoleFailure: false,
    updateUserRoleFailureMessage: ''
  },

  reducers: {
    fetchUserRoleDismiss: state => {
      state.isUserRoleLoading = false
      state.userRoleSuccess = false
      state.userRoleFailure = false
      state.userRoleFailureMessage = ''
    },
    resetAddUserRoleStatus: state => {
      state.isAddRoleLoading = false
      state.addUserRoleSuccess = false
      state.addUserRoleFailure = false
      state.addUserRoleFailureMessage = ''
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUserRole.pending, state => {
      state.isUserRoleLoading = true
    })
    builder.addCase(fetchUserRole.fulfilled, (state, action) => {
      state.userRoleData = action?.payload?.data
      state.isUserRoleLoading = false
      state.userRoleSuccess = true
    })
    builder.addCase(fetchUserRole.rejected, (state, action: any) => {
      state.isUserRoleLoading = false
      state.userRoleData = []
      state.userRoleFailure = true
      state.userRoleFailureMessage = action?.payload?.message || 'Fetching Roles Failed'
    })

    builder.addCase(addNewUserRole.pending, state => {
      state.isAddRoleLoading = true
      state.addUserRoleSuccess = false
      state.addUserRoleFailure = false
      state.addUserRoleFailureMessage = ''
    })
    builder.addCase(addNewUserRole.fulfilled, state => {
      state.isAddRoleLoading = false
      state.addUserRoleSuccess = true
      state.addUserRoleFailure = false
    })
    builder.addCase(addNewUserRole.rejected, (state, action: any) => {
      state.isAddRoleLoading = false
      state.addUserRoleSuccess = false
      state.addUserRoleFailure = true
      state.addUserRoleFailureMessage = action.payload?.message || 'Failed to add role'
    })

    builder.addCase(updateUserRole.pending, state => {
      state.isUpdateRoleLoading = true
      state.updateUserRoleSuccess = false
      state.updateUserRoleFailure = false
      state.updateUserRoleFailureMessage = ''
    })
    builder.addCase(updateUserRole.fulfilled, state => {
      state.isUpdateRoleLoading = false
      state.updateUserRoleSuccess = true
      state.updateUserRoleFailure = false
    })
    builder.addCase(updateUserRole.rejected, (state, action: any) => {
      state.isUpdateRoleLoading = false
      state.updateUserRoleSuccess = false
      state.updateUserRoleFailure = true
      state.updateUserRoleFailureMessage = action.payload?.message || 'Failed to update role'
    })
  }
})

export const { fetchUserRoleDismiss, resetAddUserRoleStatus } = UserRoleSlice.actions
export default UserRoleSlice.reducer
