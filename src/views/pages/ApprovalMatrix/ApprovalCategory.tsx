'use client'
import {
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DynamicCard from '@/components/Card/dynamicCard'
//import { blue, blueGrey } from '@mui/material/colors'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchApprovalCategories } from '@/redux/approvalMatrixSlice'

const ApprovalCategory = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { approvalCategories, status, totalItems } = useAppSelector(state => state.approvalMatrixReducer)

  // Handle view
  const handleView = (rowData: any) => {
    router.push(`/approval-matrix/view/${rowData.id}?id=${rowData.id}`)
  }

  const [paginationState, setPaginationState] = React.useState({
    page: 1,
    limit: 10
  })

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationState({ ...paginationState, page: value })
    dispatch(fetchApprovalCategories({ page: value, limit: paginationState.limit }))
  }

  const handleChangeLimit = (value: any) => {
    setPaginationState({ ...paginationState, limit: value })
    dispatch(fetchApprovalCategories({ page: paginationState.page, limit: value }))
  }

  // Fetch approval categories on page load or pagination change
  useEffect(() => {
    dispatch(fetchApprovalCategories({ page: paginationState.page, limit: paginationState.limit }))
  }, [paginationState.page, paginationState.limit, dispatch])

  return (
    <Box>
      <Box className='flex justify-between p-1 w-full'>
        <Typography variant='h4'>Approval Matrix Categories</Typography>
      </Box>

      <Box className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {status === 'loading' ? (
          <Typography>Loading...</Typography>
        ) : (
          approvalCategories.map(item => (
            <Box
              key={item.id}
              onClick={() => handleView(item)}
              sx={{
                cursor: 'pointer',
                transition: 'border 0.3s ease-in-out',
                border: '1px solid transparent',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: 'primary.main'
                }
              }}
            >
              <DynamicCard
                cardHeader={
                  <>
                    <Box className='flex flex-row justify-between'>
                      <Typography variant='h5' className='mt-1' gutterBottom>
                        {item.name}
                      </Typography>
                      <div>
                        <IconButton
                          aria-label='edit'
                          sx={{
                            ':hover': { color: 'primary.main' }
                          }}
                          onClick={e => {
                            e.stopPropagation() // Prevent card click
                          }}
                        >
                          <i className='tabler-edit' />
                        </IconButton>
                      </div>
                    </Box>
                    <Divider sx={{ scale: 1, borderColor: 'primary.main' }} />
                  </>
                }
                cardBody={<Typography variant='h6'>{item.description}</Typography>}
                sx={{
                  base: { minWidth: 275, padding: '2px', height: '200px' },
                  header: { fontWeight: 'bold' },
                  footer: { display: 'flex', justifyContent: 'flex-end' }
                }}
              />
            </Box>
          ))
        )}
      </Box>

      <div className='flex items-center justify-end mt-6'>
        <FormControl size='small' sx={{ minWidth: 70 }}>
          <InputLabel>Count</InputLabel>
          <Select
            value={paginationState.limit}
            onChange={e => handleChangeLimit(e.target.value)}
            label='Limit per page'
          >
            {[10, 25, 50, 100].map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          color='primary'
          shape='rounded'
          showFirstButton
          showLastButton
          count={Math.ceil(totalItems / paginationState.limit)} // Calculate total pages
          page={paginationState.page}
          onChange={handlePageChange}
        />
      </div>
    </Box>
  )
}

export default ApprovalCategory
