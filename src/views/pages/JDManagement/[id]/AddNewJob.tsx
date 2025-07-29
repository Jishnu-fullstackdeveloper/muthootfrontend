'use client'

import React from 'react'

import dynamic from 'next/dynamic'

const AddNewJdSample = dynamic(() => import('@/form/generatedForms/addNewJdSample'), { ssr: false })

const ViewJd = dynamic(() => import('../viewJD'), { ssr: false })
const EditJd = dynamic(() => import('../EditJd'), { ssr: false })

import { usePathname } from 'next/navigation'

const AddNewJob = () => {
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"
  // const id = segments[3] // Extract "id"

  return (
    <>
      {mode === 'add' && (
        <>
          <AddNewJdSample />
        </>
      )}
      {mode === 'view' && <ViewJd />} {/* mode={mode} id={id} > */}
      {mode === 'edit' && <EditJd />}
    </>
  )
}

export default AddNewJob
