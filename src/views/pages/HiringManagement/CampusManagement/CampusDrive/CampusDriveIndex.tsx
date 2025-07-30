'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import CampusDriveDetails from './CampusDriveDetails'
import AddOrEditCampusDrive from './AddCampusDrive'

const CampusDriveIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[4] // e.g., /hiring-management/campus-management/[mode]
  const id = segments[4] // Optional ID for edit/view modes

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditCampusDrive mode={mode} />}
      {mode === 'view' && id && <CampusDriveDetails />}
    </>
  )
}

export default CampusDriveIndex
