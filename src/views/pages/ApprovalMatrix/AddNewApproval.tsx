'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import AddNewApprovalMatrixGenerated from '@/form/generatedForms/AddNewApprovalMatrix'

// import ApprovalSettings from './ApprovalSettings'

const AddNewApproval = () => {
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"

  return (
    <div>
      {/* {mode === 'view' && <ApprovalSettings />} */}
      {mode === 'add' && <AddNewApprovalMatrixGenerated />}
      {mode === 'edit' && <AddNewApprovalMatrixGenerated />}
    </div>
  )
}

export default AddNewApproval
