'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import custom_theme_settings from '@/utils/custom_theme_settings.json'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { fetchInitialLoginURL } from '@/redux/loginSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit'
import { getAccessToken, getRefreshToken } from '@/utils/functions'
import { jwtDecode } from 'jwt-decode'
import { Box, LinearProgress } from '@mui/material'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const LoginV2 = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [displayLoginPage, setDisplayLoginPage] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const access_token = getAccessToken()

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const dispatch = useDispatch<Dispatch>()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const { firstLoginData, loginErrorMessage, loginFailure }: any = useSelector((state: any) => state.loginReducer)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSubmitted(true)
    const params = {
      email
    }
    dispatch<any>(fetchInitialLoginURL(params))
  }

  useEffect(() => {
    if (Object?.entries(firstLoginData)?.length !== 0 && firstLoginData?.url) {
      window.location.replace(firstLoginData?.url)
    }
  }, [firstLoginData])

  //for entering to the dashboard if their is an access token
  useEffect(() => {
    if (access_token) {
      const decodedToken: any = jwtDecode(access_token)
      if (decodedToken) {
        router.push('/home')
      }
    }
  }, [])

  useEffect(() => {
    if (loginFailure) {
      if (Array.isArray(loginErrorMessage)) {
        console.log('entered')
        loginErrorMessage?.map(x => {
          toast.error(x, {
            position: 'top-right',
            autoClose: false,
            hideProgressBar: false,
            theme: 'dark',
            closeOnClick: true
          })
        })
      } else if (typeof loginErrorMessage === 'string') {
        toast.error(loginErrorMessage, {
          position: 'top-right',
          autoClose: false,
          hideProgressBar: false,
          theme: 'dark',
          closeOnClick: true
        })
      }
    }
  }, [loginFailure])

  /**
   * For Avoiding this page
   */

  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM
  const redirectUrl: any = process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL
  const keycloakUrl: any = process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL

  const url = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?client_id=client&redirect_uri=${encodeURIComponent(
    redirectUrl
  )}&scope=openid&response_type=code`

  useEffect(() => {
    if (!displayLoginPage) {
      if (url && typeof window !== 'undefined') {
        window.location.replace(url)
      }
    }
  }, [])

  return (
    <>
      {!displayLoginPage ? (
        <>
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
      ) : (
        <div className='flex bs-full justify-center'>
          <div
            className={classnames(
              'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
              {
                'border-ie': settings.skin === 'bordered'
              }
            )}
          >
            {custom_theme_settings?.theme?.images?.login_illustration?.src ? (
              <LoginIllustration
                src={custom_theme_settings?.theme?.images?.login_illustration?.src}
                alt={custom_theme_settings?.theme?.images?.login_illustration?.altText}
              />
            ) : (
              <LoginIllustration src={characterIllustration} alt='character-illustration' />
            )}
            {!hidden && (
              <MaskImg
                alt='mask'
                src={authBackground}
                className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
              />
            )}
          </div>
          <div
            className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'
            style={{ backgroundColor: custom_theme_settings?.theme?.login_background_color || 'white' }}
          >
            <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
              <Logo />
            </div>
            <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
              <div className='flex flex-col gap-1'>
                <Typography variant='h4'>{`${custom_theme_settings?.theme?.login_welcome_text_head}! 👋🏻`}</Typography>
                <Typography>{custom_theme_settings?.theme?.login_welcome_secondary_text}</Typography>
              </div>
              <form onSubmit={handleSubmit} noValidate autoComplete='off' className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1'>
                  <CustomTextField
                    autoFocus
                    fullWidth
                    label='Email or Username'
                    placeholder='Enter your email or username'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    name='email'
                  />

                  {submitted && email === '' ? (
                    <Typography variant='subtitle2' color='error'>
                      Email is required!
                    </Typography>
                  ) : email && submitted && !emailRegex.test(email) ? (
                    <Typography variant='subtitle2' color='error'>
                      Please enter a valid email address!
                    </Typography>
                  ) : null}
                </div>

                {/* <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            /> */}
                <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={custom_theme_settings?.theme?.login_remember_me_checkbox_text || 'Remember me'}
                  />
                  {/* <Typography className='text-end' color='primary' component={Link}>
                Forgot password?
              </Typography> */}
                </div>
                <Button fullWidth variant='contained' type='submit'>
                  Login
                </Button>
                <div className='flex justify-center items-center flex-wrap gap-2'>
                  <Typography>
                    {custom_theme_settings?.theme?.register_new_account_text || 'New on our platform?'}
                  </Typography>
                  <Typography component={Link} color='primary'>
                    {custom_theme_settings?.theme?.register_new_account_link_text || 'Create an account'}
                  </Typography>
                </div>
                {/* <Divider className='gap-2 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small'>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small'>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small'>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small'>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div> */}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LoginV2
