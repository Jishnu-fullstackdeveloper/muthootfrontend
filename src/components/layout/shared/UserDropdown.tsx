'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { usePathname, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Hook Imports
import { useDispatch } from 'react-redux'

import { jwtDecode } from 'jwt-decode'

import { useSettings } from '@core/hooks/useSettings'
import type { AppDispatch } from '@/redux/store'
import { changePasswordApi, signOutApi, fetchNewAccessToken, LoginDataDismiss } from '@/redux/loginSlice'

import {
  decodeToken,
  getAccessToken,
  getCurrentPermissions,
  getRefreshToken,
  Logout,
  setAccessToken,
  setRefreshToken
} from '@/utils/functions'
import { useAppSelector } from '@/lib/hooks'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  const currentPermissions = getCurrentPermissions()

  const access_token = getAccessToken()
  const [decodedAccessToken, setDecodedAccessToken] = useState<any>(decodeToken(access_token))
  const firstLetter = decodedAccessToken?.given_name?.charAt(0) || 'U'

  const refresh_token = getRefreshToken()
  const decodedToken = decodeToken(access_token)

  const loginStates = useAppSelector((state: any) => state.loginReducer)

  // console.log({ role:currentPermissions[0]?.role }, "currentPermissions role..........");

  const {
    newAccessTokenApiData,
    newAccessTokenApiSuccess,
    newAccessTokenApiFailure,
    newAccessTokenApiFailureMessage,
    changePasswordData

    // changePasswordFailure,
    // changePasswordFailureMessage
  } = loginStates || {}

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    const params = {}

    dispatch(signOutApi(params))
      .then(() => {
        Logout()
        router.push('/login')
      })
      .catch(err => {
        console.log('error', err)
      })
  }

  const handleChangePassword = () => {
    const params = {}

    dispatch(changePasswordApi(params))
  }

  const pathName = usePathname()
  const guestRoutes = ['login', 'login-Redirect']
  const privateRoute = ![...guestRoutes].some(route => pathName.endsWith(route))

  useEffect(() => {
    if (!access_token && privateRoute) {
      setTimeout(() => {
        Logout()

        return router.push('/login')
      }, 3000)
    }

    let url

    if (typeof window !== 'undefined') {
      url = window.location.pathname
    }

    if (url?.includes('login/pass_update')) {
      setTimeout(() => {
        Logout()
        router.push('/login')
      }, 3000)
    }
  }, [])

  //  functionality: Fetching new access token to avoid unauthorization issue*/
  useEffect(() => {
    if (newAccessTokenApiSuccess && newAccessTokenApiData?.data?.access_token) {
      setAccessToken(newAccessTokenApiData?.data?.access_token)
      if (newAccessTokenApiData?.data?.refresh_token) {
        setRefreshToken(newAccessTokenApiData?.data?.refresh_token)
      }
    }

    if (newAccessTokenApiFailure && newAccessTokenApiFailureMessage) {
      handleUserLogout()
      dispatch(LoginDataDismiss())
    }
  }, [newAccessTokenApiSuccess, newAccessTokenApiData, newAccessTokenApiFailure, newAccessTokenApiFailureMessage])

  // to call this api in every 15 minitues
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (access_token && refresh_token) {
        const decodedToken: any = jwtDecode(access_token)
        const params: any = {
          realm: decodedToken?.realm,
          refreshtoken: refresh_token
        }
        dispatch(fetchNewAccessToken(params))
      }
    }, 900000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (changePasswordData) {
      window.location.replace(changePasswordData)
    }
  }, [changePasswordData])

  useEffect(() => {
    if (access_token) {
      const temp = jwtDecode(access_token)

      setDecodedAccessToken(temp)
    }
  }, [])

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          alt={decodedAccessToken?.given_name || 'Unknown User'}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        >
          {firstLetter}
        </Avatar>
        {/* <Avatar
          ref={anchorRef}
          alt='John Doe'
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        /> */}
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt={decodedAccessToken?.given_name || 'Unknown User'}>{firstLetter}</Avatar>
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {decodedAccessToken?.given_name + ' ' + decodedAccessToken?.family_name || 'John Doe'}
                      </Typography>
                      <Typography variant='caption'>{decodedAccessToken?.email || ' admin@vuexy.com'}</Typography>

                      <Typography variant='caption'>{currentPermissions[0]?.role || 'No role assigned'}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-user text-[22px]' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  {decodedAccessToken?.source === 'NON_AD_USER' && (
                    <MenuItem
                      className='mli-2 gap-3'
                      onClick={e => {
                        handleDropdownClose(e)
                        handleChangePassword()
                      }}
                    >
                      <i className='tabler-key text-[22px]' />
                      <Typography color='text.primary'>Change Password</Typography>
                    </MenuItem>
                  )}

                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-settings text-[22px]' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-currency-dollar text-[22px]' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-help-circle text-[22px]' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
