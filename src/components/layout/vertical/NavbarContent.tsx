'use client'

// Third-party Imports
import { usePathname } from 'next/navigation'

import classnames from 'classnames'

// Component Imports
import { Breadcrumbs, Link, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'

import NavToggle from './NavToggle'

// import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  // Find the index of the first 'add', 'view', or 'edit' segment
  const specialSegmentIndex = pathSegments.findIndex(segment => ['add', 'view', 'edit'].includes(segment.toLowerCase()))

  // Determine the index of the clickable segment
  let clickableSegmentIndex: number

  if (specialSegmentIndex !== -1) {
    // If 'add', 'view', or 'edit' exists, make the segment before it clickable
    clickableSegmentIndex = specialSegmentIndex - 1
  } else {
    // If no 'add', 'view', or 'edit', make the last segment clickable
    clickableSegmentIndex = pathSegments.length - 1
  }

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
            <HomeIcon sx={{ mr: 0 }} fontSize='small' />
          </Link>

          {pathSegments.map((segment, index) => {
            // Skip "view", "edit", and "add" segments in breadcrumbs
            if (['view', 'edit', 'add'].includes(segment.toLowerCase())) {
              return null
            }

            const breadcrumbPath = `/${pathSegments.slice(0, index + 1).join('/')}`

            // Decode URL component and format segment text
            const decodedSegment = decodeURIComponent(segment)
            const segmentText = decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1).replace(/-/g, ' ')

            // Determine if this segment should be clickable
            // Only the segment at clickableSegmentIndex should be clickable
            const isClickable = index === clickableSegmentIndex

            return isClickable ? (
              <Link
                key={breadcrumbPath}
                underline='hover'
                color='inherit'
                href={breadcrumbPath}
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                {segmentText}
              </Link>
            ) : (
              <Typography key={breadcrumbPath} color='text.primary'>
                {segmentText}
              </Typography>
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
