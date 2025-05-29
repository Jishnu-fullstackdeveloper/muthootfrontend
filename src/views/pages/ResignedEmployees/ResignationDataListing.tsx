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
  CircularProgress
} from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SyncIcon from '@mui/icons-material/Sync'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { RootState, AppDispatch } from '@/redux/store'
import {
  fetchResignedEmployees,
  syncResignedEmployees
} from '@/redux/ResignationDataListing/ResignationDataListingSlice'
import ResignedEmployeesTableView from './ResignationDataTable'
import type { ResignedEmployee, ViewMode } from '@/types/resignationDataListing'
import L2ManagerDashboard from './L2ManagerDashboard'
import { ROUTES } from '@/utils/routes'

const ResignationDataListingPage = () => {
  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()

  const { employees, loading, error, totalCount, syncLoading, syncError, syncProcessId } = useAppSelector(
    (state: RootState) => state.resignationDataListingReducer
  )

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [visibleEmployees, setVisibleEmployees] = useState<ResignedEmployee[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [noMoreData, setNoMoreData] = useState<boolean>(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Fetch employees with debounced filters
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined

      setVisibleEmployees([])
      setPage(1)
      setNoMoreData(false)
      dispatch(
        fetchResignedEmployees({
          page: 1,
          limit,
          isResigned: true,
          resignationDateFrom: formattedFromDate
        })
      )
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [dispatch, limit, fromDate])

  // Update visible employees with unique items from API
  useEffect(() => {
    if (employees?.length && viewMode === 'grid') {
      setVisibleEmployees((prev: ResignedEmployee[]) => {
        const newEmployees = employees.filter(employee => !prev.some(existing => existing.id === employee.id))

        return [...prev, ...newEmployees]
      })
      setNoMoreData(false)
    } else if (!employees?.length && viewMode === 'grid' && !loading) {
      setVisibleEmployees([])
      setNoMoreData(true)
    }
  }, [employees, viewMode, loading])

  // Lazy loading
  const loadMoreEmployees = useCallback(() => {
    if (loading || visibleEmployees.length >= totalCount || noMoreData) return
    const nextPage = page + 1

    setPage(nextPage)
    const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined

    dispatch(
      fetchResignedEmployees({
        page: nextPage,
        limit,
        isResigned: true,
        resignationDateFrom: formattedFromDate
      })
    )
  }, [loading, visibleEmployees.length, totalCount, noMoreData, page, dispatch, limit, fromDate])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreEmployees()
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
  }, [loadMoreEmployees])

  const handleCardClick = (id: string) => {
    router.push(ROUTES.HIRING_MANAGEMENT.RESIGNED_EMPLOYEE_DETAIL(id))
  }

  // Handle sync button click
  const handleSync = () => {
    dispatch(syncResignedEmployees())
      .unwrap()
      .then(response => {
        toast.success(response.message || 'Sync initiated successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })

        debounceTimeout.current = setTimeout(() => {
          const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined

          setVisibleEmployees([])
          setPage(1)
          setNoMoreData(false)
          dispatch(
            fetchResignedEmployees({
              page: 1,
              limit,
              isResigned: true,
              resignationDateFrom: formattedFromDate
            })
          )
        }, 300)

        // console.log('Sync initiated successfully:', response.message, 'Process ID:', response.processId)
      })
      .catch(err => {
        toast.error(err || 'Sync failed', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })

        // console.error('Sync failed:', err)
      })
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
              Resignation Data Listing
            </Typography>
          </Box>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 3, zIndex: 1100 }}>
            <AppReactDatepicker
              selected={fromDate}
              onChange={(date: Date | null) => setFromDate(date)}
              placeholderText='Select from date'
              isClearable
              customInput={
                <TextField
                  label='Filter by date'
                  variant='outlined'
                  size='small'
                  sx={{ width: '160px', mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <CalendarTodayOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                />
              }
              popperProps={{ strategy: 'fixed' }}
              popperClassName='date-picker-popper'
              portalId='date-picker-portal'
            />
            <Tooltip title='Sync Resigned Employees'>
              <Button
                variant='contained'
                size='small'
                onClick={handleSync}
                disabled={syncLoading}
                startIcon={<SyncIcon />}
                sx={{
                  backgroundColor: '#e3f2fd', // Light blue background
                  color: '#1976d2', // Blue text/icon color
                  '&:hover': {
                    backgroundColor: '#bbdefb' // Slightly darker on hover
                  },
                  textTransform: 'none',
                  mr: 2
                }}
              >
                {syncLoading ? 'Syncing...' : 'Sync'}
              </Button>
            </Tooltip>
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

      {loading && viewMode === 'grid' && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          {/* <Typography variant='h6' color='text.secondary'>
            Loading...
          </Typography> */}
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
            No resigned employees found
          </Typography>
        </Box>
      )}

      {/* {syncError && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            Sync Error: {syncError}
          </Typography>
        </Box>
      )} */}

      {/* {syncProcessId && !syncError && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='success.main'>
            Sync Initiated Successfully - Process ID: {syncProcessId}
          </Typography>
        </Box>
      )} */}

      <Box className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          visibleEmployees?.map(employee => (
            <Box
              key={employee.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              sx={{ cursor: 'pointer', minHeight: '150px' }}
              onClick={() => handleCardClick(employee.id)}
            >
              <Box className='pt-3 pl-4 pb-1 pr-2 flex justify-between items-center'>
                <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
                  {employee.firstName} {employee.middleName || ''} {employee.lastName}
                </Typography>
                <Tooltip title='Employee Code'>
                  <Chip
                    label={employee.employeeCode}
                    size='small'
                    variant='outlined'
                    sx={{ fontSize: '10px' }}
                    color='secondary'
                  />
                </Tooltip>
              </Box>
              <Box className='p-2 border-t'>
                <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                  <Tooltip title='Designation'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CardMembershipOutlinedIcon fontSize='small' />: {employee.designation.name}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Department'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountTreeOutlinedIcon fontSize='small' />: {employee.department.name}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Date of Resignation'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonthOutlinedIcon fontSize='small' />:
                      {employee.resignationDetails.dateOfResignation.split('T')[0]}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Last Working Day'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayOutlinedIcon fontSize='small' />:{employee.resignationDetails.lwd.split('T')[0]}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Notice Period'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayOutlinedIcon fontSize='small' />: {employee.resignationDetails.noticePeriod}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Relieving Date'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventOutlinedIcon fontSize='small' />:
                      {employee.resignationDetails.relievingDateAsPerNotice?.split('T')[0]}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Notes'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NoteOutlinedIcon fontSize='small' />: {employee.resignationDetails.notes || '-'}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <ResignedEmployeesTableView fromDate={fromDate ? fromDate.toISOString().split('T')[0] : undefined} />
        )}
      </Box>

      {viewMode === 'grid' && visibleEmployees.length < totalCount && !noMoreData && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>{loading ? 'Loading more...' : 'Scroll to load more'}</Typography>
        </Box>
      )}
      {viewMode === 'grid' && noMoreData && visibleEmployees.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No more resigned employees to load</Typography>
        </Box>
      )}
      <div id='date-picker-portal' />
    </Box>
  )
}

export default ResignationDataListingPage
