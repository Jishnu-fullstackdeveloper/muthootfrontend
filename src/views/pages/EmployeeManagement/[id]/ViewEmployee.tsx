'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import EmployeeProfilePage from '../EmployeeProfile'
import ResignationDataListingPage from '../ResignedEmployees/ResignationDataListing'

const ViewEmployeeeDetails = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"
  const settings = segments[3]

  return (
    <>
      {mode === 'view' && settings !== 'resigned-employees' && <EmployeeProfilePage />}
      {mode === 'view' && settings === 'resigned-employees' && <ResignationDataListingPage />}
    </>
  )
}

export default ViewEmployeeeDetails
