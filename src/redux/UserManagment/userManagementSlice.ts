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

export const fetchEmployees = createAsyncThunk(
  'userManagement/fetchEmployees',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/employee', { params })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data.data)
    }
  }
)

export const fetchUserRole = createAsyncThunk(
  'userManagement/fetchUserRole',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/roles', { params })

      return response
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addNewUser = createAsyncThunk<any, any>(
  'userManagement/addNewUser',
  async (params: object, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.post('/users', params)

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

// export const updateUser = createAsyncThunk<any, { id: string; params: { email: string; newRoleName: string[] } }>(
//   'userManagement/updateUser',
//   async ({ id, params }, { rejectWithValue }) => {
//     try {
//       id

//       const response = await AxiosLib.patch(`/users/role`, {
//         email: params.email,
//         newRoleName: params.newRoleName
//       })

//       return response.data
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Failed to update role'

//       return rejectWithValue({
//         message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
//         statusCode: error.response?.data?.statusCode || 500
//       })
//     }
//   }
// )
export const updateUser = createAsyncThunk<
  any,
  { id: string; params: { email: string; newDesignationRole?: string; newRoleNames?: string[] } }
>('userManagement/updateUser', async ({ params }, { rejectWithValue }) => {
  try {
    const response = await AxiosLib.patch(`/users/update-roles`, {
      email: params.email,
      ...(params.newDesignationRole !== undefined ? { newDesignationRole: params.newDesignationRole } : {}),
      ...(params.newRoleNames !== undefined ? { newRoleNames: params.newRoleNames } : {})
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

    userRoleData: [],
    isUserRoleLoading: false,
    userRoleSuccess: false,
    userRoleFailure: false,
    userRoleFailureMessage: '',

    addNewUserData: [],
    isAddUserLoading: false,
    addUserSuccess: false,
    addUserFailure: false,
    addUserFailureMessage: '',

    selectedUser: null, // To store user data for editing
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
    builder.addCase(updateUser.pending, state => {
      state.isAddUserLoading = true
      state.addUserSuccess = false
      state.addUserFailure = false
      state.addUserFailureMessage = ''
    })
    builder.addCase(updateUser.fulfilled, state => {
      state.isAddUserLoading = false
      state.addUserSuccess = true
      state.addUserFailure = false
    })
    builder.addCase(updateUser.rejected, (state, action: any) => {
      state.isAddUserLoading = false
      state.addUserSuccess = false
      state.addUserFailure = true
      state.addUserFailureMessage = action.payload?.message || 'Failed to update user'
    })
  }
})

export const { resetAddUserStatus } = UserManagementSlice.actions
export default UserManagementSlice.reducer
