'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography, Chip, Box } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'

const VacancyListingTableView = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { vacancies, totalCount } = useAppSelector(state => state.vacancyManagementReducer)

  const columnHelper = createColumnHelper<any>()

  // Pagination state (0-based for table, 1-based for API)
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Changed to 0-based index for table compatibility
    pageSize: 5
  })

  // Fetch vacancies when pagination changes
  useEffect(() => {
    dispatch(fetchVacancies({ page: pagination.pageIndex + 1, limit: pagination.pageSize }))
  }, [dispatch, pagination.pageIndex, pagination.pageSize])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: newPage
    }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({
      pageIndex: 0, // Reset to first page when rows per page changes
      pageSize: newPageSize
    })
  }

  const handlePageCountChange = (newPageCount: number) => {
    console.log('Page Count:', newPageCount)
  }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('designationName', {
        // Match the actual data key
        header: 'DESIGNATION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.designationName}
          </Typography>
        )
      }),
      columnHelper.accessor('employeeCategoryType', {
        // Match the actual data key
        header: 'EMPLOYEE CATEGORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeCategoryType}
          </Typography>
        )
      }),
      columnHelper.accessor('branchesName', {
        // Match the actual data key
        header: 'BRANCH',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.branchesName}
          </Typography>
        )
      }),
      columnHelper.accessor('gradeName', {
        // Match the actual data key
        header: 'GRADE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.gradeName}
          </Typography>
        )
      }),
      columnHelper.accessor('bandName', {
        // Match the actual data key
        header: 'BAND',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.bandName}
          </Typography>
        )
      }),
      columnHelper.accessor('businessUnitName', {
        // Match the actual data key
        header: 'BUSINESS UNIT',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.businessUnitName}
          </Typography>
        )
      }),
      columnHelper.accessor('districtName', {
        // Match the actual data key
        header: 'CITY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.districtName}
          </Typography>
        )
      }),
      columnHelper.accessor('createdAt', {
        // Match the actual data key
        header: 'START DATE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.createdAt}`}
            color='success'
            size='medium'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 103 }}
          />
        )
      }),
      columnHelper.accessor('updatedAt', {
        // Match the actual data key
        header: 'END DATE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.updatedAt}`}
            color='error'
            size='medium'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 105 }}
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/vacancy-management/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/vacancy-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  return (
    <Box>
      <DynamicTable
        columns={columns}
        data={vacancies || []}
        totalCount={totalCount}
        pagination={pagination} // Pass 0-based pagination directly
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onPageCountChange={handlePageCountChange}
      />
    </Box>
  )
}

export default VacancyListingTableView
