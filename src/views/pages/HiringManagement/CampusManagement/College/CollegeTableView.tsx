'use client'
import React, { useMemo } from 'react'

import { Box, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

interface College {
  id: string
  name: string
  college_code: string
  university_affiliation: string
  college_type: string
  location: string
  district: string
  pin_code: string
  full_address: string
  website_url: string
  spoc_name: string
  spoc_designation: string
  spoc_email: string
  spoc_alt_email: string
  spoc_mobile: string
  spoc_alt_phone: string
  spoc_linkedin: string
  spoc_whatsapp: string
  last_visited_date: string
  last_engagement_type: string
  last_feedback: string
  preferred_drive_months: string[]
  remarks: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
  status: 'Active' | 'Inactive' | 'Blocked'
}

interface CollegeTableViewProps {
  colleges: College[]
}

const CollegeTableView = ({ colleges }: CollegeTableViewProps) => {
  const columnHelper = createColumnHelper<College>()

  const tableData = useMemo(() => {
    return {
      data: colleges,
      totalCount: colleges.length
    }
  }, [colleges])

  const columns = useMemo<ColumnDef<College, any>[]>(
    () => [
      columnHelper.accessor('college_code', {
        header: 'COLLEGE CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.college_code}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.name}</Typography>
      }),
      columnHelper.accessor('university_affiliation', {
        header: 'UNIVERSITY AFFILIATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.university_affiliation}</Typography>
      }),
      columnHelper.accessor('college_type', {
        header: 'COLLEGE TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.college_type}</Typography>
      }),
      columnHelper.accessor('location', {
        header: 'LOCATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.location}</Typography>
      }),
      columnHelper.accessor('district', {
        header: 'DISTRICT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.district}</Typography>
      }),
      columnHelper.accessor('pin_code', {
        header: 'PIN CODE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.pin_code}</Typography>
      }),
      columnHelper.accessor('full_address', {
        header: 'FULL ADDRESS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.full_address}</Typography>
      }),
      columnHelper.accessor('website_url', {
        header: 'WEBSITE URL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.website_url}</Typography>
      }),
      columnHelper.accessor('spoc_name', {
        header: 'SPOC NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_name}</Typography>
      }),
      columnHelper.accessor('spoc_designation', {
        header: 'SPOC DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_designation}</Typography>
      }),
      columnHelper.accessor('spoc_email', {
        header: 'SPOC EMAIL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_email}</Typography>
      }),
      columnHelper.accessor('spoc_alt_email', {
        header: 'SPOC ALT EMAIL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_alt_email}</Typography>
      }),
      columnHelper.accessor('spoc_mobile', {
        header: 'SPOC MOBILE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_mobile}</Typography>
      }),
      columnHelper.accessor('spoc_alt_phone', {
        header: 'SPOC ALT PHONE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_alt_phone}</Typography>
      }),
      columnHelper.accessor('spoc_linkedin', {
        header: 'SPOC LINKEDIN',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_linkedin}</Typography>
      }),
      columnHelper.accessor('spoc_whatsapp', {
        header: 'SPOC WHATSAPP',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.spoc_whatsapp}</Typography>
      }),
      columnHelper.accessor('last_visited_date', {
        header: 'LAST VISITED DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {new Date(row.original.last_visited_date).toLocaleDateString('en-IN')}
          </Typography>
        )
      }),
      columnHelper.accessor('last_engagement_type', {
        header: 'LAST ENGAGEMENT TYPE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.last_engagement_type}</Typography>
      }),
      columnHelper.accessor('last_feedback', {
        header: 'LAST FEEDBACK',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.last_feedback}</Typography>
      }),
      columnHelper.accessor('preferred_drive_months', {
        header: 'PREFERRED DRIVE MONTHS',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.preferred_drive_months.join(', ')}</Typography>
        )
      }),
      columnHelper.accessor('remarks', {
        header: 'REMARKS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.remarks}</Typography>
      }),
      columnHelper.accessor('created_by', {
        header: 'CREATED BY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.created_by}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'CREATED AT',
        cell: ({ row }) => (
          <Typography color='text.primary'>{new Date(row.original.created_at).toLocaleString('en-IN')}</Typography>
        )
      }),
      columnHelper.accessor('updated_by', {
        header: 'UPDATED BY',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.updated_by}</Typography>
      }),
      columnHelper.accessor('updated_at', {
        header: 'UPDATED AT',
        cell: ({ row }) => (
          <Typography color='text.primary'>{new Date(row.original.updated_at).toLocaleString('en-IN')}</Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <Typography
            color='text.primary'
            sx={{
              color:
                row.original.status === 'Active'
                  ? '#90EE90'
                  : row.original.status === 'Inactive'
                    ? '#ED960B'
                    : '#FF4500'
            }}
          >
            {row.original.status}
          </Typography>
        )
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {colleges.length === 0 ? (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No colleges found
          </Typography>
        </Box>
      ) : (
        <DynamicTable
          columns={columns}
          data={tableData.data}
          totalCount={tableData.totalCount}
          pagination={{ pageIndex: 0, pageSize: 5 }}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          tableName='College Table'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      )}
    </Box>
  )
}

export default CollegeTableView
