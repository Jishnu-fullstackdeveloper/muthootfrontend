import React from 'react'

import { useRouter } from 'next/navigation'

import { Button, Box } from '@mui/material'

const SystemManagement = () => {
  const router = useRouter() // Initialize router if using Next.js

  return (
    <Box className='flex'>
      <Button onClick={() => router.push('/system-management/view/xfactor')}>XFactor</Button>
      <Button onClick={() => router.push('/system-management/view/data-upload')}>Data Upload</Button>
      <Button onClick={() => router.push('/system-management/view/approval-category')}>Approval Category</Button>
    </Box>
  )
}

export default SystemManagement
