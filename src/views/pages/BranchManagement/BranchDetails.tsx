'use client'

import { Box, Card, Divider, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import { usePathname } from 'next/navigation'

// Dynamically import the ViewBranch component
const ViewBranch = dynamic(() => import('./ViewBranch'), { ssr: false })

const BranchDetails = () => {
  const pathname = usePathname() // Gets the current path
  const segments = pathname.split('/') // Splits the path into segments
  const mode = segments[2] // Extract the mode: 'add', 'edit', or 'view'
  const id = segments[3] // Extract the branch ID

  return (
    <>
      {/* Render the ViewBranch component if the mode is 'view' */}
      {mode === 'view' && <ViewBranch mode={mode} id={id} />}
    </>
  )
}

export default BranchDetails
