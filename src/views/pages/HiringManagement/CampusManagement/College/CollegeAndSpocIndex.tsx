'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import CollegeDetails from './CollegeDetailView'

// Placeholder import for AddOrEditCollege (implement separately)
import CollegeAndSpocForm from './AddCollegeAndSpoc'
import CollegeAndSpocEditForm from './EditCollegeAndSpoc'

const CollegeAndSpocIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[4] // e.g., /hiring-management/campus-management/[mode]
  const id = segments[3] // Optional ID for edit/view modes

  return (
    <>
      {mode === 'add' && <CollegeAndSpocForm mode={mode} />}
      {mode === 'edit' && <CollegeAndSpocEditForm mode={mode} id={id} />}
      {mode === 'view' && id && <CollegeDetails />}
    </>
  )
}

export default CollegeAndSpocIndex
