'use client'
import React, {  useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { IconButton, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'


import DynamicTable from '@/components/Table/dynamicTable'


interface JobRole {
  id: string
  jobRoleId: string
  approvalStatus: string
  details: {
    roleSpecification: Array<{
      roleTitle: string
      companyName: string
      functionOrDepartment: string
      reportsTo: string
      dateWritten: string
    }>
  }
  createdAt: string
}

interface JobListingTableViewProps {
  jobs: JobRole[]
  totalCount: number
  pagination: {
    pageIndex: number
    pageSize: number
  }
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
}

const JobListingTableView = ({
  jobs,
  totalCount,
  pagination,
  onPageChange,
  onRowsPerPageChange
}: JobListingTableViewProps) => {
  const router = useRouter()
  const columnHelper = createColumnHelper<JobRole>()
 
  const columns = useMemo<ColumnDef<JobRole, any>[]>(
    () => [
      columnHelper.accessor(row => row.details.roleSpecification[0]?.roleTitle, {
        header: 'JOB TITLE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.details.roleSpecification[0]?.roleTitle?.toUpperCase() || 'N/A'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor(row => row.details.roleSpecification[0]?.companyName, {
        header: 'COMPANY',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.details.roleSpecification[0]?.companyName || 'N/A'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor(row => row.details.roleSpecification[0]?.functionOrDepartment, {
        header: 'DEPARTMENT',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.details.roleSpecification[0]?.functionOrDepartment || 'N/A'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor(row => row.details.roleSpecification[0]?.reportsTo, {
        header: 'REPORTS TO',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.details.roleSpecification[0]?.reportsTo || 'N/A'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor(row => row.details.roleSpecification[0]?.dateWritten, {
        header: 'DATE WRITTEN',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.details.roleSpecification[0]?.dateWritten
                  ? new Date(row.original.details.roleSpecification[0].dateWritten).toLocaleDateString()
                  : 'N/A'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('approvalStatus', {
        header: 'STATUS',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.approvalStatus || 'N/A'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: {
          className: 'sticky right-0'
        },
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(`/jd-management/view/${row.original.id}`)}>
                <i className='tabler-eye text-textSecondary'></i>
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit' placement='top'>
              <IconButton onClick={() => router.push(`/jd-management/edit/${row.original.id}`)}>
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
        data={jobs}
        pagination={pagination}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        totalCount={totalCount}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
     
    </div>
  )
}

export default JobListingTableView
