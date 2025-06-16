'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Typography, IconButton, Tooltip, InputAdornment, Grid, CircularProgress } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { getUserId } from '@/utils/functions'
import { fetchUser, fetchApprovals, clearUser, clearApprovals } from '@/redux/Approvals/approvalsSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import ApprovalManagement from './Approvals'
import { ROUTES } from '@/utils/routes'
import type { Approvals } from '@/types/approvalDashboard'

interface ApprovalsState {
  fetchUserLoading?: boolean
  fetchUserSuccess?: boolean
  fetchUserData?: { designation?: string | string[] } | null
  fetchUserFailure?: boolean
  fetchUserFailureMessage?: string
  fetchApprovalsLoading?: boolean
  fetchApprovalsSuccess?: boolean
  fetchApprovalsData?: {
    data?: { approvalStatus: string; categoryName: string; count: string }[]
    approvalCount?: { approvedCount: number; freezeCount: number; pendingCount: number }
    totalCount?: number
  }
  fetchApprovalsTotalCount?: number
  fetchApprovalsFailure?: boolean
  fetchApprovalsFailureMessage?: string
}

const ApprovalsListing = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const approvalsState = (useAppSelector(state => state.approvalsReducer) as ApprovalsState) || {}

  const {
    fetchUserSuccess = false,
    fetchUserData = null,
    fetchUserFailure = false,
    fetchUserFailureMessage = '',
    fetchApprovalsLoading = false,
    fetchApprovalsData = {
      data: [],
      approvalCount: { approvedCount: 0, freezeCount: 0, pendingCount: 0 },
      totalCount: 0
    },
    fetchApprovalsFailure = false,
    fetchApprovalsFailureMessage = ''
  } = approvalsState

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [visibleApprovals, setVisibleApprovals] = useState<Approvals[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  debouncedSearch

  // Handle search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch user data
  const id = getUserId()

  useEffect(() => {
    if (id) {
      dispatch(fetchUser(id as string))
    }

    return () => {
      dispatch(clearUser())
      dispatch(clearApprovals())
    }
  }, [id, dispatch])

  // Fetch approvals when user data is available
  useEffect(() => {
    if (fetchUserSuccess && fetchUserData?.designation) {
      setLoading(true)
      dispatch(
        fetchApprovals({
          groupByCategory: true
        })
      )
    }
  }, [fetchUserSuccess, fetchUserData?.designation, dispatch])

  // Update visible approvals with API data
  useEffect(() => {
    if (fetchApprovalsLoading) {
      setLoading(true)
    } else if (fetchApprovalsData?.data) {
      setLoading(false)
      setError(null)

      // Transform API response into a single Approvals object
      const approval: Approvals = {
        id: '1',
        categoryName: fetchApprovalsData.data[0]?.categoryName || 'Vacancy Approval',
        approvedCount: 0,
        pendingCount: 0,
        freezeCount: 0
      }

      fetchApprovalsData.data.forEach(item => {
        const count = Number(item.count) || 0

        switch (item.approvalStatus) {
          case 'APPROVED':
            approval.approvedCount = count
            break
          case 'PENDING':
            approval.pendingCount = count
            break
          case 'FREEZED':
            approval.freezeCount = count
            break

          // Ignore REJECTED
        }
      })

      setVisibleApprovals([approval])
    } else if (fetchApprovalsFailure) {
      setLoading(false)
      setVisibleApprovals([])
      setError(fetchApprovalsFailureMessage || 'No approvals found')
    }
  }, [fetchApprovalsLoading, fetchApprovalsData, fetchApprovalsFailure, fetchApprovalsFailureMessage])

  const handleCardClick = () => {
    router.push(ROUTES.APPROVALS_VACANCY_GROUP)
  }

  // Conditional overview for cards
  const getOverview = (approval: Approvals) => {
    const counts = [
      { status: 'Approved', count: approval.approvedCount, color: 'green' },
      { status: 'Pending', count: approval.pendingCount, color: 'orange' },
      { status: 'Freeze', count: approval.freezeCount, color: 'info.main' }
    ]

    const maxCount = Math.max(...counts.map(c => c.count))

    if (maxCount === 0) return 'No approvals yet'
    const dominant = counts.find(c => c.count === maxCount)

    return `Mostly ${dominant?.status} (${dominant?.count})`
  }

  if (fetchUserFailure) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color='error' variant='h6'>
          {fetchUserFailureMessage || 'Failed to fetch user data'}
        </Typography>
      </Box>
    )
  }

  if (fetchApprovalsFailure) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color='error' variant='h6'>
          {fetchApprovalsFailureMessage || 'Failed to fetch approvals'}
        </Typography>
      </Box>
    )
  }

  if (!fetchUserSuccess || !fetchUserData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color='text.secondary' variant='h6'>
          Loading user data...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
      <ToastContainer position='top-right' autoClose={5000} />
      <Card
        sx={{
          bgcolor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          p: 3
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333' }}>
              Approvals List
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.9rem', color: 'green', fontWeight: 500 }}>
                Completed ({fetchApprovalsData.approvalCount?.approvedCount || 0})
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'orange', fontWeight: 500 }}>
                Pending ({fetchApprovalsData.approvalCount?.pendingCount || 0})
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'info.main', fontWeight: 500 }}>
                Freeze ({fetchApprovalsData.approvalCount?.freezeCount || 0})
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DynamicTextField
              label='Search Approvals'
              variant='outlined'
              onChange={e => setSearchTerm(e.target.value)}
              value={searchTerm}
              placeholder='Search approvals...'
              size='small'
              sx={{
                bgcolor: '#fff',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#1976d2' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon sx={{ color: '#757575' }} />
                  </InputAdornment>
                )
              }}
            />
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                padding: '2px',
                bgcolor: '#f5f5f5',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('grid')}
                  size='small'
                  sx={{ p: 0.5 }}
                >
                  <GridViewIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  size='small'
                  sx={{ p: 0.5 }}
                >
                  <TableChartIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {loading && viewMode === 'grid' && (
        <Box sx={{ mb: 4, textAlign: 'center', pt: 20 }}>
          <CircularProgress color='primary' />
        </Box>
      )}

      {error && (
        <Box
          sx={{
            mb: 4,
            height: '30vh',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 20
          }}
        >
          <Typography variant='h6' color='secondary'>
            No approvals found
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 6 }}>
        {viewMode === 'grid' && visibleApprovals.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                onClick={handleCardClick}
                sx={{
                  maxHeight: '200px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  bgcolor: '#fff',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderLeft: '4px solid',
                  borderLeftColor: 'secondary.main',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 1.5, flexGrow: 1 }}>
                  <Typography fontWeight='bold' fontSize='0.9rem' sx={{ color: '#333', mb: 1 }}>
                    {visibleApprovals[0].categoryName}
                  </Typography>
                  <Typography fontSize='0.7rem' color='text.secondary' sx={{ mb: 1.5 }}>
                    {getOverview(visibleApprovals[0])}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, fontSize: '0.7rem' }}>
                    <Tooltip title='Approved'>
                      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'green' }}>
                        <CheckCircleOutlineIcon fontSize='small' />
                        Approved: {visibleApprovals[0].approvedCount || 0}
                      </Typography>
                    </Tooltip>
                    <Tooltip title='Pending'>
                      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'orange' }}>
                        <HourglassEmptyOutlinedIcon fontSize='small' />
                        Pending: {visibleApprovals[0].pendingCount || 0}
                      </Typography>
                    </Tooltip>
                    <Tooltip title='Freeze'>
                      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'info.main' }}>
                        <PauseCircleOutlineIcon fontSize='small' />
                        Freeze: {visibleApprovals[0].freezeCount || 0}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        ) : viewMode === 'grid' ? (
          <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>No approvals available</Typography>
        ) : (
          <ApprovalManagement approvals={visibleApprovals} />
        )}
      </Box>
    </Box>
  )
}

export default ApprovalsListing
