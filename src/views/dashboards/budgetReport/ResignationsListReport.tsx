'use client'

// MUI Imports
import { useState, useEffect, useMemo } from 'react'

// import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Box, Grid, IconButton } from '@mui/material'

// Style Imports
import { Clear } from '@mui/icons-material'
import CalendarToday from '@mui/icons-material/CalendarToday'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchResignedEmployees } from '@/redux/BranchManagement/BranchManagementSlice'

// Data Type for the Resignation List Report
type ResignationDataType = {
  id: string
  employeeName: string
  department: string
  resignationDate: string
  reason: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  employeeCode: string
  noticePeriod: string
  relievingDateAsPerNotice: string
  notes: string
  dateOfResignation: string
  firstName: string
  departmentName: string
}

const ResignationsListReport = ({ id }: { id: string }) => {
  // const router = useRouter()
  const dispatch = useAppDispatch()
  const { resignedEmployeesData } = useAppSelector(state => state.branchManagementReducer) //resignedEmployeesTotal

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  })

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default: one month ago
    new Date() // Default: today
  ])

  const [errorMessage, setErrorMessage] = useState<string>('')

  const columnHelper = createColumnHelper<ResignationDataType>()

  // Define columns for DynamicTable
  const columns = useMemo<ColumnDef<ResignationDataType, any>[]>(
    () => [
      columnHelper.accessor('employeeName', {
        header: 'Employee Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.firstName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('departmentName', {
        header: 'Department',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.departmentName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('dateOfResignation', {
        header: 'Resignation Date',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.dateOfResignation}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('notes', {
        header: 'Reason',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.notes}
              </Typography>
            </div>
          </div>
        )
      })

      // columnHelper.accessor('id', {
      //   header: 'Action',
      //   cell: ({ row }) => (
      //     <div className='flex items-center'>
      //       <Tooltip title='Click here to view the details of this resignation.' placement='top'>
      //         <IconButton onClick={() => onViewDetails(row.original.employeeName)}>
      //           <i className='tabler-eye text-textSecondary'></i>
      //         </IconButton>
      //       </Tooltip>
      //     </div>
      //   ),
      //   enableSorting: false
      // })
    ],
    []
  )

  // Fetch resigned employees when pagination, date range, or id changes
  useEffect(() => {
    const [startDate, endDate] = dateRange
    const start = startDate ? startDate.toISOString().split('T')[0] : ''
    const end = endDate ? endDate.toISOString().split('T')[0] : ''

    if (id && (start || end)) {
      dispatch(fetchResignedEmployees({ id, date: `${start},${end}`, page: pagination.page, limit: pagination.limit }))
    }
  }, [dispatch, id, dateRange, pagination.page, pagination.limit])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    console.log('Page:', newPage)
    console.log('Limit:', pagination.limit)
  }

  const handleRowsPerPageChange = (newLimit: number) => {
    setPagination({ page: 1, limit: newLimit })
    console.log('Page:', 1)
    console.log('Limit:', newLimit)
  }

  const handlePageCountChange = (newPageCount: number) => {
    console.log('Page Count:', newPageCount)
  }

  // const onViewDetails = (employeeName: string) => {
  //   router.push(`/resignation-management/view/${employeeName}`)
  // }

  // Handle date range change with future date validation
  const handleDateChange = (date: [Date | null, Date | null] | null) => {
    if (!date) return

    const [start, end] = date

    console.log(start)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (end && end > today) {
      setErrorMessage('Future dates are not allowed.')

      return
    }

    setDateRange(date)
    setErrorMessage('') // Clear error message if valid
    console.log('Selected date range:', date)
  }

  return (
    <Card>
      <CardHeader
        title='Resignations List Report'
        subheader='A detailed report of employee resignations'
        action={
          <Grid container alignItems='center'>
            {/* Date Range Picker */}
            <Grid item xs={12} sm={4} md={5}>
              <AppReactDatepicker
                selectsRange={true}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateChange}
                dateFormat='dd-MMMM-yyyy'
                placeholderText='Filter by date range'
                customInput={
                  <CustomTextField
                    name='date_range'
                    id='date_range'
                    sx={{
                      '& .MuiInputBase-input': {
                        height: '30px',
                        width: '50px',
                        padding: '12px'
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <>
                          <IconButton size='small' onClick={() => setDateRange([null, null])}>
                            <Clear />
                          </IconButton>
                          <IconButton size='small'>
                            <CalendarToday />
                          </IconButton>
                        </>
                      )
                    }}
                  />
                }
              />
            </Grid>

            {/* Apply Filters Button */}
            {/* <Grid item xs={12} sm={4} md={2}>
              <Button variant='contained' style={{ height: 45 }}>
                Apply Filters
              </Button>
            </Grid> */}
          </Grid>
        }
      />

      {/* Display error message if future date is selected */}
      {errorMessage && (
        <Typography color='error' sx={{ mx: 6, mt: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {resignedEmployeesData?.data && resignedEmployeesData.data.length > 0 ? (
        <DynamicTable
          columns={columns}
          data={resignedEmployeesData.data || []}
          totalCount={resignedEmployeesData.totalCount || 0}
          pagination={{ pageIndex: pagination.page - 1, pageSize: pagination.limit }}
          onPageChange={(newPage: number) => handlePageChange(newPage + 1)}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageCountChange={handlePageCountChange}
          tableName='Resignations List Report'
          isRowCheckbox={false} // Disable row selection checkboxes
          onRowSelectionChange={() => {
            console.log('handleRowSelectionChange')
          }} // Optional: Handle row selection changes
          sorting={[]}
          initialState={{ sorting: [] }} // Ensure no default sorting
          onSortingChange={() => {
            console.log('handleRowSelectionChange')
          }} // Optional: Handle sorting changes
          // eslint-disable-next-line react/jsx-no-duplicate-props
        />
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            There is no resigned Employees
          </Typography>
        </Box>
      )}

      {/* <div className='flex items-center justify-end mt-6 pt-5 pb-5 border'>
        <FormControl size='small' sx={{ minWidth: 70 }}>
          <InputLabel>Count</InputLabel>
          <Select
            value={pagination.limit}
            onChange={e => handleRowsPerPageChange(Number(e.target.value))}
            label='Limit per page'
          >
            {[10, 25, 50, 100].map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Pagination
            color='primary'
            shape='rounded'
            showFirstButton
            showLastButton
            count={Math.ceil((resignedEmployeesTotal || 0) / pagination.limit) || 1}
            page={pagination.page}
            onChange={(event, value) => handlePageChange(value)}
          />
        </div>
      </div> */}
    </Card>
  )
}

export default ResignationsListReport
