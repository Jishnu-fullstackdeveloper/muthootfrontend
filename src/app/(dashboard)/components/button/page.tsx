'use client'

import React from 'react'

import Stack from '@mui/material/Stack'
import ErrorOutline from '@mui/icons-material/Delete'

import DynamicButton from '@/components/Button/dynamicButton'

const Page: React.FC = () => {
  return (
    <Stack spacing={4} direction='row'>
      <DynamicButton
        children='Contained Button'
        variant='contained'
        onClick={() => alert('Contained Button Clicked')}
      />
      <DynamicButton children='Disabled Button' variant='outlined' disabled />
      <DynamicButton children='Outlined Button' variant='outlined' />
      <DynamicButton children='Text Button' variant='text' />
      <DynamicButton children='Success Button' variant='contained' color='success' />
      <DynamicButton
        children='Error Button'
        variant='text'
        color='error'
        onClick={() => alert('Error Button Clicked')}
      />
      <DynamicButton children='Button with Icon' variant='outlined' icon={<ErrorOutline />} position='end' />
    </Stack>
  )
}

export default Page
