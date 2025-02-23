'use client'

// Third-party Imports
import { usePathname } from 'next/navigation' // Util Imports

import classnames from 'classnames'

// Component Imports
import { Breadcrumbs, Link, Typography } from '@mui/material'

import NavToggle from './NavToggle'

// import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <Breadcrumbs
          aria-label='breadcrumb'
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '1rem',
            fontSize: '14px'
          }}
        >
          {pathSegments.map((segment, index) => {
            const breadcrumbPath = `/${pathSegments.slice(0, index + 1).join('/')}`
            const segmentText = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')

            // Disable navigation for "View" segment
            const isViewSegment =
              segment.toLowerCase() === 'view' || segment.toLowerCase() === 'edit' || segment.toLowerCase() === 'add'

            return index === pathSegments.length - 1 ? (
              <Typography key={breadcrumbPath} color='text.primary'>
                {segmentText}
              </Typography>
            ) : isViewSegment ? (
              <Typography key={breadcrumbPath} color='text.secondary'>
                {segmentText}
              </Typography>
            ) : (
              <Link
                key={breadcrumbPath}
                underline='hover'
                color='inherit'
                href={breadcrumbPath}
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                {segmentText}
              </Link>
            )
          })}
        </Breadcrumbs>

        {/* <ModeDropdown /> */}
      </div>
      <div className='flex items-center'>
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
