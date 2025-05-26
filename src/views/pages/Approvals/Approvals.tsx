'use client'
import React, { useMemo, useState, useEffect } from 'react'

import { Box, Card, Typography, Grid, InputAdornment } from '@mui/material'
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { createColumnHelper } from '@tanstack/react-table'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import DynamicTable from '@/components/Table/dynamicTable'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUser, fetchApprovals, clearUser, clearApprovals } from '@/redux/Approvals/approvalsSlice'
import { getUserId } from '@/utils/functions'

const ApprovalManagement = () => {
  const dispatch = useAppDispatch()

  interface ApprovalsState {
    fetchUserLoading?: boolean
    fetchUserSuccess?: boolean
    fetchUserData?: { designation?: string | string[] } | null
    fetchUserFailure?: boolean
    fetchUserFailureMessage?: string
    fetchApprovalsLoading?: boolean
    fetchApprovalsSuccess?: boolean
    fetchApprovalsData?: {
      data?: any[]
      approvalCount?: { approvedCount: number; rejectedCount: number; pendingCount: number }
      totalCount?: number
    }
    fetchApprovalsTotalCount?: number
    fetchApprovalsFailure?: boolean
    fetchApprovalsFailureMessage?: string
  }

  const approvalsState: ApprovalsState = useAppSelector(state => state.approvalsReducer) || {}

  const {
    fetchUserSuccess = false,
    fetchUserData = null,
    fetchUserFailure = false,
    fetchUserFailureMessage = '',
    fetchApprovalsLoading = false,
    fetchApprovalsData = {
      data: [],
      approvalCount: { approvedCount: 0, rejectedCount: 0, pendingCount: 0 },
      totalCount: 0
    },
    fetchApprovalsFailure = false,
    fetchApprovalsFailureMessage = ''
  } = approvalsState

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const columnHelper = createColumnHelper()

  const statusColors = {
    Completed: '#059669',
    Pending: '#D97706',
    Overdue: '#F00',
    Rejected: '#F00'
  }

  // Dynamic approval cards based on API approvalCount
  const approvals = useMemo(
    () => [
      {
        id: 1,
        title: 'Completed Approvals',
        icon: <LibraryAddCheckIcon color='success' />,
        status: 'completed',
        note: `  ${fetchApprovalsData.approvalCount?.approvedCount || 0} Request Completed`
      },
      {
        id: 2,
        title: 'Pending Approvals',
        icon: <PendingActionsIcon color='warning' />,
        status: 'pending',
        note: `  ${fetchApprovalsData.approvalCount?.pendingCount || 0} Request Pending`
      },

      // {
      //   id: 3,
      //   title: 'Overdue Approvals (0)', // Placeholder since API doesn't provide overdue
      //   icon: <RunningWithErrorsIcon color='error' />,
      //   status: 'overdue'
      // },
      {
        id: 3,
        title: 'Rejected Approvals',
        icon: <RunningWithErrorsIcon color='error' />,
        status: 'rejected',
        note: `${fetchApprovalsData.approvalCount?.rejectedCount || 0} Request Rejected`
      }
    ],
    [fetchApprovalsData.approvalCount]
  )

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1) // Reset to the first page when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const id = getUserId()

  // Fetch user data
  useEffect(() => {
    if (id) {
      dispatch(fetchUser(id as string))
    }

    return () => {
      dispatch(clearUser())
      dispatch(clearApprovals())
    }
  }, [id, dispatch])

  // Fetch approvals when designation, page, limit, or debouncedSearch changes
  useEffect(() => {
    if (fetchUserSuccess && fetchUserData?.designation) {
      let normalizedDesignation: string

      if (Array.isArray(fetchUserData.designation)) {
        normalizedDesignation = fetchUserData.designation[0] || ''
      } else if (typeof fetchUserData.designation === 'string') {
        normalizedDesignation = fetchUserData.designation
      } else {
        console.warn('Invalid designation type:', fetchUserData.designation)

        return
      }

      dispatch(
        fetchApprovals({
          page,
          limit,
          search: debouncedSearch,
          approverDesignation: normalizedDesignation
        })
      )
    } else {
      console.warn('Invalid or missing designation:', fetchUserData?.designation)
    }
  }, [fetchUserSuccess, fetchUserData?.designation, page, limit, debouncedSearch, dispatch])

  // Define table columns
  interface ApprovalRow {
    id: number
    categoryName: string
    description: string
    approvedCount: number
    pendingCount: number
    rejectedCount: number
    overdue?: string
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Sl No',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>
      }),
      columnHelper.accessor('categoryName', {
        header: 'Approval Category',
        cell: ({ row }: { row: { original: ApprovalRow } }) => (
          <Typography>{row.original.categoryName || '-'}</Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }: { row: { original: ApprovalRow } }) => (
          <Typography>{row.original.description || '-'}</Typography>
        )
      }),
      columnHelper.accessor('approvedCount', {
        header: 'Approved',
        cell: ({ row }) => <Typography>{row.original.approvedCount || '0'}</Typography>
      }),
      columnHelper.accessor('pendingCount', {
        header: 'Pending',
        cell: ({ row }) => <Typography>{row.original.pendingCount || '0'}</Typography>
      }),
      columnHelper.accessor('rejectedCount', {
        header: 'Rejected',
        cell: ({ row }) => <Typography>{row.original.rejectedCount || '0'}</Typography>
      }),

      columnHelper.accessor('Move to', {
        header: 'Move to',
        cell: () => (
          <Typography>
            <ExitToAppIcon></ExitToAppIcon>
          </Typography>
        ) // Placeholder since API doesn't provide overdue
      })
    ],
    []
  )

  if (fetchUserFailure) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-red-500 text-lg'>{fetchUserFailureMessage}</div>
      </div>
    )
  }

  if (fetchApprovalsFailure) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-red-500 text-lg'>
          {fetchApprovalsFailureMessage || 'Error fetching approvals. Please check the designation and try again.'}
        </div>
      </div>
    )
  }

  if (!fetchUserSuccess || !fetchUserData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-gray-500 text-lg'>No user data found</div>
      </div>
    )
  }

  return (
    <>
      <Card>
        <Box sx={{ display: 'flex', padding: 3 }}>
          <DynamicTextField
            label='Search Approvals'
            variant='outlined'
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder='Search approvals...'
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <i className='tabler-search text-xxl' />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Card>
      <Grid item xs={12} sm={6} md={3} className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
        {approvals.map(approval => (
          <Card
            key={approval.id}
            sx={{
              cursor: 'pointer',
              padding: 2,
              boxShadow: 'none',
              borderBottom: `4px solid ${
                statusColors[approval.status.charAt(0).toUpperCase() + approval.status.slice(1)] || 'inherit'
              }`
            }}
          >
            <Grid className='flex justify-between items-center mb-2'>
              <Box>
                <Typography variant='h6' component='div'>
                  {approval.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {approval.note}
                </Typography>
              </Box>
              {approval.icon}
            </Grid>
          </Card>
        ))}
      </Grid>
      <Box className='mt-5'>
        <DynamicTable
          columns={columns}
          data={fetchApprovalsData.data || []} // Pass the data array
          totalCount={fetchApprovalsData.totalCount || 0} // Use totalCount from API
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          tableName='Approval List'
          loading={fetchApprovalsLoading}
        />
      </Box>
    </>
  )
}

export default ApprovalManagement
