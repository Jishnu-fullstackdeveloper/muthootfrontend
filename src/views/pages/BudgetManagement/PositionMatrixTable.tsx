'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { Box, Typography, Card, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { GroupAddOutlined, GroupOutlined, HowToRegOutlined } from '@mui/icons-material'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchEmployees } from '@/redux/EmployeeManagement/employeeManagementSlice'
import { ROUTES } from '@/utils/routes'

interface AnimatedNumberProps {
  number: number
  duration?: number // in milliseconds
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ number, duration = 900 }) => {
  const [displayNumber, setDisplayNumber] = useState(0)
  const startTimestamp = useRef<number | null>(null)
  const startValue = useRef(0)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    const step = (timestamp: number) => {
      if (!startTimestamp.current) startTimestamp.current = timestamp
      const progress = timestamp - startTimestamp.current

      const percentage = Math.min(progress / duration, 1)
      const current = Math.floor(startValue.current + (number - startValue.current) * percentage)

      setDisplayNumber(current)

      if (percentage < 1) {
        requestRef.current = requestAnimationFrame(step)
      }
    }

    cancelAnimationFrame(requestRef.current || 0)
    startValue.current = displayNumber
    startTimestamp.current = null
    requestRef.current = requestAnimationFrame(step)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [number])

  return <span>{displayNumber}</span>
}

interface EmployeeDetails {
  employeeId: string // Maps to employeeCode or id from API
  fullName: string // Maps to title + firstName + middleName + lastName
  designation: string // Maps to designation.name
  dateOfJoining: string // Maps to employeeDetails.dateOfJoining
  employmentStatus: string // Maps to employeeDetails.employmentStatus or type
  id: string // For action column navigation
}

const PositionMatrixTable = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { employees, status, error, totalCount } = useAppSelector(state => state.employeeManagementReducer)
  const { positionMatrixData } = useAppSelector(state => state.positionBudgetMatrixReducer)

  // Extract designation and employeeCodes from searchParams
  const designation = searchParams.get('designation') || ''
  const employeeCodes = searchParams.get('employeeCodes') ? searchParams.get('employeeCodes')!.split(',') : []

  // Get the latest createPositionMatrix response from positionMatrixData
  const latestPositionMatrix = positionMatrixData.length > 0 ? positionMatrixData[positionMatrixData.length - 1] : null

  console.log(employeeCodes)

  // Memoize query parameters to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      designation,
      employeeCodes
    }),
    [searchParams]
  )

  const columnHelper = createColumnHelper<EmployeeDetails>()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const [searchQuery, setSearchQuery] = useState('')
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Debounced API call
  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      dispatch(
        fetchEmployees({
          page: pagination.pageIndex + 1, // API uses 1-based indexing
          limit: pagination.pageSize,
          search: searchQuery || undefined,
          employeeCodes: queryParams.employeeCodes.length > 0 ? queryParams.employeeCodes : undefined
        })
      )
    }, 300)

    // Cleanup function to clear timeout
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [dispatch, pagination.pageIndex, pagination.pageSize, searchQuery, queryParams])

  // Map API data to table format
  const tableData = useMemo(() => {
    // Use employees from the latest createPositionMatrix response if available
    const dataSource =
      latestPositionMatrix && latestPositionMatrix.employees ? latestPositionMatrix.employees : employees

    const mappedData = dataSource.map(item => ({
      employeeId: item.employeeCode || item.id || '', // Fallback to empty string if missing
      fullName: `${item.title || ''} ${item.firstName || 'Unknown'}${item.middleName ? ` ${item.middleName}` : ''}${
        item.lastName ? ` ${item.lastName}` : ''
      }`.trim(), // Combine title, firstName, middleName, lastName
      designation: item.designation?.name || queryParams.designation || 'Unknown', // Use query designation if missing
      dateOfJoining: item.employeeDetails?.dateOfJoining || '', // Fallback to empty string if missing
      employmentStatus: item.employeeDetails?.employmentStatus || 'Unknown', // Map type if needed (item.type)
      id: item.id || '' // For action column navigation
    }))

    console.log('PositionMatrixTable: Table data updated', { data: mappedData, totalCount })

    return {
      data: mappedData as EmployeeDetails[], // Ensure type matches EmployeeDetails
      totalCount:
        latestPositionMatrix && latestPositionMatrix.employees ? latestPositionMatrix.employees.length : totalCount
    }
  }, [employees, totalCount, queryParams.designation, latestPositionMatrix])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const columns = useMemo<ColumnDef<EmployeeDetails, any>[]>(
    () => [
      columnHelper.accessor('employeeId', {
        header: 'EMPLOYEE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeId}</Typography>
      }),
      columnHelper.accessor('fullName', {
        header: 'FULL NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designation}</Typography>
      }),
      columnHelper.accessor('dateOfJoining', {
        header: 'DATE OF JOINING',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.dateOfJoining ? row.original.dateOfJoining.split('T')[0] : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('employmentStatus', {
        header: 'EMPLOYMENT STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employmentStatus}</Typography>
      }),
      columnHelper.display({
        id: 'action',
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <IconButton
              onClick={() => router.push(ROUTES.USER_MANAGEMENT.EMPLOYEE_VIEW(row.original.id))}
              sx={{ fontSize: 18 }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  return (
    <Box>
      <Box className='grid grid-cols-3 w-full gap-4 pb-4'>
        <Card className='flex flex-col gap-2 p-4'>
          <Box className='flex gap-2 items-center'>
            <Typography className='font-bold'>Expected Budget</Typography>
            <GroupOutlined sx={{ fill: '#0095DA' }} />
          </Box>
          <Box className='flex gap-2 items-baseline'>
            <Typography className='text-5xl font-bold text-[#0095DA]'>
              <AnimatedNumber number={latestPositionMatrix ? latestPositionMatrix.expectedCount : 10} />
            </Typography>
            <Typography className='font-medium'>no. of Employees</Typography>
          </Box>
        </Card>
        <Card className='flex flex-col gap-2 p-4'>
          <Box className='flex gap-2 items-center'>
            <Typography className='font-bold'>Actual Budget</Typography>
            <HowToRegOutlined sx={{ fill: '#0095DA' }} />
          </Box>
          <Box className='flex gap-2 items-baseline'>
            <Typography className='text-5xl font-bold text-[#0095DA]'>
              <AnimatedNumber number={latestPositionMatrix ? latestPositionMatrix.actualCount : 4} />
            </Typography>
            <Typography className='font-medium'>no. of Employees</Typography>
          </Box>
        </Card>
        <Card className='flex flex-col gap-2 p-4'>
          <Box className='flex gap-2 items-center'>
            <Typography className='font-bold'>Additional Budget</Typography>
            <GroupAddOutlined sx={{ fill: '#0095DA' }} />
          </Box>
          <Box className='flex gap-2 items-baseline'>
            <Typography className='text-5xl font-bold text-[#0095DA]'>
              <AnimatedNumber number={latestPositionMatrix ? latestPositionMatrix.additionalCount : 0} />
            </Typography>
            <Typography className='font-medium'>no. of Employees</Typography>
          </Box>
        </Card>
      </Box>
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
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-4 border-bs gap-4 custom-scrollbar-x-axis'>
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
        </Box>
      </Card>
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, color: 'error.main' }}>
          <Typography>Error: {error}</Typography>
        </Box>
      )}
      {tableData.data.length === 0 && status !== 'loading' && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No employee data found
          </Typography>
        </Box>
      )}
      {status === 'succeeded' && (
        <DynamicTable
          columns={columns}
          data={tableData.data}
          totalCount={tableData.totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Position Matrix Table'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      )}
    </Box>
  )
}

export default PositionMatrixTable
