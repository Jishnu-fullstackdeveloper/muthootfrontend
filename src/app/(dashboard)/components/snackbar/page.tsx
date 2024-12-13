'use client'
import React from 'react'
import { SnackbarOrigin } from '@mui/material'
import DynamicSnackbar from '@/components/Snackbar/dynamicSnackbar'

function Page() {
  const dynamicMessage = 'I love dynamic snacks!'
  const buttonData: { label: string; position: SnackbarOrigin }[] = [
    { label: 'Top-Center', position: { vertical: 'top', horizontal: 'center' } },
    { label: 'Top-Left', position: { vertical: 'top', horizontal: 'left' } },
    { label: 'Top-Right', position: { vertical: 'top', horizontal: 'right' } },
    { label: 'Bottom-Left', position: { vertical: 'bottom', horizontal: 'left' } },
    { label: 'Bottom-Right', position: { vertical: 'bottom', horizontal: 'right' } },
    { label: 'Bottom-Center', position: { vertical: 'bottom', horizontal: 'center' } }
  ]

  return (
    <div>
      <DynamicSnackbar message={dynamicMessage} buttonData={buttonData} />
    </div>
  )
}

export default Page
