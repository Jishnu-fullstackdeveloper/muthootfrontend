import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import AxiosLib from '@/lib/AxiosLib'

export const fetchUserManagement = createAsyncThunk(
  'userManagement/fetchUserManagement',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/users', {
        params
      })

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
      // Handle array of validation messages or single message
      const errorMessage = error.response?.data?.message

      return rejectWithValue({
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        statusCode: error.response?.data?.statusCode
      })
    }
  }
)

export const UserManagementSlice = createSlice({
  name: 'UserManagement',
  initialState: {
    userManagementData: [],
    isUserManagementLoading: false,
    userManagementSuccess: false,
    userManagementFailure: false,
    userManagementFailureMessage: '',

    addNewUserData: [],
    isAddUserLoading: false,
    addUserSuccess: false,
    addUserFailure: false,
    addUserFailureMessage: ''
  },

  reducers: {
    fetchUserManagementDismiss: state => {
      ;(state.isUserManagementLoading = false),
        (state.userManagementSuccess = false),
        (state.userManagementFailure = false),
        (state.userManagementFailureMessage = '')
    },
    resetAddUserStatus: state => {
      state.isAddUserLoading = false
      state.addUserSuccess = false
      state.addUserFailure = false
      state.addUserFailureMessage = ''
    }
  },
  extraReducers: builder => {
    //fetch User Management List
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

    // Add new user reducers
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
  }
})

export const { resetAddUserStatus } = UserManagementSlice.actions
export default UserManagementSlice.reducer
