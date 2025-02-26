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

  // Pagination state aligned with API (page starts at 1, not 0)
  const [pagination, setPagination] = useState({
    page: 1, // Changed from pageIndex to page, starting at 1 to match API
    limit: 5 // Changed from pageSize to limit
  })

  // Fetch vacancies when pagination changes
  useEffect(() => {
    dispatch(fetchVacancies({ page: pagination.page, limit: pagination.limit }))
  }, [dispatch, pagination.page, pagination.limit])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => {
      const updatedPagination = { ...prev, page: newPage }

      console.log('Page:', updatedPagination.page)
      console.log('Limit:', updatedPagination.limit)

      return updatedPagination
    })
  }

  const handleRowsPerPageChange = (newLimit: number) => {
    setPagination({ page: 1, limit: newLimit }) // Reset to page 1 when limit changes
    console.log('Page:', 1)
    console.log('Limit:', newLimit)
  }

  const handlePageCountChange = (newPageCount: number) => {
    console.log('Page Count:', newPageCount)
  }

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('title', {
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
      columnHelper.accessor('jobType', {
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
      columnHelper.accessor('branch', {
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
      columnHelper.accessor('grade', {
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
      columnHelper.accessor('band', {
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
      columnHelper.accessor('businessUnit', {
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
      columnHelper.accessor('city', {
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
      columnHelper.accessor('startDate', {
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
      columnHelper.accessor('endDate', {
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

  // const tableData = useMemo(
  //   () => ({
  //     data: vacancies || [],
  //     count: totalCount || 0 // Use totalCount from Redux store
  //   }),
  //   [vacancies, totalCount]
  // )

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={vacancies}
        totalCount={totalCount}
        pagination={{ pageIndex: pagination.page - 1, pageSize: pagination.limit }} // Adjust page to 0-based for table
        onPageChange={(newPage: number) => handlePageChange(newPage + 1)} // Convert back to 1-based for API
        onRowsPerPageChange={handleRowsPerPageChange}
        onPageCountChange={handlePageCountChange}
      />
    </div>
  )
}

export default VacancyListingTableView
