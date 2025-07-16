'use client'

import React, { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { IconButton, Typography } from '@mui/material'

import DynamicTable from '@/components/Table/dynamicTable'

interface PlatformDetail {
  platformName: string
  priority: number
  platformAge: number
}

interface JobPosting {
  id: string
  band: string
  jobRole: string
  employeeCategory: string
  platformDetails: PlatformDetail[]
}

interface FlattenedJobPosting {
  id: string
  band: string
  jobRole: string
  employeeCategory: string
  platformName: string
  priority: number
  platformAge: number
}

const JobPostingCustomTable = ({
  data,
  onEdit
}: {
  data: JobPosting[]
  onEdit: (row: FlattenedJobPosting) => void
}) => {
  const columnHelper = createColumnHelper<FlattenedJobPosting>()

  // Flatten the data to create a row for each platformDetails entry
  const flattenedData = useMemo(() => {
    return data.flatMap(item =>
      item.platformDetails.map(detail => ({
        id: item.id,
        band: item.band,
        jobRole: item.jobRole,
        employeeCategory: item.employeeCategory,
        platformName: detail.platformName,
        priority: detail.priority,
        platformAge: detail.platformAge
      }))
    )
  }, [data])

  const columns = useMemo(
    () => [
      columnHelper.accessor('band', {
        header: 'Band',
        cell: ({ row }) => <Typography>{row.original.band || '-'}</Typography>
      }),
      columnHelper.accessor('jobRole', {
        header: 'Job Role',
        cell: ({ row }) => <Typography>{row.original.jobRole || '-'}</Typography>
      }),
      columnHelper.accessor('employeeCategory', {
        header: 'Employee Category',
        cell: ({ row }) => <Typography>{row.original.employeeCategory || '-'}</Typography>
      }),
      columnHelper.accessor('platformName', {
        header: 'Platform Name',
        cell: ({ row }) => <Typography>{row.original.platformName || '-'}</Typography>
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: ({ row }) => <Typography>{row.original.priority || '-'}</Typography>
      }),
      columnHelper.accessor('platformAge', {
        header: 'Platform Age',
        cell: ({ row }) => <Typography>{row.original.platformAge || '-'}</Typography>
      }),
      columnHelper.accessor('id', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton title='Edit' sx={{ fontSize: '30px' }} onClick={() => onEdit(row.original)}>
            <i className='tabler-edit w-5 h-5' />
          </IconButton>
        )
      })
    ],
    [onEdit]
  )

  return (
    <div>
      <DynamicTable
        tableName='Job Posting Customization List'
        columns={columns}
        data={flattenedData}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
        totalCount={flattenedData.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10
        }}
      />
    </div>
  )
}

export default JobPostingCustomTable
