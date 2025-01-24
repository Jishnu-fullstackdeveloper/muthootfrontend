// ** Necessary imports
import axios from 'axios'
import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../loginSlice'
import { fetchLoginToken } from '../loginSlice'
import MockAdapter from 'axios-mock-adapter'

// Mock Axios
const mock = new MockAdapter(axios)

// Create a test store
const store = configureStore({
  reducer: {
    login2: loginReducer
  }
})

describe('loginSlice Redux tests', () => {
  afterEach(() => {
    mock.reset() // Reset Axios mock after each test
  })

  test('should return initial state', () => {
    const state = store.getState().login2
    expect(state).toEqual({
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
      secondLoginData: null
    })
  })

  test('should handle fetchLoginToken.pending', () => {
    store.dispatch({ type: fetchLoginToken.pending.type })

    const state: any = store.getState().login2

    expect(state.isSecondLoading).toBe(true) // Update to expect true
  })

  test('should handle fetchLoginToken.fulfilled', async () => {
    const mockResponse = {
      token: {
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token'
      },
      roles: ['test_role']
    }
    mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/keycloak/auth`).reply(200, mockResponse)

    const params = {
      issuer: 'test_issuer',
      code: 'test_code',
      state: 'test_state'
    }

    await store.dispatch(fetchLoginToken(params))

    const state: any = store.getState().login2

    // Modify expected result to include the filter
    expect(state.secondLoginData).toEqual({
      ...mockResponse,
      filter: params // Expect the filter to be part of the payload
    })

    expect(state.isSecondLoading).toBe(false)
  })

  test('should handle fetchLoginToken.rejected', async () => {
    mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/keycloak/auth`).reply(500)

    await store.dispatch(
      fetchLoginToken({
        issuer: 'test_issuer',
        code: 'test_code',
        state: 'test_state'
      })
    )

    const state: any = store.getState().login2

    expect(state.isSecondLoading).toBe(false)
    expect(state.secondLoginData).toBeNull()
  })
})
