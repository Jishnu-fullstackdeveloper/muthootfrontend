'use client'
import React, { useState, useMemo } from 'react'

import { Box, Button, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

import { interviewCandidates } from '@/utils/sampleData/InterviewManagement/InterviewDetailData'
import type { InterviewCandidate } from './InterviewDetailedView'
import DynamicTable from '@/components/Table/dynamicTable'

interface InterviewListTableProps {
  candidates: InterviewCandidate[]
}

const InterviewTableView = ({ candidates }: InterviewListTableProps) => {
  const columnHelper = createColumnHelper<InterviewCandidate>()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Prepare table data
  const tableData = useMemo(() => {
    return {
      data: candidates,
      totalCount: candidates.length
    }
  }, [candidates])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const columns = useMemo<ColumnDef<InterviewCandidate, any>[]>(
    () => [
      columnHelper.accessor('candidateName', {
        header: 'CANDIDATE NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.candidateName}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'EMAIL',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.email}</Typography>
      }),
      columnHelper.accessor('mobileNumber', {
        header: 'MOBILE NUMBER',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.mobileNumber}</Typography>
      }),
      columnHelper.accessor('designationApplied', {
        header: 'DESIGNATION APPLIED',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designationApplied}</Typography>
      }),
      columnHelper.accessor('screeningStatus', {
        header: 'SCREENING STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.screeningStatus}</Typography>
      }),
      columnHelper.accessor('interviewDate', {
        header: 'INTERVIEW DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.interviewDate ? row.original.interviewDate.split('T')[0] : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('round1Status', {
        header: 'ROUND 1 STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.round1Status || 'Pending'}</Typography>
      }),
      columnHelper.accessor('round2Status', {
        header: 'ROUND 2 STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.round2Status || 'Pending'}</Typography>
      }),
      columnHelper.accessor('aptitudeTestStatus', {
        header: 'APTITUDE TEST STATUS',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.aptitudeTestStatus || 'NA'}</Typography>
      }),
      columnHelper.accessor('profileMatchPercent', {
        header: 'PROFILE MATCH (%)',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.profileMatchPercent}%</Typography>
      }),
      columnHelper.accessor('source', {
        header: 'SOURCE',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.source}</Typography>
      }),
      columnHelper.accessor('actions', {
        header: 'ACTIONS',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center gap-2'>
            <Tooltip title='Shortlist'>
              <Button
                variant='text'
                color='success'
                size='small'
                startIcon={<CheckCircleOutlineIcon />}
                onClick={e => {
                  e.stopPropagation()
                  console.log(`Shortlist candidate ${row.original.candidateName}`)
                }}
                sx={{ fontSize: '12px' }}
              >
                Shortlist
              </Button>
            </Tooltip>
            <Tooltip title='Reject'>
              <Button
                variant='text'
                color='error'
                size='small'
                startIcon={<CancelOutlinedIcon />}
                onClick={e => {
                  e.stopPropagation()
                  console.log(`Reject candidate ${row.original.candidateName}`)
                }}
                sx={{ fontSize: '12px' }}
              >
                Reject
              </Button>
            </Tooltip>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {tableData.data.length === 0 && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            No interview candidates found
          </Typography>
        </Box>
      )}
      <DynamicTable
        columns={columns}
        data={tableData.data}
        totalCount={tableData.totalCount}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName='Interview List Table'
      />
    </Box>
  )
}

export default InterviewTableView
