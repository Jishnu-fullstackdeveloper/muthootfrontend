import axios from 'axios'

import { jwtDecode } from 'jwt-decode'

import { getAccessToken, getRefreshToken, Logout } from '@/utils/functions'

const controller = new AbortController()
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()

const AxiosLib = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  signal: controller.signal
})

// Set Authorization header if accessToken is available
if (accessToken) {
  const decodedToken: any = jwtDecode(accessToken)
  // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  AxiosLib.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  AxiosLib.defaults.headers.common['refreshtoken'] = `${refreshToken}`
  AxiosLib.defaults.headers.common['x-tenant-id'] = `${decodedToken?.schema}`
}

AxiosLib.interceptors.response.use(
  response => {
    // Edit response config if needed
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Unauthorized error, log out the user
      // check whether there is access token is there or not
      // Logout()
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login'
      // }
    }
    return Promise.reject(error)
  }
)

export default AxiosLib
