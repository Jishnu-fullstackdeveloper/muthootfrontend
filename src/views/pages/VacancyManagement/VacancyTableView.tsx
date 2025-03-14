'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography, Chip } from '@mui/material'
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
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.designationName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('employeeCategoryType', {
        // Match the actual data key
        header: 'EMPLOYEE CATEGORY',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.employeeCategoryType}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('branchesName', {
        // Match the actual data key
        header: 'BRANCH',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.branchesName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('gradeName', {
        // Match the actual data key
        header: 'GRADE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.gradeName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('bandName', {
        // Match the actual data key
        header: 'BAND',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.bandName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('businessUnitName', {
        // Match the actual data key
        header: 'BUSINESS UNIT',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.businessUnitName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('districtName', {
        // Match the actual data key
        header: 'CITY',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.districtName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('createdAt', {
        // Match the actual data key
        header: 'START DATE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Chip
                variant='tonal'
                label={`${row.original.createdAt}`}
                color='success'
                size='medium'
                sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 103 }}
              />
            </div>
          </div>
        )
      }),
      columnHelper.accessor('updatedAt', {
        // Match the actual data key
        header: 'END DATE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Chip
                variant='tonal'
                label={`${row.original.updatedAt}`}
                color='error'
                size='medium'
                sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 105 }}
              />
            </div>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <div className='flex items-center'>
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
          </div>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, router]
  )

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={vacancies || []}
        totalCount={totalCount}
        pagination={pagination} // Pass 0-based pagination directly
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onPageCountChange={handlePageCountChange}
      />
    </div>
  )
}

export default VacancyListingTableView
