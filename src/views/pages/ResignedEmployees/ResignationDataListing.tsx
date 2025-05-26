'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, TextField, InputAdornment, Button, Chip } from '@mui/material'

//import SearchIcon from '@mui/icons-material/Search'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { RootState, AppDispatch } from '@/redux/store'
import { fetchResignedEmployees } from '@/redux/ResignationDataListing/ResignationDataListingSlice'
import ResignedEmployeesTableView from './ResignationDataTable'
import type { ResignedEmployee, ViewMode } from '@/types/resignationDataListing'
import L2ManagerDashboard from './L2ManagerDashboard'

const ResignationDataListingPage = () => {
  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()

  const { employees, loading, error, totalCount } = useAppSelector(
    (state: RootState) => state.resignationDataListingReducer
  )

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [visibleEmployees, setVisibleEmployees] = useState<ResignedEmployee[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(6)

  //const [searchQuery, setSearchQuery] = useState<string>('')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [noMoreData, setNoMoreData] = useState<boolean>(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Consolidated useEffect for fetching employees with debounced search and filters
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

          //search: searchQuery.trim()
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

        //search: searchQuery.trim()
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
    router.push(`/user-management/resigned-employee/view/detail?id=${id}`)
  }

  return (
    <Box className=''>
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
            {/* <TextField
              label='Search by Employee Name'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ width: '400px', mr: 2, mt: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            /> */}
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
              popperProps={{
                strategy: 'fixed'
              }}
              popperClassName='date-picker-popper'
              portalId='date-picker-portal'
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

      {/* {error && !error.includes('No resigned employees found') && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            Error: {error}
          </Typography>
        </Box>
      )} */}

      {error && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='secondary'>
            {error.includes('No resigned employees found') ? 'No resigned employees found' : `Error: ${error}`}
          </Typography>
        </Box>
      )}

      {/* {viewMode === 'grid' && !loading && visibleEmployees.length === 0 && !error && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            {searchQuery ? `No resigned employees match "${searchQuery}"` : 'No resigned employees found'}
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
                      <CalendarTodayOutlinedIcon fontSize='small' />: {employee.resignationDetails.lwd.split('T')[0]}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Notice Period'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayOutlinedIcon fontSize='small' />: {employee.resignationDetails.noticePeriod}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Relieving Date'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventOutlinedIcon fontSize='small' />:{' '}
                      {employee.resignationDetails.relievingDateAsPerNotice?.split('T')[0]}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Notes'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NoteOutlinedIcon fontSize='small' />: {employee.resignationDetails.notes || '-'}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box className='mt-4 flex justify-end gap-2'>
                  <Tooltip title='Approve'>
                    <Button
                      variant='tonal'
                      color='success'
                      size='small'
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={e => {
                        e.stopPropagation()
                        console.log(`Approve resignation for ${employee.employeeCode}`)
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
                        console.log(`Reject resignation for ${employee.employeeCode}`)
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
                        console.log(`Freeze resignation for ${employee.employeeCode}`)
                      }}
                    >
                      Freeze
                    </Button>
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
