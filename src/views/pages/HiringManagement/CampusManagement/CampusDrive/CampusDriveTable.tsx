'use client'
import React, { useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'

interface CampusDrive {
  id: string
  job_role: string
  drive_date: string
  expected_candidates: number
  status: 'Active' | 'Inactive' | 'Completed' | 'Planned' | 'Ongoing' | 'Cancelled'
  college: string
  college_coordinator: string
  invite_status: 'Pending' | 'Sent' | 'Failed'
  response_status: 'Not Responded' | 'Interested' | 'Not Interested'
  spoc_notified_at: string
  remarks: string
}

interface CampusDriveTableViewProps {
  drives: CampusDrive[]
  totalCount: number
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

const CampusDriveTableView = ({ drives, totalCount, page, limit, setPage, setLimit }: CampusDriveTableViewProps) => {
  const columnHelper = createColumnHelper<CampusDrive>()
  const router = useRouter()

  const tableData = useMemo(() => {
    return {
      data: drives,
      totalCount
    }
  }, [drives, totalCount])

  const columns = useMemo<ColumnDef<CampusDrive, any>[]>(
    () => [
      columnHelper.accessor('job_role', {
        header: 'JOB ROLE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.job_role}</Typography>
      }),
      columnHelper.accessor('drive_date', {
        header: 'DRIVE DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>{new Date(row.original.drive_date).toLocaleDateString('en-IN')}</Typography>
        )
      }),
      columnHelper.accessor('expected_candidates', {
        header: 'EXPECTED CANDIDATES',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.expected_candidates}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <Typography
            color='text.primary'
            sx={{
              color:
                row.original.status === 'Active' || row.original.status === 'Planned'
                  ? '#90EE90'
                  : row.original.status === 'Inactive'
                    ? '#ED960B'
                    : row.original.status === 'Completed'
                      ? '#00CED1'
                      : '#FF4500' // For Ongoing, Cancelled
            }}
          >
            {row.original.status}
          </Typography>
        )
      }),
      columnHelper.accessor('college', {
        header: 'COLLEGE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.college}</Typography>
      }),
      columnHelper.accessor('college_coordinator', {
        header: 'COLLEGE COORDINATOR',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.college_coordinator}</Typography>
      }),
      columnHelper.accessor('invite_status', {
        header: 'INVITE STATUS',
        cell: ({ row }) => (
          <Typography
            color='text.primary'
            sx={{
              color:
                row.original.invite_status === 'Sent'
                  ? '#90EE90'
                  : row.original.invite_status === 'Pending'
                    ? '#ED960B'
                    : '#FF4500'
            }}
          >
            {row.original.invite_status}
          </Typography>
        )
      }),
      columnHelper.accessor('response_status', {
        header: 'RESPONSE STATUS',
        cell: ({ row }) => (
          <Typography
            color='text.primary'
            sx={{
              color:
                row.original.response_status === 'Interested'
                  ? '#90EE90'
                  : row.original.response_status === 'Not Interested'
                    ? '#FF4500'
                    : '#5E6E78'
            }}
          >
            {row.original.response_status}
          </Typography>
        )
      }),
      columnHelper.accessor('spoc_notified_at', {
        header: 'SPOC NOTIFIED AT',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.spoc_notified_at ? new Date(row.original.spoc_notified_at).toLocaleString('en-IN') : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('remarks', {
        header: 'REMARKS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.remarks || '-'}</Typography>
      }),
      columnHelper.display({
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => (
          <Box className='flex items-center gap-1'>
            <Tooltip title='View Drive'>
              <IconButton
                onClick={() => router.push(`/hiring-management/campus-management/campus-drive/view/${row.original.id}`)}
                aria-label={`View ${row.original.job_role}`}
                sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
              >
                <VisibilityIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit Drive'>
              <IconButton
                onClick={() => {
                  const queryParams = new URLSearchParams()

                  // Convert drive object to URL params
                  Object.entries(row.original).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      // Handle date fields
                      if (key === 'drive_date' || key === 'spoc_notified_at') {
                        queryParams.set(key, new Date(value).toISOString())
                      } else {
                        queryParams.set(key, String(value))
                      }
                    }
                  })
                  router.push(
                    `/hiring-management/campus-management/campus-drive/edit/${row.original.id}?${queryParams.toString()}`
                  )
                }}
                aria-label={`Edit ${row.original.job_role}`}
                sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Drive'>
              <IconButton
                onClick={() => console.log(`Delete drive ${row.original.id}`)} // Placeholder for delete logic
                aria-label={`Delete ${row.original.job_role}`}
                sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {drives.length === 0 ? (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No campus drives found
          </Typography>
        </Box>
      ) : (
        <DynamicTable
          columns={columns}
          data={tableData.data}
          totalCount={tableData.totalCount}
          pagination={{ pageIndex: page - 1, pageSize: limit }}
          onPageChange={newPage => setPage(newPage + 1)}
          onRowsPerPageChange={newPageSize => setLimit(newPageSize)}
          tableName='Campus Drive Table'
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      )}
    </Box>
  )
}

export default CampusDriveTableView
