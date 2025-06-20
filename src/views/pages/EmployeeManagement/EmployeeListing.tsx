'use client'
import React, { useState, useEffect, useRef } from 'react'

// import { useRouter } from 'next/navigation'

//import type { TextFieldProps } from '@mui/material'
import { Box, Card, TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

//import CustomTextField from '@/@core/components/mui/TextField'
import EmployeeTable from './EmployeeTableList'

import { useAppDispatch } from '@/lib/hooks'
import { fetchEmployees } from '@/redux/EmployeeManagement/employeeManagementSlice'

const EmployeeListingPage = () => {
  const dispatch = useAppDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Debounced search effect
  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchEmployees({ page: 1, limit: 5, search: searchQuery }))
    }, 300) // 300ms delay, matching VacancyListingPage

    // Cleanup function to clear timeout
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery, dispatch])

  return (
    <>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-4 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap mt-2'>
            <TextField
              label='Search by Employee Name'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ width: '400px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {searchQuery && (
                      <IconButton size='small' onClick={() => setSearchQuery('')} edge='end'>
                        <ClearIcon fontSize='small' />
                      </IconButton>
                    )}
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          {/* <Button
            variant='contained'
            color='primary'
            className='self-center'
            size='medium'
            onClick={() => router.push('/employee-management/view/resigned-employees')}
          >
            Resigned Employees
          </Button> */}
        </Box>
      </Card>
      {/* <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
        Employee List
      </Typography> */}
      <EmployeeTable />
    </>
  )
}

export default EmployeeListingPage
