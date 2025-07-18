'use client'

import React from 'react'

import { Stack } from '@mui/material'

import DynamicTextField from '@/components/TextField/dynamicTextField'

const Page: React.FC = () => {
  return (
    <Stack direction='column' gap={5}>
      <DynamicTextField id='field1' label='First Name' defaultValue='' required={true} multiline={true} />
      <DynamicTextField id='field2' label='Last Name' defaultValue='' required={true} />
      <DynamicTextField id='field4' label='Age' type='number' defaultValue='25' />
      <DynamicTextField id='field5' label='Password' type='password' required={true} />
      <DynamicTextField id='field6' label='Disabled Field' disabled={true} defaultValue='Cannot Edit' />
      <DynamicTextField id='field7' label='Read Only Field' readOnly={true} defaultValue='Read Only Value' />
    </Stack>
  )
}

export default Page
