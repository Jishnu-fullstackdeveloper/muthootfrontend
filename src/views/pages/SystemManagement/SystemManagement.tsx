import React from 'react'

import { useRouter } from 'next/navigation'

import { Button, Box } from '@mui/material'

const SystemManagement = () => {
  const router = useRouter() // Initialize router if using Next.js

  return (
    <Box className='flex'>
      
      <Button onClick={() => router.push('/system-management/view/data-upload')}>Data Upload</Button>
      <Button onClick={() => router.push('/system-management/view/approval-category')}>Approval Category</Button>
      <Button onClick={() => router.push('/system-management/view/organizational-mapping')}>
        Organizational Mapping
      </Button>
      <Button onClick={() => router.push('/system-management/view/resigned-xfactor')}>
        Resigned XFactor
      </Button>
      <Button onClick={() => router.push('/system-management/view/vacancy-xfactor')}>Vacancy XFactor</Button> 
      <Button onClick={() => router.push('/system-management/view/interview-customization')}>
        Interview Customization
      </Button>
      <Button onClick={() => router.push('/system-management/view/scheduler')}>Scheduler</Button>
    </Box>
  )
}

export default SystemManagement
