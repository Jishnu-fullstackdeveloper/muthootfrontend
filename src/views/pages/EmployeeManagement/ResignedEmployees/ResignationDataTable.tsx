'use client'
import React, { useEffect, useState, useMemo } from 'react'

import { Box, Button, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import DynamicTable from '@/components/Table/dynamicTable'
import type { RootState, AppDispatch } from '@/redux/store'
import { fetchResignedEmployees } from '@/redux/ResignationDataListing/ResignationDataListingSlice'

interface ResignedEmployee {
  id: string
  employeeCode: string
  firstName: string
  middleName?: string
  lastName: string
  designation: { name: string }
  department: { name: string }
  resignationDetails: {
    dateOfResignation: string
    lwd: string
    noticePeriod: string
    relievingDateAsPerNotice: string
    notes?: string
  }
}

interface ResignedEmployeesTableViewProps {
  fromDate?: string
}

const ResignedEmployeesTableView = ({ fromDate }: ResignedEmployeesTableViewProps) => {
  const dispatch = useAppDispatch<AppDispatch>()

  const { employees, loading, error, totalCount } = useAppSelector(
    (state: RootState) => state.resignationDataListingReducer
  )

  const columnHelper = createColumnHelper<ResignedEmployee & { fullName: string }>()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Fetch employees from API
  useEffect(() => {
    dispatch(
      fetchResignedEmployees({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        isResigned: true,
        resignationDateFrom: fromDate
      })
    )
  }, [dispatch, pagination.pageIndex, pagination.pageSize, fromDate])

  // Map data to table format
  const tableData = useMemo(() => {
    const mappedData = employees.map(employee => ({
      ...employee,
      finalApprovalLWD: employee.resignationDetails.lwd, // Map API's lwd to finalApprovalLWD
      fullName: `${employee.firstName}${employee.middleName ? ` ${employee.middleName}` : ''} ${employee.lastName}`
    }))

    return {
      data: mappedData,
      totalCount
    }
  }, [employees, totalCount])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const columns = useMemo<ColumnDef<ResignedEmployee & { fullName: string }, any>[]>(
    () => [
      columnHelper.accessor('employeeCode', {
        header: 'EMPLOYEE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.employeeCode}</Typography>
      }),
      columnHelper.accessor('fullName', {
        header: 'FULL NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      }),
      columnHelper.accessor('designation.name', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designation.name}</Typography>
      }),
      columnHelper.accessor('department.name', {
        header: 'DEPARTMENT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.department.name}</Typography>
      }),
      columnHelper.accessor('resignationDetails.dateOfResignation', {
        header: 'DATE OF RESIGNATION',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.resignationDetails.dateOfResignation.split('T')[0]}
          </Typography>
        )
      }),
      columnHelper.accessor('resignationDetails.lwd', {
        header: 'LAST WORKING DAY',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.resignationDetails.lwd.split('T')[0]}</Typography>
        )
      }),
      columnHelper.accessor('resignationDetails.noticePeriod', {
        header: 'NOTICE PERIOD',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.resignationDetails.noticePeriod}</Typography>
      }),
      columnHelper.accessor('resignationDetails.relievingDateAsPerNotice', {
        header: 'RELIEVING DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.resignationDetails.relievingDateAsPerNotice?.split('T')[0]}
          </Typography>
        )
      }),
      columnHelper.accessor('resignationDetails.notes', {
        header: 'NOTES',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.resignationDetails.notes || '-'}</Typography>
      }),
      columnHelper.accessor('actions', {
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center gap-2'>
            <Tooltip title='Approve'>
              <Button
                variant='text'
                color='success'
                size='small'
                startIcon={<CheckCircleOutlineIcon />}
                onClick={e => {
                  e.stopPropagation()
                  console.log(`Approve resignation for ${row.original.employeeCode}`)
                }}
                sx={{ fontSize: '12px' }}
              >
                Approve
              </Button>
            </Tooltip>
            <Tooltip title='Reject'>
              <Button
                variant='text'
                color='error'
                size='small'
                startIcon={<CancelOutlinedIcon />}
                onClick={e => {
                  e.stopPropagation()
                  console.log(`Reject resignation for ${row.original.employeeCode}`)
                }}
                sx={{ fontSize: '12px' }}
              >
                Reject
              </Button>
            </Tooltip>
            <Tooltip title='Freeze'>
              <Button
                variant='text'
                color='info'
                size='small'
                startIcon={<PauseCircleOutlineIcon />}
                onClick={e => {
                  e.stopPropagation()
                  console.log(`Freeze resignation for ${row.original.employeeCode}`)
                }}
                sx={{ fontSize: '12px' }}
              >
                Freeze
              </Button>
            </Tooltip>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {/* {loading && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            Loading...
          </Typography>
        </Box>
      )} */}
      {error && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            Error: {error}
          </Typography>
        </Box>
      )}
      {!loading && !error && tableData.data.length === 0 && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No resigned employees found
          </Typography>
        </Box>
      )}
      <DynamicTable
        columns={columns}
        data={tableData.data}
        totalCount={tableData.totalCount}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName='Resigned Employee Table'
      />
    </Box>
  )
}

export default ResignedEmployeesTableView
