'use client'
import DynamicButton from '@/components/Button/dynamicButton'
import { Box, Card } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

const ApprovalSettings = () => {
  const router = useRouter()
  return (
    <div>
      {/* justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis */}
      <div className='flex justify-end p-1'>
        <Box className='flex gap-4 justify-end' sx={{ alignItems: 'flex-end', mt: 4 }}>
          <DynamicButton
            label='New Approval'
            variant='contained'
            icon={<i className='tabler-plus' />}
            position='start'
            onClick={() => router.push(`/approval-matrix/add/new-approval`)}
            children='New Approval'
          />
        </Box>
      </div>
    </div>
  )
}

export default ApprovalSettings
