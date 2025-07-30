'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import CollegeDetails from './CollegeDetailView'

// Placeholder import for AddOrEditCollege (implement separately)
import CollegeAndSpocForm from './AddCollegeAndSpoc'

const CollegeAndSpocIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[4] // e.g., /hiring-management/campus-management/[mode]
  const id = segments[3] // Optional ID for edit/view modes

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <CollegeAndSpocForm mode={mode} />}
      {mode === 'view' && id && <CollegeDetails />}
    </>
  )
}

export default CollegeAndSpocIndex
