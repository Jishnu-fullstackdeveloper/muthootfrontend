'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import ResignationDataListingPage from '../ResignationDataListing'
import ResignationDetailsPage from '../ResignationDetailView'

const ViewResignationDetails = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[3] // Extract "add, view or edit"
  //const settings = segments[4]
  //const id = segments[4]

  return (
    <>
      {/* {mode === 'view' && settings !== 'resigned-employees' && <EmployeeProfilePage />}
      {mode === 'view' && settings === 'resigned-employees' && <ResignationDataListingPage />} */}
      {mode === 'view' && <ResignationDetailsPage />}
    </>
  )
}

export default ViewResignationDetails
