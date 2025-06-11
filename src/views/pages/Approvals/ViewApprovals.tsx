'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import ApprovalDetail from './ApprovalDetailView'

const ViewApprovalsPage = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[3] // Extract "add, view or edit"
  //const id = segments[4]

  return <>{mode === 'view' && <ApprovalDetail />}</>
}

export default ViewApprovalsPage
