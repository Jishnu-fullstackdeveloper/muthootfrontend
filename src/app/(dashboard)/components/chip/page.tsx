'use client'

import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import DynamicChip from '@/components/Chip/dynamicChip'
import { Stack } from '@mui/material'

const Page: React.FC = () => {
  const handleClick = (label: string) => {
    console.info(`You clicked the chip: ${label}`)
  }

  const handleDelete = (label: string) => {
    console.info(`You clicked the delete icon of chip: ${label}`)
  }

  return (
    <Stack spacing={2} direction='row'>
      <DynamicChip label='Filled Chip 1' variant='filled' />
      <DynamicChip label='Outlined Chip 2' variant='outlined' />
      <DynamicChip label='Clickable Chip 3' onClick={() => handleClick('Clicked')} />
      <DynamicChip
        label='Custom delete icon'
        variant='outlined'
        onDelete={() => handleDelete('Custom delete icon outlined')}
        deleteIcon={<DeleteIcon />}
      />
    </Stack>
  )
}

export default Page
