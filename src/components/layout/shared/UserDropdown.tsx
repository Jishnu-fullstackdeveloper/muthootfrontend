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
import { useSettings } from '@core/hooks/useSettings'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { changePasswordApi, signOutApi, fetchNewAccessToken, LoginDataDismiss } from '@/redux/loginSlice'
import { getAccessToken, getRefreshToken, Logout, setAccessToken, setRefreshToken } from '@/utils/functions'
import { useAppSelector } from '@/lib/hooks'
import { jwtDecode } from 'jwt-decode'

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
  const [decodedAccessToken, setDecodedAccessToken] = useState<any>({})
  const access_token = getAccessToken()
  const refresh_token = getRefreshToken()

  const loginStates = useAppSelector((state: any) => state.loginReducer)

  const {
    newAccessTokenApiData,
    newAccessTokenApiSuccess,
    newAccessTokenApiFailure,
    newAccessTokenApiFailureMessage,
    changePasswordData,
    changePasswordFailure,
    changePasswordFailureMessage
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
    let params = {}

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
    let params = {}
    dispatch(changePasswordApi(params))
  }

  const pathName = usePathname()
  const guestRoutes = ['login', 'login-Redirect']
  const privateRoute = ![...guestRoutes].some(route => pathName.endsWith(route))

  // useEffect(() => {
  //   if (!access_token && privateRoute) {
  //     setTimeout(() => {
  //       Logout()
  //       return router.push('/login')
  //     }, 3000)
  //   }

  //   var url
  //   if (typeof window !== 'undefined') {
  //     url = window.location.pathname
  //   }

  //   if (url?.includes('login/pass_update')) {
  //     setTimeout(() => {
  //       Logout()
  //       router.push('/login')
  //     }, 3000)
  //   }
  // }, [])

  // /** Author : Siyad-M
  //  functionality: Fetching new access token to avoid unauthorization issue*/
  // useEffect(() => {
  //   if (newAccessTokenApiSuccess && newAccessTokenApiData?.access_token) {
  //     setAccessToken(newAccessTokenApiData.access_token)
  //     if (newAccessTokenApiData?.refresh_token) {
  //       setRefreshToken(newAccessTokenApiData?.refresh_token)
  //     }
  //   }

  //   if (newAccessTokenApiFailure && newAccessTokenApiFailureMessage) {
  //     // handleUserLogout()
  //     dispatch(LoginDataDismiss())
  //   }
  // }, [newAccessTokenApiSuccess, newAccessTokenApiData, newAccessTokenApiFailure, newAccessTokenApiFailureMessage])

  // // to call this api in every 2 minitues
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (access_token && refresh_token) {
  //       const decodedToken: any = jwtDecode(access_token)
  //       const params: any = {
  //         realm: decodedToken?.realm,
  //         refreshtoken: refresh_token
  //       }
  //       dispatch(fetchNewAccessToken(params))
  //     }
  //   }, 300000)
  //   return () => clearInterval(intervalId)
  // }, [])

  useEffect(() => {
    if (changePasswordData) {
      window.location.replace(changePasswordData)
    }
  }, [changePasswordData])

  // useEffect(() => {
  //   if (access_token) {
  //     let temp = jwtDecode(access_token)
  //     setDecodedAccessToken(temp)
  //   }
  // }, [])

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
          ref={anchorRef}
          alt='John Doe'
          src='/images/avatars/1.png'
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
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
                    <Avatar alt='John Doe' src='/images/avatars/1.png' />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {decodedAccessToken?.given_name + ' ' + decodedAccessToken?.family_name || 'John Doe'}
                      </Typography>
                      <Typography variant='caption'>{decodedAccessToken?.email || ' admin@vuexy.com'}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='tabler-user text-[22px]' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  <MenuItem
                    className='mli-2 gap-3'
                    //  onClick={e => handleDropdownClose(e, '/account/change-password')}
                    onClick={e => {
                      handleDropdownClose(e)
                      handleChangePassword()
                    }}
                  >
                    <i className='tabler-key text-[22px]' />
                    <Typography color='text.primary'>Change Password</Typography>
                  </MenuItem>

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
