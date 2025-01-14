'use client'
import { useEffect, useRef, useState, createContext } from 'react'

import { Provider } from 'react-redux'

import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
export const UserContext = createContext<any | null>(null)

// Util Imports
import { AppStore, makeStore } from '@/redux/store'
import { usePathname, useRouter } from 'next/navigation'
import { getAccessToken, Logout } from '@/utils/functions'

import 'react-toastify/dist/ReactToastify.css'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props
  const router = useRouter()
  // Vars
  const mode = 'light'
  const settingsCookie = JSON.parse('{}')
  const demoName = null
  const systemMode = 'light'
  // const mode = getMode()
  // const settingsCookie = getSettingsFromCookie()
  // const demoName = getDemoName()
  // const systemMode = getSystemMode()

  const pathName = usePathname()
  // const dispatch = useAppDispatch()

  //here the logic comes
  const guestRoutes = ['login', 'login-Redirect']
  // const privateRoute = ![...guestRoutes].some(route => pathName.endsWith(route))
  const privateRoute = ![...guestRoutes].some(route => pathName.includes(route))
  const access_token = getAccessToken()

  // var url: any
  // if (typeof window !== 'undefined') {
  //   url = window.location.pathname
  // }

  // useEffect(() => {
  //   if (!access_token && privateRoute && typeof window !== 'undefined') {
  //     Logout()
  //     let path = process.env.NEXT_PUBLIC_URL + '/login'
  //     window.location.replace(path)
  //   }
  // }, [])

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
  //   if (url?.includes('login/*')) {
  //     Logout()
  //     router.push('/login')
  //   }

  //   if (url?.endsWith('jd-management')) {
  //     router.push('/jd-management')
  //   }
  // }, [])

  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </Provider>
  )
}

export default Providers
