'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import { deepmerge } from '@mui/utils'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  lighten,
  darken
} from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import type {} from '@mui/material/themeCssVarsAugmentation' // Do not remove this import otherwise you will get type errors while making a production build
import type {} from '@mui/lab/themeAugmentation' // Do not remove this import otherwise you will get type errors while making a production build

// Third-party Imports
import { useMedia } from 'react-use'
import stylisRTLPlugin from 'stylis-plugin-rtl'

// Type Imports
import type { ChildrenType, Direction, SystemMode } from '@core/types'

// Component Imports
import ModeChanger from './ModeChanger'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Core Theme Imports
import defaultCoreTheme from '@core/theme'

type Props = ChildrenType & {
  direction: Direction
  systemMode: SystemMode
}

const ThemeProvider = (props: Props) => {
  // Props
  const { children, direction, systemMode } = props

  // Hooks
  const { settings } = useSettings()
  const isDark = useMedia('(prefers-color-scheme: dark)', false)

  // Vars
  const isServer = typeof window === 'undefined'
  let currentMode: SystemMode

  if (isServer) {
    currentMode = systemMode
  } else {
    if (settings.mode === 'system') {
      currentMode = isDark ? 'dark' : 'light'
    } else {
      currentMode = settings.mode as SystemMode
    }
  }

  // Define typography settings to enforce standard font sizes
  const typographySettings = {
    // Base font size for the entire application
    // fontSize: 14, // Sets the default font size to 14px (standard size)

    // Define specific typography variants for consistency
    h1: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.975rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '0.77rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '.5rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none' as const // Prevent uppercase by default
    }
  }

  // Define component overrides for specific MUI components
  const componentOverrides = {
    // Override MuiMenuItem to ensure consistent font size in menus (like VerticalMenu)
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          padding: '8px 16px',
          lineHeight: 1.5
        }
      }
    },
    // Override MuiTypography to ensure typography aligns with defined settings
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '.95rem'
        }
      }
    },
    // Override MuiButton to ensure buttons have consistent typography
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.65rem',
          padding: '6px 16px'
        }
      }
    },
    // Override MuiTableHead to customize TableHead styles
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: currentMode === 'dark' ? '#2d3748' : '#f5f5f5', // Background color for table header
          '& .MuiTableCell-head': {
            fontSize: '0.75rem', // Font size for table header cells
            fontWeight: 600, // Bold text for headers
            color: currentMode === 'dark' ? '#e2e8f0' : '#374151', // Text color based on mode
            padding: '12px', // Adjust padding for header cells
            lineHeight: 1.4
          }
        }
      }
    },
    // Override MuiTableBody to customize TableBody styles
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: currentMode === 'dark' ? '#4a5568' : '#f9fafb' // Hover effect for rows
            }
          },
          '& .MuiTableCell-root': {
            // Target all TableCell components within TableBody
            fontSize: '0.57rem', // Font size for table body cells (matches body1)
            fontWeight: 400, // Regular weight for body cells
            color: currentMode === 'dark' ? '#d1d5db' : '#4b5563', // Text color based on mode
            padding: '10px', // Adjust padding for body cells
            lineHeight: 1.5,
            whiteSpace: 'nowrap', // Ensure nowrap is applied here to avoid conflict with sx
            '& > *': {
              // Ensure nested elements (e.g., from flexRender) inherit styles
              fontSize: 'inherit',
              fontWeight: 'inherit',
              color: 'inherit',
              lineHeight: 'inherit'
            }
          }
        }
      }
    }
  }

  // Merge the primary color scheme override with the core theme
  const theme = useMemo(() => {
    const newColorScheme = {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: settings.primaryColor,
              light: lighten(settings.primaryColor as string, 0.2),
              dark: darken(settings.primaryColor as string, 0.1)
            }
          }
        },
        dark: {
          palette: {
            primary: {
              main: settings.primaryColor,
              light: lighten(settings.primaryColor as string, 0.2),
              dark: darken(settings.primaryColor as string, 0.1)
            }
          }
        }
      }
    }

    // Merge the core theme with typography and component overrides
    const coreTheme = deepmerge(deepmerge(defaultCoreTheme(settings, currentMode, direction), newColorScheme), {
      typography: typographySettings, // Apply typography settings
      components: componentOverrides // Apply component overrides
    })

    return extendTheme(coreTheme)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.primaryColor, settings.skin, currentMode])

  return (
    <AppRouterCacheProvider
      options={{
        prepend: true,
        ...(direction === 'rtl' && {
          key: 'rtl',
          stylisPlugins: [stylisRTLPlugin]
        })
      }}
    >
      <CssVarsProvider
        theme={theme}
        defaultMode={systemMode}
        modeStorageKey={`${themeConfig.templateName.toLowerCase().split(' ').join('-')}-mui-template-mode`}
      >
        <>
          <ModeChanger />
          <CssBaseline />
          {children}
        </>
      </CssVarsProvider>
    </AppRouterCacheProvider>
  )
}

export default ThemeProvider
