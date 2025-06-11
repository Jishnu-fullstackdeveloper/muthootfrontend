'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, CircularProgress, InputAdornment, Grid } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'

//import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'

//import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import PendingActionsIcon from '@mui/icons-material/PendingActions'

import { ToastContainer } from 'react-toastify'

import { getUserId } from '@/utils/functions'
import { fetchUser, fetchApprovals, clearUser, clearApprovals } from '@/redux/Approvals/approvalsSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import 'react-toastify/dist/ReactToastify.css'

import type { Approvals, ViewMode } from '@/types/approvalDashboard'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import ApprovalManagement from './Approvals' // Updated table view component
import { ROUTES } from '@/utils/routes'

interface ApprovalsState {
  fetchUserLoading?: boolean
  fetchUserSuccess?: boolean
  fetchUserData?: { designation?: string | string[] } | null
  fetchUserFailure?: boolean
  fetchUserFailureMessage?: string
  fetchApprovalsLoading?: boolean
  fetchApprovalsSuccess?: boolean
  fetchApprovalsData?: {
    data?: Approvals[]
    approvalCount?: { approvedCount: number; rejectedCount: number; pendingCount: number }
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
      approvalCount: { approvedCount: 0, rejectedCount: 0, pendingCount: 0 },
      totalCount: 0
    },
    fetchApprovalsFailure = false,
    fetchApprovalsFailureMessage = ''
  } = approvalsState

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [visibleApprovals, setVisibleApprovals] = useState<Approvals[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [noMoreData, setNoMoreData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Status cards data
  const statusColors = {
    Completed: '#059669',
    Pending: '#D97706',
    Rejected: '#F00'
  }

  const approvalsSummary = [
    {
      id: 1,
      title: 'Completed Approvals',
      icon: <LibraryAddCheckIcon color='success' />,
      status: 'Completed',
      note: `${fetchApprovalsData.approvalCount?.approvedCount || 0} Request Completed`
    },
    {
      id: 2,
      title: 'Pending Approvals',
      icon: <PendingActionsIcon color='warning' />,
      status: 'Pending',
      note: `${fetchApprovalsData.approvalCount?.pendingCount || 0} Request Pending`
    },
    {
      id: 3,
      title: 'Rejected Approvals',
      icon: <RunningWithErrorsIcon color='error' />,
      status: 'Rejected',
      note: `${fetchApprovalsData.approvalCount?.rejectedCount || 0} Request Rejected`
    }
  ]

  // Handle search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
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
      let normalizedDesignation: string

      if (Array.isArray(fetchUserData.designation)) {
        normalizedDesignation = fetchUserData.designation[0] || ''
      } else if (typeof fetchUserData.designation === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        normalizedDesignation = fetchUserData.designation
      } else {
        console.warn('Invalid designation type:', fetchUserData.designation)

        return
      }

      setLoading(true)
      dispatch(
        fetchApprovals({
          page,
          limit,
          search: debouncedSearch
        })
      )
    }
  }, [fetchUserSuccess, fetchUserData?.designation, page, limit, debouncedSearch, dispatch])

  // Update visible approvals with API data
  useEffect(() => {
    if (fetchApprovalsLoading) {
      setLoading(true)
    } else if (fetchApprovalsData?.data) {
      setLoading(false)
      setError(null)

      const mappedData = fetchApprovalsData.data.map((item, index) => ({
        ...item,
        id: item.id || `${index + 1}`, // Generate ID if not provided by API
        approvedCount: Number(item.approvedCount) || 0,
        rejectedCount: Number(item.rejectedCount) || 0,
        pendingCount: Number(item.pendingCount) || 0
      }))

      if (page === 1) {
        setVisibleApprovals(mappedData)
      } else {
        setVisibleApprovals(prev => [
          ...prev,
          ...mappedData.filter(approval => !prev.some(existing => existing.id === approval.id))
        ])
      }

      setNoMoreData(
        fetchApprovalsData.data.length < limit || visibleApprovals.length >= (fetchApprovalsData.totalCount ?? 0)
      )
    } else if (fetchApprovalsFailure) {
      setLoading(false)
      setVisibleApprovals([])
      setError(fetchApprovalsFailureMessage || 'No approvals found')
    }
  }, [
    fetchApprovalsLoading,

    //fetchApprovalsSuccess,
    fetchApprovalsData,
    fetchApprovalsFailure,
    fetchApprovalsFailureMessage,
    page,
    limit,
    visibleApprovals.length
  ])

  // Lazy loading
  const loadMoreApprovals = useCallback(() => {
    if (
      loading ||
      noMoreData ||
      (fetchApprovalsData?.totalCount && visibleApprovals.length >= fetchApprovalsData.totalCount)
    )
      return
    const nextPage = page + 1

    setPage(nextPage)
  }, [loading, noMoreData, page, fetchApprovalsData?.totalCount, visibleApprovals.length])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        console.log('IntersectionObserver entry:', {
          isIntersecting: entries[0].isIntersecting,
          boundingClientRect: entries[0].target.getBoundingClientRect()
        })

        if (entries[0].isIntersecting) {
          loadMoreApprovals()
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreApprovals])

  const handleCardClick = () => {
    router.push(ROUTES.APPROVALS_VIEW)
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
    <Box sx={{ minHeight: '100vh' }}>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 1,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-3 border-bs gap-3 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-3 flex-wrap'>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 5 }}>
              Approvals List
            </Typography>
          </Box>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'center', mt: 3, zIndex: 1100 }}>
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
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
                padding: '2px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
                width: 'fit-content'
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

      <Grid item xs={12} sm={6} md={3} className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
        {approvalsSummary.map(approval => (
          <Card
            key={approval.id}
            sx={{
              cursor: 'pointer',
              padding: 2,
              boxShadow: 'none',
              borderBottom: `4px solid ${statusColors[approval.status] || 'inherit'}`
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

      {loading && viewMode === 'grid' && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <CircularProgress color='primary' />
        </Box>
      )}

      {error && (
        <Box
          sx={{
            mb: 4,
            mx: 6,
            height: '30vh',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant='h6' color='secondary'>
            No approvals found
          </Typography>
        </Box>
      )}

      <Box
        className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6 mt-3' : 'space-y-6'}`}

        //sx={{ borderRadius: 2, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}
      >
        {viewMode === 'grid' ? (
          visibleApprovals?.map(approval => (
            <Box
              key={approval.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              sx={{
                minHeight: '110px',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderLeftColor: 'secondary.main'
              }}
              onClick={() => handleCardClick()}
            >
              <Box className='p-1 flex justify-center items-center'>
                <Tooltip title='Approval Category'>
                  <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
                    {approval.categoryName}
                  </Typography>
                </Tooltip>
                {/* <Tooltip title='Approval ID'>
                  <Chip
                    label={approval.id}
                    size='small'
                    variant='outlined'
                    sx={{ fontSize: '10px' }}
                    color='secondary'
                  />
                </Tooltip> */}
              </Box>
              <Box className='p-2 border-t'>
                <Box className='text-sm text-gray-700 grid grid-cols-1 gap-y-2'>
                  {/* <Tooltip title='Approval Category'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryOutlinedIcon fontSize='small' />: {approval.categoryName}
                    </Typography>
                  </Tooltip> */}
                  <Tooltip title='Description'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionOutlinedIcon fontSize='small' />
                      <strong>Description:</strong> {approval.description || '-'}
                    </Typography>
                  </Tooltip>
                  <Box className='text-sm text-gray-700 grid grid-cols-3'>
                    <Tooltip title='Approved'>
                      <Typography
                        variant='body2'
                        fontSize='10px'
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'green' }}
                      >
                        <CheckCircleOutlineIcon fontSize='small' />
                        <strong>Approved:</strong> {approval.approvedCount || '0'}
                      </Typography>
                    </Tooltip>
                    <Tooltip title='Rejected'>
                      <Typography
                        variant='body2'
                        fontSize='10px'
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'red' }}
                      >
                        <CancelOutlinedIcon fontSize='small' />
                        <strong>Rejected:</strong> {approval.rejectedCount || '0'}
                      </Typography>
                    </Tooltip>
                    <Tooltip title='Pending'>
                      <Typography
                        variant='body2'
                        fontSize='10px'
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'orange' }}
                      >
                        <HourglassEmptyOutlinedIcon fontSize='small' />
                        <strong>Pending:</strong> {approval.pendingCount || '0'}
                      </Typography>
                    </Tooltip>
                  </Box>
                  {/* <Tooltip title='Move to'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ArrowForwardOutlinedIcon fontSize='small' />: {approval.moveTo || '-'}
                    </Typography>
                  </Tooltip> */}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <ApprovalManagement approvals={visibleApprovals} />
        )}
      </Box>

      {viewMode === 'grid' &&
        fetchApprovalsData?.totalCount &&
        visibleApprovals.length < fetchApprovalsData.totalCount &&
        !noMoreData && (
          <Box
            ref={loadMoreRef}
            sx={{ textAlign: 'center', mt: 6, minHeight: '200px', padding: '40px', backgroundColor: '#f0f0f0' }}
          >
            <Typography>{loading ? 'Loading more...' : 'Scroll to load more'}</Typography>
          </Box>
        )}
      {/* {viewMode === 'grid' && noMoreData && visibleApprovals.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No more approvals to load</Typography>
        </Box>
      )} */}
    </Box>
  )
}

export default ApprovalsListing
