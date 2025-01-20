'use client'
import AddNewApprovalMatrixGenerated from '@/form/generatedForms/AddNewApprovalMatrix'
import { usePathname } from 'next/navigation'
import React from 'react'

const AddNewApproval = () => {
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"
  const id = segments[3] // Extract "id"
  return <div>
    {mode === 'add' && <AddNewApprovalMatrixGenerated />} 
    {mode === 'edit' && <AddNewApprovalMatrixGenerated />}</div>
}

export default AddNewApproval
