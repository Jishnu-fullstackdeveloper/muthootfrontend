'use client'
import { Box, Typography, IconButton, Divider } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'
import DynamicCard from '@/components/Card/dynamicCard'
import { blue, blueGrey } from '@mui/material/colors'

const ApprovalCategory = () => {
  const router = useRouter()

  // Sample data (replace with actual data when integrating)
  const approvalMatrixData = [
    { id: '1', categoryType: 'Finance' },
    { id: '2', categoryType: 'HR' },
    { id: '3', categoryType: 'IT' }
  ]

  // Handle view
  const handleView = (rowData: any) => {
    router.push(`/approval-matrix/view/${rowData.id}`)
  }

  return (
    <Box>
      <Box className='flex justify-between p-1 w-full'>
        <Typography variant='h4'>Approval Matrix Categories</Typography>
      </Box>

      <Box className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {approvalMatrixData.map(item => (
          <Box
            key={item.id}
            onClick={() => handleView(item)}
            sx={{
              cursor: 'pointer',
              transition: 'border 0.3s ease-in-out',
              border: '2px solid transparent',
              borderRadius: '8px',
              '&:hover': {
                borderColor: 'primary.main' // Changes border to primary color on hover
              }
            }}
          >
            <DynamicCard
              cardHeader={
                <>
                  <Box className='flex flex-row justify-between'>
                    <Typography variant='h5' className='mt-1' gutterBottom>
                      Category Type
                    </Typography>
                    <div>
                      <IconButton
                        aria-label='edit'
                        sx={{
                          ':hover': { color: 'primary.main' }
                        }}
                        onClick={e => {
                          e.stopPropagation() // Prevent card click
                          //   router.push(`/approval-category/edit/`)
                        }}
                      >
                        <i className='tabler-edit' />
                      </IconButton>
                      {/* <IconButton
                        aria-label='delete'
                        sx={{
                          ':hover': { color: 'error.main' }
                        }}
                        onClick={e => {
                          e.stopPropagation() // Prevent card click
                          //   router.push(`/approval-category/delete/`)
                        }}
                      >
                        <i className='tabler-trash' />
                      </IconButton> */}
                    </div>
                  </Box>
                  <Divider sx={{ scale: 1, borderColor: 'primary.main' }} /> {/* Horizontal line added */}
                </>
              }
              cardBody={<Typography variant='h6'>{item.categoryType}</Typography>}
              sx={{
                base: { minWidth: 275, padding: '2px' },
                header: { fontWeight: 'bold' },
                footer: { display: 'flex', justifyContent: 'flex-end' }
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ApprovalCategory
