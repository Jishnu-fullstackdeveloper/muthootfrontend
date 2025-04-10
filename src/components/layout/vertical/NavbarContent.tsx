'use client'

// Third-party Imports
import { usePathname } from 'next/navigation' // Util Imports

import classnames from 'classnames'

// Component Imports
import { Breadcrumbs, Link, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home' // Import MUI Home icon

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
          {/* Add Home icon as the first breadcrumb without text */}
          <Link
            underline='hover'
            color='inherit'
            href='/home'
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main' }}
          >
            <HomeIcon sx={{ mr: 0 }} fontSize='small' /> {/* Removed text "Home" */}
          </Link>

          {pathSegments.map((segment, index) => {
            const breadcrumbPath = `/${pathSegments.slice(0, index + 1).join('/')}`
            const segmentText = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')

            // Skip "view", "edit", and "add" segments in breadcrumbs
            if (
              segment.toLowerCase() === 'view' ||
              segment.toLowerCase() === 'edit' ||
              segment.toLowerCase() === 'add'
            ) {
              return null
            }

            // Always render the last segment as non-clickable Typography
            const isLastSegment = index === pathSegments.length - 1

            return isLastSegment ? (
              <Typography key={breadcrumbPath} color='text.primary'>
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
