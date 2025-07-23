import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'
import { API_ENDPOINTS } from '../ApiUrls/userManagement'

export const fetchUserManagement = createAsyncThunk(
  'userManagement/fetchUserManagement',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getUsersUrl, { params })

      return response
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// New API: Fetch User by ID
export const fetchUserById = createAsyncThunk(
  'userManagement/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getUserByIdUrl(id))

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchEmployees = createAsyncThunk(
  'userManagement/fetchEmployees',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getEmployeesUrl, { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data.data)
    }
  }
)

export const fetchDesignationRoles = createAsyncThunk(
  'userManagement/fetchDesignationRoles',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get(API_ENDPOINTS.getDesignationRoleUrl, {
        params: { page, limit }
      })

      return response.data // Assuming response.data is an array of role names
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch designation roles'

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode || 500
      })
    }
  }
)

export const addNewUser = createAsyncThunk<any, any>(
  'userManagement/addNewUser',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post(API_ENDPOINTS.addUserUrl, params)

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode
      })
    }
  }
)

export const updateUserPermission = createAsyncThunk<
  any,
  {
    id: string
    params: { email: string; newPermissions?: string[]; newDesignationRole?: string; newRoleNames?: string[] }
  }
>('userManagement/updateUserPermission', async ({ params }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.patch(API_ENDPOINTS.updateUserPermissionUrl, {
      email: params.email,
      ...(params.newPermissions !== undefined ? { newPermissions: params.newPermissions } : {})
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

export const updateUserRole = createAsyncThunk<
  any,
  {
    id: string
    params: { email: string; newPermissions?: string[]; newDesignationRole?: string; newRoleNames?: string[] }
  }
>('userManagement/updateUserRole', async ({ params }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.patch(API_ENDPOINTS.updateUserRoleUrl, {
      email: params.email,
      ...(params.newDesignationRole !== undefined ? { newDesignationRole: params.newDesignationRole } : {})
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

export const UserManagementSlice = createSlice({
  name: 'UserManagement',
  initialState: {
    userManagementData: [],
    isUserManagementLoading: false,
    userManagementSuccess: false,
    userManagementFailure: false,
    userManagementFailureMessage: '',

    employeeData: [],
    isEmployeeLoading: false,
    EmployeeSuccess: false,
    EmployeeFailure: false,
    EmployeeFailureMessage: '',

    userDesignationRoleData: [],
    isUserDesignationRoleLoading: false,
    userDesignationRoleSuccess: false,
    userDesignationRoleFailure: false,
    userDesignationRoleFailureMessage: '',

    addNewUserData: [],
    isAddUserLoading: false,
    addUserSuccess: false,
    addUserFailure: false,
    addUserFailureMessage: '',

    selectedUserData: null,
    isUserLoading: false,
    userSuccess: false,
    userFailure: false,
    userFailureMessage: ''
  },
  reducers: {
    fetchUserManagementDismiss: state => {
      state.isUserManagementLoading = false
      state.userManagementSuccess = false
      state.userManagementFailure = false
      state.userManagementFailureMessage = ''
    },
    resetAddUserStatus: state => {
      state.isAddUserLoading = false
      state.addUserSuccess = false
      state.addUserFailure = false
      state.addUserFailureMessage = ''
      state.userSuccess = false
      state.userFailure = false
      state.userFailureMessage = ''
    }
  },
  extraReducers: builder => {
    // Fetch User Management List
    builder.addCase(fetchUserManagement.pending, state => {
      state.isUserManagementLoading = true
    })
    builder.addCase(fetchUserManagement.fulfilled, (state, action) => {
      state.userManagementData = action?.payload?.data
      state.isUserManagementLoading = false
      state.userManagementSuccess = true
    })
    builder.addCase(fetchUserManagement.rejected, (state, action: any) => {
      state.isUserManagementLoading = false
      state.userManagementData = []
      state.userManagementFailure = true
      state.userManagementFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    // Fetch User by ID
    builder
      .addCase(fetchUserById.pending, state => {
        state.isUserLoading = true
        state.userSuccess = false
        state.userFailure = false
        state.userFailureMessage = ''
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUserData = action.payload?.data || null
        state.isUserLoading = false
        state.userSuccess = true
        state.userFailure = false
      })
      .addCase(fetchUserById.rejected, state => {
        state.isUserLoading = false
        state.selectedUserData = null
        state.userSuccess = false
        state.userFailure = true

        // state.userFailureMessage = action?.payload?.message || 'Fetching Roles Failed'
      })

    // Fetch User Roles
    builder.addCase(fetchDesignationRoles.pending, state => {
      state.isUserDesignationRoleLoading = true
    })
    builder.addCase(fetchDesignationRoles.fulfilled, (state, action) => {
      state.userDesignationRoleData = action?.payload?.data
      state.isUserDesignationRoleLoading = false
      state.userDesignationRoleSuccess = true
    })
    builder.addCase(fetchDesignationRoles.rejected, (state, action: any) => {
      state.isUserDesignationRoleLoading = false
      state.userDesignationRoleData = []
      state.userDesignationRoleFailure = true
      state.userDesignationRoleFailureMessage = action?.payload?.message || 'Fetching Roles Failed'
    })

    // Fetch Employee Management List
    builder.addCase(fetchEmployees.pending, state => {
      state.isEmployeeLoading = true
    })
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.employeeData = action?.payload?.data
      state.isEmployeeLoading = false
      state.EmployeeSuccess = true
    })
    builder.addCase(fetchEmployees.rejected, (state, action: any) => {
      state.isEmployeeLoading = false
      state.employeeData = []
      state.EmployeeFailure = true
      state.EmployeeFailureMessage = action?.payload?.message || 'Listing Failed'
    })

    // Add New User
    builder.addCase(addNewUser.pending, state => {
      state.isAddUserLoading = true
      state.addUserSuccess = false
      state.addUserFailure = false
      state.addUserFailureMessage = ''
    })
    builder.addCase(addNewUser.fulfilled, state => {
      state.isAddUserLoading = false
      state.addUserSuccess = true
      state.addUserFailure = false
    })
    builder.addCase(addNewUser.rejected, (state, action: any) => {
      state.isAddUserLoading = false
      state.addUserSuccess = false
      state.addUserFailure = true
      state.addUserFailureMessage = action.payload?.message || 'Failed to add user'
    })

    // Update User
    builder.addCase(updateUserPermission.pending, state => {
      state.isAddUserLoading = true
      state.addUserSuccess = false
      state.addUserFailure = false
      state.addUserFailureMessage = ''
    })
    builder.addCase(updateUserPermission.fulfilled, state => {
      state.isAddUserLoading = false
      state.addUserSuccess = true
      state.addUserFailure = false
    })
    builder.addCase(updateUserPermission.rejected, (state, action: any) => {
      state.isAddUserLoading = false
      state.addUserSuccess = false
      state.addUserFailure = true
      state.addUserFailureMessage = action.payload?.message || 'Failed to update user'
    })
  }
})

export const { fetchUserManagementDismiss, resetAddUserStatus } = UserManagementSlice.actions
export default UserManagementSlice.reducer
