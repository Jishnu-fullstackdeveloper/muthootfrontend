'use client'

import { CircularIndeterminate, CircularWithValueLabel } from '@/components/Progress/dynamicProgress'
import { Typography } from '@mui/material'
import React from 'react'

function Page() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography>Loading Indicator with Progress</Typography>
      <CircularWithValueLabel />

      <Typography>Indeterminate Loading Indicator</Typography>
      <CircularIndeterminate />
    </div>
  )
}

export default Page
