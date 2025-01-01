// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import custom_theme_settings from '@/utils/custom_theme_settings.json'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import '@/app/custom.css'
import { getAccessToken, Logout } from '@/utils/functions'

import 'react-quill/dist/quill.snow.css'
import 'react-datepicker/dist/react-datepicker.css'

export const metadata = {
  title: custom_theme_settings?.theme?.meta_text || 'Vuexy - MUI Next.js Admin Dashboard Template',
  description:
    custom_theme_settings?.theme?.meta_text ||
    'Vuexy - MUI Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  var url: any
  if (typeof window !== 'undefined') {
    url = window.location.pathname
  }

  const guestRoutes = ['login', 'Login2Redirect']
  const privateRoute = ![...guestRoutes].some(route => url?.endsWith(route))
  const access_token = getAccessToken()

  if (!access_token && privateRoute) {
    setTimeout(() => {
      Logout()
    }, 3000)
  }

  return (
    <html id='__next' lang='en' dir={direction}>
      <head>
        {/* Metadata */}
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />

        {/* Favicon */}
        <link rel='icon' type='image/png' sizes='32x32' href={custom_theme_settings?.theme?.images?.favicon?.url} />
        <link rel='icon' type='image/png' sizes='16x16' href={custom_theme_settings?.theme?.images?.favicon?.url} />
        <link rel='apple-touch-icon' href={custom_theme_settings?.theme?.images?.favicon?.url} />
        <link rel='manifest' href={custom_theme_settings?.theme?.images?.favicon?.url} />
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
