// ** Redux Imports
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'

import AxiosLib from '@/lib/AxiosLib'
import { getAccessToken, getRefreshToken } from '@/utils/functions'

interface SignOutParams {
  userType: string
}

// ** Fetch Contacts List
export const fetchInitialLoginURL = createAsyncThunk<any, any>(
  'login/fetchurl',
  async (params, { rejectWithValue }) => {
    const email = params.email.toLowerCase()

    const requestData = {
      email
    }

    const api = process.env.NEXT_PUBLIC_API_BASE_URL

    try {
      const response = await axios.post(api, requestData)

      return { ...response.data, filter: params }
    } catch (error: any) {
      throw rejectWithValue(error.response.data)
    }
  }
)

export const fetchLoginToken = createAsyncThunk<any, any>('login/fetchToken', async (params, thunkAPI) => {
  try {
    thunkAPI

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/auth`, {
      params: {
        iss: params.issuer,
        code: params.code,
        state: params.state
      }
    })

    return { ...response.data, filter: params }
  } catch (error) {
    throw error
  }
})

export const signOutApi = createAsyncThunk<any, any>('sign-out', async (params: SignOutParams, thunkAPI) => {
  try {
    params
    thunkAPI
    const refreshToken = getRefreshToken()
    const accessToken = getAccessToken()
    const api = '/auth/user/signout'

    const response = await AxiosLib.get(api, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        refreshtoken: refreshToken
      }
    })

    return { ...response.data }
  } catch (error) {
    throw error
  }
})

export const changePasswordApi = createAsyncThunk<any, any>('change-password', async (params: object) => {
  try {
    params
    const accessToken = getAccessToken()
    const api = '/auth/user/change-password'

    const response = await AxiosLib.get(api, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })

    return { ...response.data.data }
  } catch (error) {
    throw error
  }
})

export const fetchNewAccessToken = createAsyncThunk<any, any>(
  'appLogin/fetchNewAccessToken',
  async (params: any, { rejectWithValue }) => {
    try {
      const api = `/auth/user/refresh-token`

      AxiosLib.defaults.headers.common['refreshtoken'] = `${params.refreshtoken}`
      const response = await AxiosLib.get(api)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// ** Fetch Permission Render Configuration
export const fetchPermissionRenderConfig = createAsyncThunk<any, any>(
  'login/fetchPermissionRenderConfig',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getAccessToken()
      const api = '/render-config'

      const response = await AxiosLib.get(api, {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error: any) {
      throw rejectWithValue(error.response.data)
    }
  }
)

export const loginSlice: any = createSlice({
  name: 'login',
  initialState: {
    isLoading: false,
    isLoginBegin: false,
    firstLoginData: {},
    fetchKeycloakLoginUrlError: false,
    fetchKeycloakLoginUrlErrorMessage: '',
    changePasswordData: null,
    changePasswordFailure: false,
    changePasswordFailureMessage: '',
    newAccessTokenApiBegin: false,
    newAccessTokenApiData: '',
    newAccessTokenApiSuccess: false,
    newAccessTokenApiFailure: false,
    newAccessTokenApiFailureMessage: '',
    loginErrorMessage: {},
    loginFailure: false,
    isSecondLoading: false,
    secondLoginData: null,
    fetchPermissionRenderConfigLoading: false,
    fetchPermissionRenderConfigData: null,
    fetchPermissionRenderConfigError: false,
    fetchPermissionRenderConfigErrorMessage: ''
  },
  reducers: {
    LoginDataDismiss: (state, action: PayloadAction<boolean>) => {
      action
      ;(state.newAccessTokenApiSuccess = false),
        (state.newAccessTokenApiFailure = false),
        (state.newAccessTokenApiFailureMessage = ''),
        (state.fetchKeycloakLoginUrlError = false),
        (state.fetchKeycloakLoginUrlErrorMessage = ''),
        (state.changePasswordFailure = false),
        (state.changePasswordFailureMessage = '')
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchInitialLoginURL.pending, state => {
      state.isLoginBegin = true
      state.loginFailure = false
    })
    builder.addCase(fetchInitialLoginURL.fulfilled, (state, action) => {
      state.firstLoginData = action.payload
      state.isLoginBegin = false
      state.loginFailure = false
    })
    builder.addCase(fetchInitialLoginURL.rejected, (state, action) => {
      state.isLoginBegin = false
      state.firstLoginData = {}
      state.loginErrorMessage = (action.payload as any)?.message
      state.loginFailure = true
    })

    builder.addCase(fetchLoginToken.pending, state => {
      state.isSecondLoading = true
    })
    builder.addCase(fetchLoginToken.fulfilled, (state, action) => {
      state.isSecondLoading = false
      state.secondLoginData = action.payload
    })
    builder.addCase(fetchLoginToken.rejected, state => {
      state.isSecondLoading = false
      state.secondLoginData = null
    })

    builder.addCase(fetchNewAccessToken.pending, state => {
      state.newAccessTokenApiBegin = true
    })
    builder.addCase(fetchNewAccessToken.fulfilled, (state, action) => {
      if (action?.payload?.success === false && action?.payload?.statusCode === 400) {
        ;(state.newAccessTokenApiFailure = true),
          (state.newAccessTokenApiBegin = false),
          (state.newAccessTokenApiFailureMessage = action?.payload?.message)
      } else {
        ;(state.newAccessTokenApiSuccess = true),
          (state.newAccessTokenApiData = action.payload),
          (state.newAccessTokenApiBegin = false)
      }
    })
    builder.addCase(fetchNewAccessToken.rejected, (state, action: any) => {
      ;(state.newAccessTokenApiFailure = true),
        (state.newAccessTokenApiBegin = false),
        (state.newAccessTokenApiFailureMessage = action?.payload?.message || '')
    })

    builder.addCase(changePasswordApi.pending, state => {
      state.isLoading = true
    })
    builder.addCase(changePasswordApi.fulfilled, (state, action) => {
      state.changePasswordData = action?.payload?.url
      state.isLoading = false
    })
    builder.addCase(changePasswordApi.rejected, (state, action: any) => {
      state.changePasswordData = null
      state.isLoading = false
      ;(state.changePasswordFailure = false), (state.changePasswordFailureMessage = action?.payload?.message || '')
    })

    // Add extra reducers for fetchPermissionRenderConfig
    builder.addCase(fetchPermissionRenderConfig.pending, state => {
      state.fetchPermissionRenderConfigLoading = true
      state.fetchPermissionRenderConfigError = false
      state.fetchPermissionRenderConfigErrorMessage = ''
    })
    builder.addCase(fetchPermissionRenderConfig.fulfilled, (state, action) => {
      state.fetchPermissionRenderConfigLoading = false
      state.fetchPermissionRenderConfigData = action.payload
    })
    builder.addCase(fetchPermissionRenderConfig.rejected, (state, action: any) => {
      state.fetchPermissionRenderConfigLoading = false
      state.fetchPermissionRenderConfigError = true
      state.fetchPermissionRenderConfigErrorMessage =
        action.payload?.message || 'Failed to fetch permission configuration'
    })
  }
})

export const { setIsLoggedIn, LoginDataDismiss } = loginSlice.actions
export default loginSlice.reducer
