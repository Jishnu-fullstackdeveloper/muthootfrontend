'use client'

import React, { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { Card, IconButton, Typography } from '@mui/material'
import { Visibility as VisibilityIcon } from '@mui/icons-material'

import DynamicTable from '@/components/Table/dynamicTable'

interface JobPosting {
  id: string
  designation: string
  jobRole: string
  location: string
  status: 'Pending' | 'Posted' | 'Closed'
  openings: number
  jobGrade: string
  postedDate: string
  department?: string
  manager?: string
  employeeCategory?: string
  branch?: string
  attachments?: string[]
  businessUnit?: string
  branchBusiness?: string
  zone?: string
  area?: string
  state?: string
}

interface JobTableProps {
  data: JobPosting[]
  page: number
  limit: number
  totalCount: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newPageSize: number) => void
  handleView: (jobId: string) => void
}

const JobTable = ({ data, page, limit, totalCount, onPageChange, onRowsPerPageChange, handleView }: JobTableProps) => {
  const columnHelper = createColumnHelper<JobPosting>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <Typography>{row.original.id}</Typography>
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: ({ row }) => <Typography>{row.original.designation}</Typography>
      }),
      columnHelper.accessor('jobRole', {
        header: 'Job Role',
        cell: ({ row }) => <Typography>{row.original.jobRole}</Typography>
      }),
      columnHelper.accessor('location', {
        header: 'Location',
        cell: ({ row }) => <Typography>{row.original.location}</Typography>
      }),
      columnHelper.accessor('openings', {
        header: 'No. of Openings',
        cell: ({ row }) => <Typography>{row.original.openings}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography
            color={
              row.original.status === 'Pending'
                ? 'success.main'
                : row.original.status === 'Posted'
                  ? 'warning.main'
                  : row.original.status === 'Closed'
                    ? 'info.main'
                    : 'error.main'
            }
          >
            {row.original.status}
          </Typography>
        )
      }),

      // columnHelper.accessor('candidatesApplied', {
      //   header: 'No. of Candidates Applied',
      //   cell: ({ row }) => <Typography>{row.original.candidatesApplied}</Typography>
      // }),
      // columnHelper.accessor('shortlisted', {
      //   header: 'No. of Shortlisted Candidates',
      //   cell: ({ row }) => <Typography>{row.original.shortlisted}</Typography>
      // }),
      // columnHelper.accessor('hired', {
      //   header: 'No. of Hired Candidates',
      //   cell: ({ row }) => <Typography>{row.original.hired}</Typography>
      // }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <IconButton
            onClick={() => handleView(row.original.id)}
            aria-label={`View candidates for job ${row.original.id}`}
          >
            <VisibilityIcon />
          </IconButton>
        )
      })
    ],
    [columnHelper, handleView]
  )

  return (
    <Card>
      <DynamicTable
        tableName='Job Postings List'
        columns={columns}
        data={data}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        totalCount={totalCount}
        onPageChange={newPage => onPageChange(newPage + 1)}
        onRowsPerPageChange={onRowsPerPageChange}
        sorting={undefined}
        onSortingChange={undefined}
        initialState={undefined}
      />
    </Card>
  )
}

export default JobTable
