'use client'

import React from 'react'

import { Typography } from '@mui/material'

import { CircularIndeterminate, CircularWithValueLabel } from '@/components/Progress/dynamicProgress'

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
