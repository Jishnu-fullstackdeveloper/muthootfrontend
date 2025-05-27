'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Tabs,
  Tab
} from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import { toast, ToastContainer } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import {
  fetchVacancyRequests,
  updateVacancyRequestStatus,
  autoApproveVacancyRequests
} from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import type { RootState, AppDispatch } from '@/redux/store'
import { getUserId } from '@/utils/functions'
import ResignedEmployeesTableView from './ResignationDataTable'
import L2ManagerDashboard from './L2ManagerDashboard'
import type { VacancyRequest } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'

interface ViewMode {
  view: 'grid' | 'table'
}

interface SelectedTabs {
  [key: string]: number
}

const ResignationDataListingPage = () => {
  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()

  const {
    vacancyRequestListLoading: loading,
    vacancyRequestListData: vacancyRequests,
    vacancyRequestListTotal: totalCount,
    vacancyRequestListFailureMessage: error
  } = useAppSelector((state: RootState) => state.vacancyManagementReducer)
  const approverId = getUserId()

  const [viewMode, setViewMode] = useState<ViewMode['view']>('grid')
  const [visibleRequests, setVisibleRequests] = useState<VacancyRequest[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [noMoreData, setNoMoreData] = useState<boolean>(false)
  const [selectedTabs, setSelectedTabs] = useState<SelectedTabs>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Fetch vacancy requests with filters
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined

      setVisibleRequests([])
      setPage(1)
      setNoMoreData(false)
      setSelectedTabs({})
      dispatch(
        fetchVacancyRequests({
          page: 1,
          limit: visibleRequests.length || limit,
          approverId: approverId
          // createdAt: formattedFromDate
        })
      )
        .unwrap()
        .then(result => {
          const newRequests = result.data || []
          setVisibleRequests(newRequests)
          setSelectedTabs(newRequests.reduce((acc, request) => ({ ...acc, [request.id]: 0 }), {} as SelectedTabs))
        })
        .catch(err => console.error('Fetch vacancy requests failed:', err))
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [dispatch, limit, fromDate])

  // Update visible requests with unique items from API
  useEffect(() => {
    if (vacancyRequests?.length && viewMode === 'grid') {
      setVisibleRequests((prev: VacancyRequest[]) => {
        const newRequests = vacancyRequests.filter(request => !prev.some(existing => existing.id === request.id))
        const updatedRequests = [...prev, ...newRequests]

        // Update selectedTabs for all requests, preserving existing selections
        setSelectedTabs(prevTabs => {
          const updatedTabs = { ...prevTabs }
          updatedRequests.forEach(request => {
            if (!(request.id in updatedTabs)) {
              updatedTabs[request.id] = 0 // Default to tab 0 if not already set
            }
          })
          return updatedTabs
        })

        return updatedRequests
      })
      setNoMoreData(false)
    } else if (!vacancyRequests?.length && viewMode === 'grid' && !loading) {
      setVisibleRequests([])
      setSelectedTabs({})
      setNoMoreData(true)
    }
  }, [vacancyRequests, viewMode, loading])

  // Lazy loading for more vacancy requests
  const loadMoreRequests = useCallback(() => {
    if (loading || visibleRequests.length >= totalCount || noMoreData) return
    const nextPage = page + 1

    setPage(nextPage)
    const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined

    dispatch(
      fetchVacancyRequests({
        page: 1,
        limit: visibleRequests.length || limit,
        approverId: approverId
        // createdAt: formattedFromDate
      })
    )
      .unwrap()
      .then(result => {
        console.log('Loaded more vacancy requests:', result)
      })
      .catch(err => console.error('Load more failed:', err))
  }, [loading, visibleRequests.length, totalCount, noMoreData, page, dispatch, limit, fromDate])

  useEffect(() => {
    if (viewMode !== 'grid' || visibleRequests.length >= totalCount) return

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreRequests()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreRequests, viewMode, visibleRequests.length, totalCount, loading])

  // Handle tab change
  const handleTabChange = (requestId: string, newValue: number) => {
    setSelectedTabs(prev => ({ ...prev, [requestId]: newValue }))
  }

  // Handle status update (Approve, Reject, Freeze) with toast
  const handleStatusUpdate = (requestId: string, status: 'APPROVED' | 'REJECTED' | 'FREEZE') => {
    const approverId = getUserId()
    if (!approverId) {
      toast.error('No logged-in user ID found', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    dispatch(updateVacancyRequestStatus({ id: requestId, approverId, status }))
      .unwrap()
      .then(() => {
        toast.success(`Vacancy request ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })

        // Refetch the vacancy requests to update the UI
        const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined
        dispatch(
          fetchVacancyRequests({
            page: 1,
            limit: visibleRequests.length || limit,
            approverId: approverId
            // createdAt: formattedFromDate
          })
        )
          .unwrap()
          .then(result => {
            const newRequests = result.data || []
            setVisibleRequests(newRequests)
            setSelectedTabs(newRequests.reduce((acc, request) => ({ ...acc, [request.id]: 0 }), {} as SelectedTabs))
            setPage(1)
            setNoMoreData(false)
          })
          .catch(err => console.error('Refetch after status update failed:', err))
      })
      .catch(err => {
        toast.error(`Failed to update status to ${status}: ${err}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      })
  }

  // Handle auto-approve with updated list
  const handleAutoApprove = () => {
    dispatch(autoApproveVacancyRequests())
      .unwrap()
      .then(result => {
        toast.success(result.message || 'Vacancy requests auto-approved successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })

        // Refetch the vacancy requests to update the UI
        const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined
        const approverId = getUserId()
        dispatch(
          fetchVacancyRequests({
            page: 1,
            limit: visibleRequests.length || limit,
            approverId: approverId
            // createdAt: formattedFromDate
          })
        )
          .unwrap()
          .then(fetchResult => {
            const newRequests = fetchResult.data || []
            setVisibleRequests(newRequests)
            setSelectedTabs(newRequests.reduce((acc, request) => ({ ...acc, [request.id]: 0 }), {} as SelectedTabs))
            setPage(1)
            setNoMoreData(false)
          })
          .catch(err => console.error('Refetch after auto-approve failed:', err))
      })
      .catch(err => {
        toast.error(err || 'Failed to auto-approve vacancy requests', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      })
  }

  const handleCardClick = (requestId: string) => {
    router.push(`/resignation-details/${requestId}`)
  }

  return (
    <Box>
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
            <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 3 }}>
              Vacancy Requests
            </Typography>
          </Box>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 3, zIndex: 1100 }}>
            <Button variant='contained' color='primary' onClick={handleAutoApprove} disabled={loading}>
              Auto Approve
            </Button>
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

      <Box>
        <L2ManagerDashboard />
      </Box>

      {loading && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            Loading...
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='secondary'>
            {error.includes('No vacancy requests found') ? 'No vacancy requests found' : `Error: ${error}`}
          </Typography>
        </Box>
      )}

      <Box className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          visibleRequests?.map(request => (
            <Box
              key={request.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              sx={{ cursor: 'pointer', minHeight: '250px' }}
              onClick={() => handleCardClick(request.id)}
            >
              <Box className='pt-3 pl-4 pb-1 pr-2 flex justify-between items-center'>
                <Tooltip title='Employee Name'>
                  <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
                    {request.employees.firstName} {request.employees.middleName || ''} {request.employees.lastName}
                  </Typography>
                </Tooltip>
                <Chip
                  label={request.status}
                  size='small'
                  variant='tonal'
                  color={
                    request.status === 'APPROVED' || request.status === 'AUTO APPROVED'
                      ? 'success'
                      : request.status === 'REJECTED'
                        ? 'error'
                        : request.status === 'FREEZE'
                          ? 'info'
                          : 'default'
                  }
                  sx={{ ml: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
                />
              </Box>
              <Box className='p-2 border-t'>
                <Tabs
                  value={selectedTabs[request.id] || 0}
                  onClick={e => e.stopPropagation()}
                  onChange={(e, newValue) => handleTabChange(request.id, newValue)}
                  aria-label='vacancy request details'
                >
                  <Tab label='Details' sx={{ fontSize: '11px' }} />
                  <Tab label='More Details' sx={{ fontSize: '11px' }} />
                </Tabs>
                <Box className='mt-4'>
                  {selectedTabs[request.id] === 0 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      <Tooltip title='Employee Code'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PersonOutlineOutlinedIcon fontSize='small' />: {request.employees.employeeCode}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Designation'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CardMembershipOutlinedIcon fontSize='small' />: {request.designations.name}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Department'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <AccountTreeOutlinedIcon fontSize='small' />: {request.departments.name}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Branch'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <StoreOutlinedIcon fontSize='small' />: {request.branches.name}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Date of Resignation'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CalendarMonthOutlinedIcon fontSize='small' />:{' '}
                          {request.employees.resignationDetails.dateOfResignation.split('T')[0]}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Last Working Day'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CalendarTodayOutlinedIcon fontSize='small' />:{' '}
                          {request.employees.resignationDetails.lwd.split('T')[0]}
                        </Typography>
                      </Tooltip>
                    </Box>
                  )}
                  {selectedTabs[request.id] === 1 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      <Tooltip title='Notice Period'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CalendarTodayOutlinedIcon fontSize='small' />:{' '}
                          {request.employees.resignationDetails.noticePeriod} days
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Relieving Date'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <EventOutlinedIcon fontSize='small' />:{' '}
                          {request.employees.resignationDetails.relievingDateAsPerNotice.split('T')[0]}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Notes'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <NoteOutlinedIcon fontSize='small' />: {request.employees.resignationDetails.notes || '-'}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Origin'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <WorkOutlineOutlinedIcon fontSize='small' />: {request.origin}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Company'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <BusinessOutlinedIcon fontSize='small' />: {request.employees.companyStructure.company}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='City'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <LocationCityOutlinedIcon fontSize='small' />: {request.employees.address.residenceCity}
                        </Typography>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Box
                  className='mt-4 flex justify-end gap-2'
                  sx={{
                    minHeight: '40px', // Ensure consistent height even if buttons are hidden
                    alignItems: 'center'
                  }}
                >
                  {request.status === 'PENDING' && (
                    <>
                      <Tooltip title='Approve'>
                        <Button
                          variant='tonal'
                          color='success'
                          size='small'
                          startIcon={<CheckCircleOutlineIcon />}
                          onClick={e => {
                            e.stopPropagation()
                            handleStatusUpdate(request.id, 'APPROVED')
                          }}
                        >
                          Approve
                        </Button>
                      </Tooltip>
                      <Tooltip title='Reject'>
                        <Button
                          variant='tonal'
                          color='error'
                          size='small'
                          startIcon={<CancelOutlinedIcon />}
                          onClick={e => {
                            e.stopPropagation()
                            handleStatusUpdate(request.id, 'REJECTED')
                          }}
                        >
                          Reject
                        </Button>
                      </Tooltip>
                      <Tooltip title='Freeze'>
                        <Button
                          variant='tonal'
                          color='info'
                          size='small'
                          startIcon={<PauseCircleOutlineIcon />}
                          onClick={e => {
                            e.stopPropagation()
                            handleStatusUpdate(request.id, 'FREEZE')
                          }}
                        >
                          Freeze
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <ResignedEmployeesTableView fromDate={fromDate ? fromDate.toISOString().split('T')[0] : undefined} />
        )}
      </Box>

      {viewMode === 'grid' && visibleRequests.length < totalCount && !noMoreData && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>{loading ? 'Loading more...' : 'Scroll to load more'}</Typography>
        </Box>
      )}
      {viewMode === 'grid' && noMoreData && visibleRequests.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No more vacancy requests to load</Typography>
        </Box>
      )}
      <div id='date-picker-portal' />
    </Box>
  )
}

export default ResignationDataListingPage
