

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
 
// ** Axios Imports
import AxiosLib from '@/lib/AxiosLib'
 
export const fetchApprovalMatrix = createAsyncThunk<any, any>(
  'appMuthoot/fetchApprovalMatrix',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await AxiosLib.get('/approval-matrix', {
        params
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)
 
export const ApprovalMatrixSlice: any = createSlice({
  name: 'login',
  initialState: {
    approvalMatrixData: [],
    approvalMatrixLoading: false,
    approvalMatrixSuccess: false,
    approvalMatrixFailure: false,
    approvalMatrixFailureMessage: ''
  },
  reducers: {
    // LoginDataDismiss: (state, action: PayloadAction<boolean>) => {
    //   ;(state.newAccessTokenApiSuccess = false),
    //     (state.newAccessTokenApiFailure = false),
    //     (state.newAccessTokenApiFailureMessage = ''),
    //     (state.fetchKeycloakLoginUrlError = false),
    //     (state.fetchKeycloakLoginUrlErrorMessage = ''),
    //     (state.changePasswordFailure = false),
    //     (state.changePasswordFailureMessage = '')
    // }
  },
  extraReducers: builder => {
    builder.addCase(fetchApprovalMatrix.pending, state => {
      state.approvalMatrixLoading = true
    })
    builder.addCase(fetchApprovalMatrix.fulfilled, (state, action) => {
      state.approvalMatrixData = action.payload
      state.approvalMatrixLoading = false
    })
    builder.addCase(fetchApprovalMatrix.rejected, (state, action: any) => {
      state.approvalMatrixLoading = false
      state.approvalMatrixData = []
      state.approvalMatrixFailure = true
      state.approvalMatrixFailureMessage = action?.payload?.message || 'Listing Failed'
    })
 
    //   builder.addCase(fetchLoginToken.pending, state => {
    //     state.isSecondLoading = true
    //   })
    //   builder.addCase(fetchLoginToken.fulfilled, (state, action) => {
    //     state.isSecondLoading = false
    //     state.secondLoginData = action.payload
    //   })
    //   builder.addCase(fetchLoginToken.rejected, state => {
    //     state.isSecondLoading = false
    //     state.secondLoginData = null
    //   })
 
    //   builder.addCase(fetchNewAccessToken.pending, state => {
    //     state.newAccessTokenApiBegin = true
    //   })
    //   builder.addCase(fetchNewAccessToken.fulfilled, (state, action) => {
    //     if (action?.payload?.success === false && action?.payload?.statusCode === 400) {
    //       ;(state.newAccessTokenApiFailure = true),
    //         (state.newAccessTokenApiBegin = false),
    //         (state.newAccessTokenApiFailureMessage = action?.payload?.message)
    //     } else {
    //       ;(state.newAccessTokenApiSuccess = true),
    //         (state.newAccessTokenApiData = action.payload),
    //         (state.newAccessTokenApiBegin = false)
    //     }
    //   })
    //   builder.addCase(fetchNewAccessToken.rejected, (state, action: any) => {
    //     ;(state.newAccessTokenApiFailure = true),
    //       (state.newAccessTokenApiBegin = false),
    //       (state.newAccessTokenApiFailureMessage = action?.payload?.message || '')
    //   })
 
    //   builder.addCase(changePasswordApi.pending, state => {
    //     state.isLoading = true
    //   })
    //   builder.addCase(changePasswordApi.fulfilled, (state, action) => {
    //     state.changePasswordData = action?.payload?.url
    //     state.isLoading = false
    //   })
    //   builder.addCase(changePasswordApi.rejected, (state, action: any) => {
    //     state.changePasswordData = null
    //     state.isLoading = false
    //     ;(state.changePasswordFailure = false), (state.changePasswordFailureMessage = action?.payload?.message || '')
    //   })
  }
})
 
// export const { setIsLoggedIn, LoginDataDismiss } = BucketManagementSlice.actions
export default ApprovalMatrixSlice.reducer