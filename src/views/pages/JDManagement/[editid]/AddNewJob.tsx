'use client'
import { Box, Card, Divider, Link, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
const AddNewJdSample = dynamic(() => import('@/form/generatedForms/addNewJdSample'), { ssr: false })
const ViewJd = dynamic(() => import('../viewJD'), { ssr: false })

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

const AddNewJob = () => {
  // Example: location.pathname = "/jd-management/add/jd"
  const pathname = usePathname() // Gets the full pathname
  const segments = pathname.split('/') // Split by "/"
  const mode = segments[2] // Extract "add, view or edit"
  const id = segments[3] // Extract "id"

  return (
    <>
      {(mode === 'add' || mode === 'edit') && (
        <>
          <AddNewJdSample mode={mode} id={id} />
        </>
      )}

      {mode === 'view' && <ViewJd mode={mode} id={id} />}
    </>
  )
}

export default AddNewJob
