'use client'
import AddNewBucket from '@/form/generatedForms/addBucket'
import { usePathname } from 'next/navigation'
import React from 'react'

const BucketManagementIndex = () => {
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"
  const id = segments[3]
  return (
    <>
      <AddNewBucket />
    </>
  )
}
export default BucketManagementIndex
