'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography, Chip, Box } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import VisibilityIcon from '@mui/icons-material/Visibility'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import type { VacancyManagementState } from '@/types/vacancyManagement'
import { ROUTES } from '@/utils/routes'

const VacancyListingTableView = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { vacancyListData, vacancyListLoading, vacancyListFailureMessage } = useAppSelector(
    state => state.vacancyManagementReducer
  ) as VacancyManagementState

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
      columnHelper.accessor('jobTitle', {
        // Match the actual data key
        header: 'JOB TITLE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobTitle}
          </Typography>
        )
      }),
      columnHelper.accessor('designation', {
        // Match the actual data key
        header: 'DESIGNATION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.designation}
          </Typography>
        )
      }),
      columnHelper.accessor('jobRole', {
        // Match the actual data key
        header: 'JOB ROLE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobRole}
          </Typography>
        )
      }),
      columnHelper.accessor('openings', {
        // Match the actual data key
        header: 'OPENINGS',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.openings}
          </Typography>
        )
      }),

      columnHelper.accessor('status', {
        // Match the actual data key
        header: 'STATUS',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            size='small'
            variant='tonal'
            color={
              row.original.status === 'Open'
                ? 'success'
                : row.original.status === 'Closed'
                  ? 'error'
                  : row.original.status === 'Freeze'
                    ? 'info'
                    : 'default'
            }
            sx={{ ml: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
          />
        )
      }),

      // columnHelper.accessor('businessRole', {
      //   // Match the actual data key
      //   header: 'BUSINESS ROLE',
      //   cell: ({ row }) => (
      //     <Typography color='text.primary' className='font-medium'>
      //       {row.original.businessRole}
      //     </Typography>
      //   )
      // }),
      columnHelper.accessor('campusOrLateral', {
        // Match the actual data key
        header: 'CAMPUS/LATERAL',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.campusOrLateral}
          </Typography>
        )
      }),
      columnHelper.accessor('employeeCategory', {
        // Match the actual data key
        header: 'EMPLOYEE CATEGORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeCategory}
          </Typography>
        )
      }),

      // columnHelper.accessor(row => `${row.experienceMin} - ${row.experienceMax}`, {
      //   // Custom accessor combining experienceMin and experienceMax
      //   header: 'EXPERIENCE',
      //   cell: ({ row }) => (
      //     <Typography color='text.primary' className='font-medium'>
      //       {row.original.experienceMin} - {row.original.experienceMax} years
      //     </Typography>
      //   )
      // }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton
                onClick={() =>
                  router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST_VIEW(row.original.id))
                }
              >
                <VisibilityIcon sx={{ fontSize: 10 }} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/vacancy-management/edit/${row.original.id}`)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip> */}
          </Box>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('employeeType', {
        // Match the actual data key
        header: 'EMPLOYEE TYPE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeType}
          </Typography>
        )
      }),
      columnHelper.accessor('hiringManager', {
        // Match the actual data key
        header: 'HIRING MANAGER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.hiringManager}
          </Typography>
        )
      }),
      columnHelper.accessor('startingDate', {
        // Match the actual data key
        header: 'START DATE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.startingDate.split('T')[0]}`}
            color='success'
            size='medium'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 103 }}
          />
        )
      }),
      columnHelper.accessor('closingDate', {
        // Match the actual data key
        header: 'CLOSE DATE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.closingDate.split('T')[0]}`}
            color='error'
            size='medium'
            sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', width: 105 }}
          />
        )
      }),
      columnHelper.accessor('company', {
        // Match the actual data key
        header: 'COMPANY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.company}
          </Typography>
        )
      }),
      columnHelper.accessor('businessUnit', {
        // Match the actual data key
        header: 'BUSINESS UNIT',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.businessUnit}
          </Typography>
        )
      }),
      columnHelper.accessor('department', {
        // Match the actual data key
        header: 'DEPARTMENT',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.department}
          </Typography>
        )
      }),
      columnHelper.accessor('territory', {
        // Match the actual data key
        header: 'TERRITORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.territory}
          </Typography>
        )
      }),
      columnHelper.accessor('zone', {
        // Match the actual data key
        header: 'ZONE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.zone}
          </Typography>
        )
      }),
      columnHelper.accessor('region', {
        // Match the actual data key
        header: 'REGION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.region}
          </Typography>
        )
      }),
      columnHelper.accessor('area', {
        // Match the actual data key
        header: 'AREA',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.area}
          </Typography>
        )
      }),
      columnHelper.accessor('cluster', {
        // Match the actual data key
        header: 'CLUSTER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.cluster}
          </Typography>
        )
      }),
      columnHelper.accessor('branch', {
        // Match the actual data key
        header: 'BRANCH',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.branch}
          </Typography>
        )
      }),
      columnHelper.accessor('branchCode', {
        // Match the actual data key
        header: 'BRANCH CODE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.branchCode}
          </Typography>
        )
      }),
      columnHelper.accessor('city', {
        // Match the actual data key
        header: 'CITY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.city}
          </Typography>
        )
      }),
      columnHelper.accessor('state', {
        // Match the actual data key
        header: 'STATE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.state}
          </Typography>
        )
      }),
      columnHelper.accessor('origin', {
        // Match the actual data key
        header: 'ORIGIN',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.origin}
          </Typography>
        )
      })
    ],
    [columnHelper, router]
  )

  // return (
  //   <Box>
  //     {vacancyListLoading && <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading...</Typography>}
  //     {vacancyListFailureMessage && (
  //       <Typography sx={{ mt: 2, textAlign: 'center', color: 'error.main' }}>
  //         {/* Error: {vacancyListFailureMessage} */} No vacancy found
  //       </Typography>
  //     )}
  //     {!vacancyListLoading && !vacancyListFailureMessage && vacancyListData?.length === 0 ? (
  //       <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>No vacancy found</Typography>
  //     ) : (
  //       !vacancyListLoading &&
  //       !vacancyListFailureMessage && (
  //         <DynamicTable
  //           columns={columns}
  //           data={vacancyListData?.data || []}
  //           totalCount={vacancyListData?.totalCount}
  //           pagination={pagination}
  //           onPageChange={handlePageChange}
  //           onRowsPerPageChange={handleRowsPerPageChange}
  //           onPageCountChange={handlePageCountChange}
  //           tableName='Vacancy Listing Table'
  //           sorting={undefined}
  //           onSortingChange={undefined}
  //           initialState={undefined}
  //         />
  //       )
  //     )}
  //   </Box>
  // )
  return (
    <Box>
      {vacancyListLoading && <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading...</Typography>}
      {vacancyListFailureMessage && (
        <Typography sx={{ mt: 2, textAlign: 'center', color: 'error.main' }}>No record is found</Typography>
      )}
      {!vacancyListLoading &&
      !vacancyListFailureMessage &&
      (!vacancyListData?.data || vacancyListData?.data?.length === 0) ? (
        <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>No record is found</Typography>
      ) : (
        !vacancyListLoading &&
        !vacancyListFailureMessage && (
          <DynamicTable
            columns={columns}
            data={vacancyListData?.data || []}
            totalCount={vacancyListData?.totalCount}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageCountChange={handlePageCountChange}
            tableName='Vacancy Listing Table'
            sorting={undefined}
            onSortingChange={undefined}
            initialState={undefined}
          />
        )
      )}
    </Box>
  )
}

export default VacancyListingTableView
