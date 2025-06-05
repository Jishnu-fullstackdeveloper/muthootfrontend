'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Next Imports
// import Img from 'next/image'
import Link from 'next/link'

// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import { Box } from '@mui/material'

import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'
import custom_theme_settings from '@/utils/custom_theme_settings.json'

// Component Imports
import VuexyLogo from '@core/svg/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

type LogoTextProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
}

const LogoText = styled.span<LogoTextProps>`
  font-size: 1.375rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  color: var(--mui-palette-text-primary);
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed }) =>
    isCollapsed && !isHovered ? 'opacity: 0; margin-inline-start: 0;' : 'opacity: 1; margin-inline-start: 12px;'}
`

const Logo = () => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, transitionDuration } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout])

  // You may return any JSX here to display a logo in the sidebar header
  // return <Img src='/next.svg' width={100} height={25} alt='logo' /> // for example
  return (
    <Link href='/home' className='flex items-center'>
      {custom_theme_settings?.theme?.images?.logo?.url ? (
        <Box
          component='img'
          src={custom_theme_settings?.theme?.images?.logo?.url}
          alt={custom_theme_settings?.theme?.images?.logo?.altText}
          sx={{
            width: {
              xs: custom_theme_settings?.theme?.images?.logo?.width?.xs_phones || 30, // Small screen size (e.g., phones)
              sm: custom_theme_settings?.theme?.images?.logo?.width?.sm_tablets || 40, // Medium screen size (e.g., tablets)
              md: custom_theme_settings?.theme?.images?.logo?.width?.md_desktops || 50 // Larger screen size (e.g., desktops)
            },
            height: custom_theme_settings?.theme?.images?.logo?.height || 'auto', // Maintain aspect ratio
            borderRadius: '50%' // Optional: Circular image
          }}
        />
      ) : (
        <VuexyLogo className='text-2xl text-primary' />
      )}

      <LogoText
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={layout === 'collapsed'}
        transitionDuration={transitionDuration}
      >
        {themeConfig.templateName}
      </LogoText>
    </Link>
  )
}

export default Logo
