// ** Redux Imports
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'

import AxiosLib from '@/lib/AxiosLib'
import { getAccessToken, getRefreshToken, handleAsyncThunkStates } from '@/utils/functions'

// Define the state interface
interface SignOutParams {
  userType: string
}

interface LoginState {
  fetchInitialLoginURLLoading: boolean
  fetchInitialLoginURLSuccess: boolean
  fetchInitialLoginURLData: any
  fetchInitialLoginURLFailure: boolean
  fetchInitialLoginURLFailureMessage: string
  fetchLoginTokenLoading: boolean
  fetchLoginTokenSuccess: boolean
  fetchLoginTokenData: any
  fetchLoginTokenFailure: boolean
  fetchLoginTokenFailureMessage: string
  fetchNewAccessTokenLoading: boolean
  fetchNewAccessTokenSuccess: boolean
  fetchNewAccessTokenData: any
  fetchNewAccessTokenFailure: boolean
  fetchNewAccessTokenFailureMessage: string
  changePasswordApiLoading: boolean
  changePasswordApiSuccess: boolean
  changePasswordApiData: any
  changePasswordApiFailure: boolean
  changePasswordApiFailureMessage: string
  fetchPermissionRenderConfigLoading: boolean
  fetchPermissionRenderConfigSuccess: boolean
  fetchPermissionRenderConfigData: any
  fetchPermissionRenderConfigFailure: boolean
  fetchPermissionRenderConfigFailureMessage: string
}

// Thunk for fetching initial login URL
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

// Thunk for fetching login token
export const fetchLoginToken = createAsyncThunk<any, any>('login/fetchToken', async (params, thunkAPI) => {
  try {
    thunkAPI

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, {
       headers: {
        client : process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
      },
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

// Thunk for signing out
export const signOutApi = createAsyncThunk<any, any>('sign-out', async (params: SignOutParams, thunkAPI) => {
  try {
    params
    thunkAPI
    const refreshToken = getRefreshToken()
    const accessToken = getAccessToken()
    const api = '/auth/signout'

    const response = await AxiosLib.get(api, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        refreshtoken: refreshToken ,
      }
    })

    return { ...response.data }
  } catch (error) {
    throw error
  }
})

// Thunk for changing password
export const changePasswordApi = createAsyncThunk<any, any>('change-password', async (params: object) => {
  try {
    params
    const accessToken = getAccessToken()
    const api = '/auth/change-password'

    const response = await AxiosLib.get(api, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        client : process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID

      }
    })

    return { ...response.data.data }
  } catch (error) {
    throw error
  }
})

// Thunk for fetching new access token
export const fetchNewAccessToken = createAsyncThunk<any, any>(
  'appLogin/fetchNewAccessToken',
  async (params: any, { rejectWithValue }) => {
    try {
      const api = `/auth/refresh-token`

      AxiosLib.defaults.headers.common['refreshtoken'] = `${params.refreshtoken}`
      const response = await AxiosLib.get(api)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk for fetching permission render configuration
export const fetchPermissionRenderConfig = createAsyncThunk<any, any>(
  'login/fetchPermissionRenderConfig',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getAccessToken()
      const api = 'auth/permissions'

      const response = await AxiosLib.get(api, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        client : process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID

        }
      })

      return response.data
    } catch (error: any) {
      throw rejectWithValue(error.response.data)
    }
  }
)

// Create the slice
export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    fetchInitialLoginURLLoading: false,
    fetchInitialLoginURLSuccess: false,
    fetchInitialLoginURLData: null,
    fetchInitialLoginURLFailure: false,
    fetchInitialLoginURLFailureMessage: '',
    fetchLoginTokenLoading: false,
    fetchLoginTokenSuccess: false,
    fetchLoginTokenData: null,
    fetchLoginTokenFailure: false,
    fetchLoginTokenFailureMessage: '',
    fetchNewAccessTokenLoading: false,
    fetchNewAccessTokenSuccess: false,
    fetchNewAccessTokenData: null,
    fetchNewAccessTokenFailure: false,
    fetchNewAccessTokenFailureMessage: '',
    changePasswordApiLoading: false,
    changePasswordApiSuccess: false,
    changePasswordApiData: null,
    changePasswordApiFailure: false,
    changePasswordApiFailureMessage: '',
    fetchPermissionRenderConfigLoading: false,
    fetchPermissionRenderConfigSuccess: false,
    fetchPermissionRenderConfigData: null,
    fetchPermissionRenderConfigFailure: false,
    fetchPermissionRenderConfigFailureMessage: ''
  } as LoginState,
  reducers: {
    LoginDataDismiss: (state, action: PayloadAction<boolean>) => {
      action
      state.fetchNewAccessTokenSuccess = false
      state.fetchNewAccessTokenFailure = false
      state.fetchNewAccessTokenFailureMessage = ''
      state.fetchInitialLoginURLFailure = false
      state.fetchInitialLoginURLFailureMessage = ''
      state.changePasswordApiFailure = false
      state.changePasswordApiFailureMessage = ''
    }
  },
  extraReducers: builder => {
    // Use handleAsyncThunkStates for each async thunk

    // Custom handling for fetchNewAccessToken fulfilled case
    builder.addCase(fetchNewAccessToken.fulfilled, (state, action) => {
      state.fetchNewAccessTokenLoading = false

      if (action?.payload?.success === false && action?.payload?.statusCode === 400) {
        state.fetchNewAccessTokenSuccess = false
        state.fetchNewAccessTokenFailure = true
        state.fetchNewAccessTokenFailureMessage = action?.payload?.message
        state.fetchNewAccessTokenData = null
      } else {
        state.fetchNewAccessTokenSuccess = true
        state.fetchNewAccessTokenData = action.payload
        state.fetchNewAccessTokenFailure = false
        state.fetchNewAccessTokenFailureMessage = ''
      }
    })
    handleAsyncThunkStates(builder, fetchInitialLoginURL, 'fetchInitialLoginURL')
    handleAsyncThunkStates(builder, fetchLoginToken, 'fetchLoginToken')
    handleAsyncThunkStates(builder, signOutApi, 'signOut')
    handleAsyncThunkStates(builder, changePasswordApi, 'changePasswordApi')
    handleAsyncThunkStates(builder, fetchNewAccessToken, 'fetchNewAccessToken')
    handleAsyncThunkStates(builder, fetchPermissionRenderConfig, 'fetchPermissionRenderConfig')
  }
})

export const { LoginDataDismiss } = loginSlice.actions
export default loginSlice.reducer
