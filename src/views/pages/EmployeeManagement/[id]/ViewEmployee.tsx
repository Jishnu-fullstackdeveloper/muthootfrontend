'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import EmployeeProfilePage from '../EmployeeProfile'
import ResignationDataListingPage from '../ResignedEmployees/ResignationDataListing'

const ViewEmployeeeDetails = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[3] // Extract "add, view or edit"
  const settings = segments[4]

  return (
    <>
      {mode === 'view' && settings !== 'resigned-employee' && <EmployeeProfilePage />}
      {mode === 'view' && settings === 'resigned-employee' && <ResignationDataListingPage />}
    </>
  )
}

export default ViewEmployeeeDetails
