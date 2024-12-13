'use client'

import React from 'react'
import Stack from '@mui/material/Stack'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DynamicCheckbox from '@/components/Checkbox/dynamicCheckbox'

const CheckboxPage: React.FC = () => {
  return (
    <Stack spacing={2} direction='column'>
      <DynamicCheckbox label='Checkbox' checked />
      <DynamicCheckbox label='Required Checkbox' required />
      <DynamicCheckbox label='Disabled Checkbox' disabled />
      <DynamicCheckbox label='Checkbox with Icon' icon={<BookmarkBorderIcon />} />
    </Stack>
  )
}

export default CheckboxPage
