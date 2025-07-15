import React, { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { IconButton, Typography } from '@mui/material'

import DynamicTable from '@/components/Table/dynamicTable'

interface JobPosting {
  id: string
  band: string
  jobRole: string
  employeeCategory: string
  platformName: string
  priority: number
  platformAge: number
  Action?: any
}

const JobPostingCustomTable = ({ data, onEdit }: { data: JobPosting[]; onEdit: (id: string) => void }) => {
  const columnHelper = createColumnHelper<JobPosting>()

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
      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton title='Edit' sx={{ fontSize: '30px' }} onClick={() => onEdit(row.original.id)}>
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
        data={data}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
        totalCount={data.length}
        pagination={{
          pageIndex: 0,
          pageSize: 10
        }}
      />
    </div>
  )
}

export default JobPostingCustomTable
