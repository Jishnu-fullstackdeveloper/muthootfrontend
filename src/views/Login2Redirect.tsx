'use client'
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, LinearProgress, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { Dispatch } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify'

import type { RootState } from '@/redux/store'
import { fetchLoginToken } from '@/redux/loginSlice'
import { setAccessToken, setRefreshToken, setUserId, storeLoginResponse } from '@/utils/functions'
import AxiosLib from '@/lib/AxiosLib'

const Login2Redirect = () => {
  const router = useRouter()
  let currentUrl

  if (typeof window !== 'undefined') {
    currentUrl = window?.location?.href
  }

  const urlParams = new URLSearchParams(currentUrl?.split('?')[1])
  const code = urlParams.get('code')
  const issuer = urlParams.get('iss')
  const stateFetched = urlParams.get('state')

  const dispatch = useDispatch<Dispatch>()
  const { secondLoginData }: any = useSelector((state: RootState) => state.loginReducer)

  useEffect(() => {
    const params = {
      code,
      issuer,
      state: stateFetched
    }

    dispatch<any>(fetchLoginToken(params))
  }, [])

  useEffect(() => {
    const handleLogin = () => {
      if (secondLoginData) {
        const accessToken = secondLoginData?.data?.token?.access_token || ''
        const refreshToken = secondLoginData?.data?.token?.refresh_token || ''
        let decodedToken: any

        if (accessToken) decodedToken = jwtDecode(accessToken)

        if (decodedToken && decodedToken?.realm) {
          setAccessToken(accessToken)
          setRefreshToken(refreshToken)
          setUserId(decodedToken?.sub)
          storeLoginResponse(secondLoginData?.data)
          AxiosLib.defaults.headers.common['Authorization'] = `Bearer ${secondLoginData?.token?.access_token || ''}`
          toast.success('Login Successful.', {
            closeOnClick: true
          })
          setTimeout(() => {
            router.push('/home')
          }, 2000)
        }
      }
    }

    handleLogin()

    return () => {
      // Cleanup function to remove the effect
    }
  }, [secondLoginData])

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
          backgroundColor: '#f4f4f4', // Light background for a clean look
          textAlign: 'center'
        }}
      >
        {/* <Box sx={{ mb: 4 }}>
          <Image src='/path-to-logo.png' alt='Company Logo' width={200} height={100} priority />
        </Box> */}

        <Typography variant='h5' component='div' sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
          Redirecting...
        </Typography>

        <Typography variant='body2' component='div' sx={{ color: '#666', mb: 4 }}>
          Please wait while we securely log you in.
        </Typography>

        <Box sx={{ width: '60%', maxWidth: 300 }}>
          <LinearProgress />
        </Box>
      </Box>
    </>
  )
}

export default Login2Redirect
