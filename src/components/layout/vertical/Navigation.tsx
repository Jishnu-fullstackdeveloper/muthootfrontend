'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles' //useColorScheme

// Type Imports
import type { Mode, SystemMode } from '@core/types'

// Component Imports
import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

//cusom theme json import
import custom_theme_settings from '@/utils/custom_theme_settings.json'

type Props = {
  mode: Mode
  systemMode: SystemMode
}

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background:
    'linear-gradient(#0191DA 10%, rgba(1,145,218,0.85) 30%, rgba(1,145,218,0.5) 65%, rgba(1,145,218,0.3) 75%, transparent)',
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = (props: Props) => {
  // Props
  const { mode, systemMode } = props

  // Hooks
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()

  // const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()

  // Refs
  const shadowRef = useRef(null)

  // Vars
  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isServer = typeof window === 'undefined'
  const isSemiDark = settings.semiDark
  let isDark

  if (isServer) {
    isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark'
  }

  //  else {
  //   isDark = muiMode === 'system' ? muiMode === 'dark' : muiMode === 'dark'
  // }

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-ignore
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return (
    // eslint-disable-next-line lines-around-comment
    // Sidebar Vertical Menu
    <VerticalNav
      customStyles={{
        ...navigationCustomStyles(verticalNavOptions, theme),
        '&': {
          backgroundColor: '#0191DA',
          color: '#FFFFFF'
        },
        '& .MuiTypography-root, & .MuiListItemText-primary, & .MuiListItemText-secondary': {
          color: '#FFFFFF'
        },
        '& i': {
          color: '#FFFFFF'
        }
      }}
      collapsedWidth={71}
      backgroundColor='#0191DA'
      width={220}
      // eslint-disable-next-line lines-around-comment
      // The following condition adds the data-mui-color-scheme='dark' attribute to the VerticalNav component
      // when semiDark is enabled and the mode or systemMode is light
      {...(isSemiDark &&
        !isDark && {
          'data-mui-color-scheme': 'dark'
        })}
    >
      {/* Nav Header including Logo & nav toggle icons  */}
      <NavHeader>
        <div className='ml-10'>
          <Logo />
        </div>
        {!(isCollapsed && !isHovered) && (
          <NavCollapseIcons
            lockedIcon={
              <i
                className={
                  custom_theme_settings?.theme?.styles?.verticalMenuLockedIcon
                    ? custom_theme_settings.theme.styles?.verticalMenuLockedIcon
                    : 'tabler-chevron-left text-xxl'
                }
              />
            }
            unlockedIcon={
              <i
                className={
                  custom_theme_settings?.theme?.styles?.verticalMenuUnlockedIcon
                    ? custom_theme_settings?.theme?.styles?.verticalMenuUnlockedIcon
                    : 'tabler-chevron-right text-xxl'
                }
              />
            }
            closeIcon={<i className='tabler-x text-xxl' />}
            onClick={() => updateSettings({ layout: !isCollapsed ? 'collapsed' : 'vertical' })}
          />
        )}
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      <VerticalMenu scrollMenu={scrollMenu} />
    </VerticalNav>
  )
}

export default Navigation
