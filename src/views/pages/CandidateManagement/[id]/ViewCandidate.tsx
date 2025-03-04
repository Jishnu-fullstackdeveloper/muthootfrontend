'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import CandidateDetails from '../CandidateDetailsView'

const ViewCandidateDetails = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"

  return <>{mode === 'view' && <CandidateDetails />}</>
}

export default ViewCandidateDetails
