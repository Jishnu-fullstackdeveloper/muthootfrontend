'use client'

// React Imports
import { useEffect, useState, useCallback, useRef } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Redux Imports

// MUI Imports
import type { TextFieldProps } from '@mui/material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  InputAdornment
} from '@mui/material'
import Divider from '@mui/material/Divider'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined' // designation
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined' // job role
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined' // openings
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined' // experience
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined' // campusOrLateral
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined' // employeeType
import EventOutlinedIcon from '@mui/icons-material/EventOutlined' // starting date
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined' // closing date

import type { RootState } from '@/redux/store'
import {
  fetchBudgetIncreaseRequestList,
  approveRejectBudgetIncreaseRequest
} from '@/redux/BudgetManagement/BudgetManagementSlice'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'

// Components and Utils
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import AreaFilterDialog from '@/@core/components/dialogs/recruitment-location-filters'
import BudgetListingTableView from './BudgetListingTableView'

const BudgetListing = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // State Management
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 100, display_numbers_count: 10 })
  const [openLocationFilter, setOpenLocationFilter] = useState(false)

  const [selectedLocationFilters, setSelectedLocationFilters] = useState({
    territory: '',
    zone: '',
    region: '',
    area: '',
    cluster: '',
    branch: ''
  })

  // Redux State
  const {
    fetchBudgetIncreaseRequestListLoading,
    fetchBudgetIncreaseRequestListData,
    fetchBudgetIncreaseRequestListTotal
  } = useAppSelector((state: RootState) => state.budgetManagementReducer) as any

  // Filter Area Options
  const filterAreaOptions = {
    territory: [{ name: 'Territory 1' }, { name: 'Territory 2' }, { name: 'Territory 3' }],
    zone: ['Zone 1', 'Zone 2', 'Zone 3'],
    region: ['Region 1', 'Region 2', 'Region 3'],
    area: ['Area 1', 'Area 2', 'Area 3'],
    cluster: ['Cluster 1', 'Cluster 2', 'Cluster 3'],
    branch: ['Branch 1', 'Branch 2', 'Branch 3']
  }

  // Handle Location Filter Changes
  const handleLocationFilterChange = (filterKey: string) => (value: any) => {
    setSelectedLocationFilters(prev => ({ ...prev, [filterKey]: value }))
  }

  const handleApplyFilters = (selectedFilters: Record<string, any>) => {
    console.log(selectedFilters)

    // Add API integration for filters when available
  }

  const handlePageChange = (newPage: number) => {
    setPaginationState(prev => ({
      ...prev,
      pageIndex: newPage
    }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPaginationState({
      pageIndex: 0, // Reset to first page when rows per page changes
      pageSize: newPageSize,
      display_numbers_count: 10
    })
  }

  // Debounced Input Component
  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string
    onChange: (value: string) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  // Lazy Loading State
  const [allBudgetData, setAllBudgetData] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const limit = 100 // Fixed limit for lazy loading batches
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Handle Approve/Reject
  const handleApprove = (id: string, approvalRequestId: string) => {
    dispatch(
      approveRejectBudgetIncreaseRequest({
        approvalRequestId,
        status: 'APPROVED',
        approverId: 'some-approver-id', // Replace with dynamic value
        approverDesignation: 'some-designation' // Replace with dynamic value
      })
    ).then(() => {
      // Reset data and reload
      setAllBudgetData([])
      setPage(1)
      fetchData(1, true)
    })
  }

  const handleReject = (id: string, approvalRequestId: string) => {
    dispatch(
      approveRejectBudgetIncreaseRequest({
        approvalRequestId,
        status: 'REJECTED',
        approverId: 'some-approver-id', // Replace with dynamic value
        approverDesignation: 'some-designation' // Replace with dynamic value
      })
    ).then(() => {
      // Reset data and reload
      setAllBudgetData([])
      setPage(1)
      fetchData(1, true)
    })
  }

  // Fetch data function
  const fetchData = useCallback(
    (pageNum: number, reset: boolean = false) => {
      dispatch(
        fetchBudgetIncreaseRequestList({
          page: pageNum,
          limit,
          search,
          status: null // Add status filter if needed
        })
      )

      if (reset) {
        setAllBudgetData([])
      }
    },
    [dispatch, limit, search]
  )

  // Initial load and search change effect
  useEffect(() => {
    setIsInitialLoad(true)
    setPage(1)
    fetchData(1, true)
  }, [search, viewMode, fetchData])

  // Handle new data received
  useEffect(() => {
    if (!fetchBudgetIncreaseRequestListLoading && fetchBudgetIncreaseRequestListData?.data) {
      if (isInitialLoad) {
        setAllBudgetData(fetchBudgetIncreaseRequestListData.data)
        setIsInitialLoad(false)
      } else {
        setAllBudgetData(prev => {
          // Filter out duplicates
          const newData = fetchBudgetIncreaseRequestListData.data.filter(
            newItem => !prev.some(existingItem => existingItem.id === newItem.id)
          )

          return [...prev, ...newData]
        })
      }
    }
  }, [fetchBudgetIncreaseRequestListData, fetchBudgetIncreaseRequestListLoading, isInitialLoad])

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!loadMoreRef.current || viewMode !== 'grid') return

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]

        if (
          firstEntry.isIntersecting &&
          !fetchBudgetIncreaseRequestListLoading &&
          allBudgetData.length < fetchBudgetIncreaseRequestListTotal
        ) {
          const nextPage = page + 1

          setPage(nextPage)
          fetchData(nextPage)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observer.observe(loadMoreRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [
    fetchBudgetIncreaseRequestListLoading,
    allBudgetData.length,
    fetchBudgetIncreaseRequestListTotal,
    page,
    fetchData,
    viewMode
  ])

  // Fallback Data
  const budgetData = allBudgetData.length > 0 ? allBudgetData : fetchBudgetIncreaseRequestListData?.data || []

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <AreaFilterDialog
        open={openLocationFilter}
        setOpen={setOpenLocationFilter}
        selectedLocationFilters={selectedLocationFilters}
        onApplyFilters={handleApplyFilters}
        options={filterAreaOptions}
        handleLocationFilterChange={handleLocationFilterChange}
      />
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          paddingBottom: 2
        }}
      >
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            component='h1'
            variant='h4'
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              letterSpacing: 1
            }}
          >
            Budget Requests
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Last Bot Update on:{' '}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                January 6, 2025
              </Box>
            </Typography>
            <Tooltip title='Click here for help'>
              <IconButton size='small'>
                <HelpOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            p: 3,
            borderTop: 1,
            borderColor: 'divider',
            gap: 2,
            overflowX: 'auto'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 4,
              flexWrap: 'wrap'
            }}
          >
            <DebouncedInput
              label=''
              value={search}
              onChange={value => setSearch(value)}
              placeholder='Search'
              sx={{ width: { xs: '100%', sm: '400px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mt: { xs: 4, md: 0 } }}>
            <DynamicButton
              label='New Budget Request'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/budget-management/add/new`)}
              children='New Request'
            />
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('grid')}
                  size='small'
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  size='small'
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {fetchBudgetIncreaseRequestListLoading && isInitialLoad ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <CircularProgress />
        </Box>
      ) : budgetData?.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <Typography variant='h6' color='text.secondary'>
            There are no requests
          </Typography>
        </Box>
      ) : (
        <>
          {viewMode === 'grid' && (
            <Box sx={{ padding: 2 }}>
              <Grid container spacing={3}>
                {budgetData?.map((budget: any, index: number) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card
                      onClick={() => router.push(`/budget-management/view/${budget.jobTitle}?id=${budget.id}`)}
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: 3,
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: 8,
                          transform: 'translateY(-4px)'
                        },
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Card Header with Gradient Background */}
                      <Box
                        sx={{
                          bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                          p: 3,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>{budget.jobTitle}</Typography>
                        </Box>
                        <Chip
                          label={budget.status}
                          color={
                            budget.status === 'APPROVED'
                              ? 'success'
                              : budget.status === 'REJECTED'
                                ? 'error'
                                : 'warning'
                          }
                          sx={{
                            fontSize: 8,
                            bgcolor:
                              budget.status === 'APPROVED'
                                ? 'success.light'
                                : budget.status === 'REJECTED'
                                  ? 'error.light'
                                  : 'warning.light',
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                      </Box>

                      <Divider></Divider>

                      {/* Card Content */}
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                          {/* Department to Closing Date with Icons and Tooltips */}
                          <Grid item xs={12}>
                            <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                              <Tooltip title='Designation'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <CardMembershipOutlinedIcon fontSize='small' />: {budget.designation}
                                </Typography>
                              </Tooltip>
                              <Tooltip title='Business Role'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <EngineeringOutlinedIcon fontSize='small' />: {budget.businessRole}
                                </Typography>
                              </Tooltip>
                              <Tooltip title='Openings'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <WorkOutlineOutlinedIcon fontSize='small' />: {budget.openings}
                                </Typography>
                              </Tooltip>
                              <Tooltip title='Experience'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <ViewTimelineOutlinedIcon fontSize='small' />: {budget.experienceMin} -{' '}
                                  {budget.experienceMax} years
                                </Typography>
                              </Tooltip>
                              <Tooltip title='Campus/Lateral'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <SchoolOutlinedIcon fontSize='small' />: {budget.campusOrLateral}
                                </Typography>
                              </Tooltip>
                              <Tooltip title='Employee Type'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  <PersonOutlineOutlinedIcon fontSize='small' />: {budget.employeeType}
                                </Typography>
                              </Tooltip>
                              <Tooltip title='Start Date'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'green' }}
                                >
                                  <TodayOutlinedIcon fontSize='small' />: {budget?.startingDate?.split('T')[0]}
                                </Typography>
                              </Tooltip>
                              <Tooltip title='End Date'>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'red' }}
                                >
                                  <EventOutlinedIcon fontSize='small' />: {budget.closingDate?.split('T')[0]}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </Grid>

                          {/* Approve/Reject Buttons (only for PENDING status) */}
                          {budget.status === 'PENDING' && (
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                                <Button
                                  variant='outlined'
                                  color='success'
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleApprove(budget.id, budget.approvalRequestId)
                                  }}
                                  sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderRadius: 1,
                                    px: 3,
                                    py: 1,
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
                                  }}
                                  startIcon={<i className='tabler-check' />}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant='outlined'
                                  color='error'
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleReject(budget.id, budget.approvalRequestId)
                                  }}
                                  sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderRadius: 1,
                                    px: 3,
                                    py: 1,
                                    borderWidth: 2,
                                    '&:hover': { borderWidth: 2 }
                                  }}
                                  startIcon={<i className='tabler-playstation-x' />}
                                >
                                  Reject
                                </Button>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Loading indicator */}
              {fetchBudgetIncreaseRequestListLoading && !isInitialLoad && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {/* Load more trigger */}
              {viewMode === 'grid' && allBudgetData.length < fetchBudgetIncreaseRequestListTotal && (
                <Box ref={loadMoreRef} sx={{ height: '20px', my: 2 }} />
              )}
            </Box>
          )}

          {viewMode === 'table' && (
            <BudgetListingTableView
              data={budgetData}
              totalCount={fetchBudgetIncreaseRequestListTotal}
              pagination={paginationState}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default BudgetListing
