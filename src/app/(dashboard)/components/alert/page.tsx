import React from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { Stack } from '@mui/material'
import DynamicAlert from '@/components/Alert/dynamicAlert'

function Page() {
  return (
    <Stack direction='column' gap={5}>
      <DynamicAlert severity='success' message='This is a success alert' />
      <DynamicAlert severity='info' message='This is an info alert.' />
      <DynamicAlert severity='warning' message='This is a warning alert.' variant='filled' />
      <DynamicAlert severity='error' message='This is an error alert.' />
      <DynamicAlert severity='success' message='Alert message with icon.' icon={<CheckIcon />} />
    </Stack>
  )
}

export default Page
