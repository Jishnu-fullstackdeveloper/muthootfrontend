/* eslint-disable @typescript-eslint/no-unused-vars */
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
  InputAdornment,
  Autocomplete,
  TextField
} from '@mui/material'
import {
  Visibility,
  Warning,
  WarningAmberRounded,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material'
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

import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

import { ClearIcon } from '@mui/x-date-pickers'

import withPermission from '@/hocs/withPermission'
import { getPermissionRenderConfig, getUserId } from '@/utils/functions'

import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { fetchUser } from '@/redux/Approvals/approvalsSlice'
import {
  fetchBudgetIncreaseRequestList,
  approveRejectBudgetIncreaseRequest
} from '@/redux/BudgetManagement/BudgetManagementSlice'
import type { RootState } from '@/redux/store'

// Components and Utils
import CustomTextField from '@/@core/components/mui/TextField'
import DynamicButton from '@/components/Button/dynamicButton'
import AreaFilterDialog from '@/@core/components/dialogs/recruitment-location-filters'
import BudgetListingTableView from './BudgetListingTableView'

const HeadcountDetailsData = [
  {
    designation: 'Senior Developer',
    locationUnit: 'Branch 1',
    count: 5,
    'isTemporary?': false,
    tempDate: null,
    notes: 'standard_approval'
  },
  {
    designation: 'Sales Executive',
    locationUnit: 'Branch 2',
    count: 5,
    'isTemporary?': false,
    tempDate: null,
    notes: 'standard_approval'
  },
  {
    designation: 'HR Manager',
    locationUnit: 'Zone 2',
    count: 2,
    'isTemporary?': true,
    tempDate: '2025-07-15',
    notes: 'special_approval'
  },
  {
    designation: 'Sales Executive',
    locationUnit: 'Region 1',
    count: 3,
    'isTemporary?': false,
    tempDate: null,
    notes: 'standard_approval'
  },
  {
    designation: 'Project Lead',
    locationUnit: 'Area 3',
    count: 4,
    'isTemporary?': true,
    tempDate: '2025-08-01',
    notes: 'special_approval'
  },
  {
    designation: 'Finance Officer',
    locationUnit: 'Cluster 2',
    count: 1,
    'isTemporary?': false,
    tempDate: null,
    notes: 'standard_approval'
  },
  {
    designation: 'Marketing Specialist',
    locationUnit: 'Territory 3',
    count: 6,
    'isTemporary?': true,
    tempDate: '2025-07-20',
    notes: 'special_approval'
  }
]

const PositionBudgetMatrix = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  //Toggle View
  const locationTypes = ['Branch', 'Area', 'Region', 'Zone']

  const [selectedLocationType, setSelectedLocationType] = useState<'Branch' | 'Area' | 'Region' | 'Zone'>('Branch')

  const [gridLimit, setGridLimit] = useState(10) // Initial limit for grid view

  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  // State Management
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 100, display_numbers_count: 10 })
  const [openLocationFilter, setOpenLocationFilter] = useState(false)

  const { designations, approvalCategories, levels } = useAppSelector(state => state.approvalMatrixReducer) // Removed grades from selector

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

  const { fetchUserData } = useAppSelector((state: RootState) => state.approvalsReducer) as any

  const userId = getUserId()
  const approverDesignation = fetchUserData?.designation || ''

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
    const inputRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    return (
      <CustomTextField
        variant='filled'
        {...props}
        inputRef={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />
    )
  }

  // Lazy Loading State
  const [allBudgetData, setAllBudgetData] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const limit = 10 // Fixed limit set to 10
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  // Handle Approve/Reject
  const handleApprove = (id: string, approvalRequestId: string) => {
    dispatch(
      approveRejectBudgetIncreaseRequest({
        approvalRequestId,
        status: 'APPROVED',
        approverId: userId,
        approverDesignation: approverDesignation.toUpperCase()
      })
    ).then(() => {
      // Reset data and reload
      setAllBudgetData([])
      setPage(1)
      setHasMore(true)
      fetchData(1, true)
    })
  }

  const handleReject = (id: string, approvalRequestId: string) => {
    dispatch(
      approveRejectBudgetIncreaseRequest({
        approvalRequestId,
        status: 'REJECTED',
        approverId: userId,
        approverDesignation: approverDesignation.toUpperCase()
      })
    ).then(() => {
      // Reset data and reload
      setAllBudgetData([])
      setPage(1)
      setHasMore(true)
      fetchData(1, true)
    })
  }

  // Fetch data function
  const fetchData = useCallback(
    (pageNum: number, reset: boolean = false) => {
      if (!hasMore && !reset) return

      dispatch(
        fetchBudgetIncreaseRequestList({
          page: pageNum,
          limit,
          search,
          status: null // Add status filter if needed
        })
      ).then((action: any) => {
        if (action.payload?.data) {
          const newData = action.payload.data

          if (newData.length < limit) {
            setHasMore(false)
          }
        }
      })

      if (reset) {
        setAllBudgetData([])
      }
    },
    [dispatch, limit, search, hasMore]
  )

  // Initial load and search change effect
  useEffect(() => {
    setIsInitialLoad(true)
    setPage(1)
    setHasMore(true)
    fetchData(1, true)
  }, [search, viewMode])

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

  // Scroll-based lazy loading
  useEffect(() => {
    if (viewMode !== 'grid' || !hasMore) return

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop
      const documentHeight = document.documentElement.offsetHeight
      const threshold = 100 // pixels from bottom

      if (scrollPosition >= documentHeight - threshold && !fetchBudgetIncreaseRequestListLoading && hasMore) {
        const nextPage = page + 1

        setPage(nextPage)
        fetchData(nextPage)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchBudgetIncreaseRequestListLoading, hasMore, page, fetchData, viewMode])

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800]
      })
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
      ...theme.applyStyles('dark', {
        backgroundColor: '#308fe8'
      })
    }
  }))

  // Fallback Data
  const budgetData = allBudgetData.length > 0 ? allBudgetData : fetchBudgetIncreaseRequestListData?.data || []

  // Fetch user data
  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId as string))
    }
  }, [userId, dispatch])

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
          top: 70,
          backgroundColor: 'white'
        }}
      >
        <Box
          sx={{
            padding: 4,
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
              letterSpacing: 1,
              whiteSpace: 'nowrap'
            }}
          >
            Position Budget Matrix
          </Typography>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'end',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Autocomplete
              disablePortal
              options={levels}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Branch Type'
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0, // Remove default padding
                      display: 'flex',
                      alignItems: 'center', // Center content vertically
                      justifyContent: 'center', // Center content horizontally
                      height: '30px' // Set fixed height to control size
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px', // Consistent padding for input text
                      textAlign: 'center' // Center placeholder and input text
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px', // Position ChevronDown icon
                      display: 'flex',
                      alignItems: 'center' // Center icon vertically
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%', // Center label vertically when not focused
                      transform: 'translateY(-50%)', // Adjust for vertical centering
                      padding: '0 8px', // Small padding to avoid overlap with input text
                      lineHeight: 'normal' // Ensure consistent label height
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0, // Reset top when label shrinks (on focus or input)
                      transform: 'translate(10%, -50%) scale(0.85)' // Adjust for shrunk state
                    }
                  }}
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={levels}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0, // Remove default padding
                      display: 'flex',
                      alignItems: 'center', // Center content vertically
                      justifyContent: 'center', // Center content horizontally
                      height: '30px' // Set fixed height to control size
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px', // Consistent padding for input text
                      textAlign: 'center' // Center placeholder and input text
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px', // Position ChevronDown icon
                      display: 'flex',
                      alignItems: 'center' // Center icon vertically
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%', // Center label vertically when not focused
                      transform: 'translateY(-50%)', // Adjust for vertical centering
                      padding: '0 8px', // Small padding to avoid overlap with input text
                      lineHeight: 'normal' // Ensure consistent label height
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0, // Reset top when label shrinks (on focus or input)
                      transform: 'translate(10%, -50%) scale(0.85)' // Adjust for shrunk state
                    }
                  }}
                  {...params}
                  label='Departments'
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={levels}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0, // Remove default padding
                      display: 'flex',
                      alignItems: 'center', // Center content vertically
                      justifyContent: 'center', // Center content horizontally
                      height: '30px' // Set fixed height to control size
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px', // Consistent padding for input text
                      textAlign: 'center' // Center placeholder and input text
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px', // Position ChevronDown icon
                      display: 'flex',
                      alignItems: 'center' // Center icon vertically
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%', // Center label vertically when not focused
                      transform: 'translateY(-50%)', // Adjust for vertical centering
                      padding: '0 8px', // Small padding to avoid overlap with input text
                      lineHeight: 'normal' // Ensure consistent label height
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0, // Reset top when label shrinks (on focus or input)
                      transform: 'translate(10%, -50%) scale(0.85)' // Adjust for shrunk state
                    }
                  }}
                  {...params}
                  label='Designation'
                />
              )}
            />
          </Box>
        </Box>
      </Card>

      <Box className='flex justify-between w-full items-center'>
        <Box className='flex gap-2 rounded-md p-1 justify-center'>
          <TextField
            className='bg-white rounded-md'
            size='small'
            placeholder='Search users...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
              endAdornment: searchTerm && (
                <IconButton size='small' onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              )
            }}
          />
          <Button
            className='bg-white hover:bg-transparent'
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={() => setFilterOpen(true)}
          >
            Filter
          </Button>
        </Box>
        <Box className='flex gap-2 bg-gray-200 rounded-md p-1 justify-center'>
          {locationTypes.map(type => (
            <Chip
              key={type}
              label={type}
              onClick={() => {
                setSelectedLocationType(type as typeof selectedLocationType)
                setHasMore(true) // Reset hasMore to allow lazy loading
                setGridLimit(10) // Reset grid limit on location change
              }}
              color={selectedLocationType === type ? 'primary' : 'default'}
              sx={{
                fontSize: '0.7rem',
                height: '24px',
                borderRadius: '6px',
                fontWeight: selectedLocationType === type ? 600 : 400,
                bgcolor: selectedLocationType === type ? '#1976d2' : '#fff',
                color: selectedLocationType === type ? '#fff' : '#333',
                boxShadow:
                  selectedLocationType === type ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: selectedLocationType === type ? '#1565c0' : '#d5d5d5',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <>
        <Grid container spacing={4} className='mt-4'>
          {HeadcountDetailsData.filter(budget => budget.locationUnit.includes(selectedLocationType)).map(
            (budget, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card
                  onClick={() =>
                    router.push(
                      `/hiring-management/budget-management/position-budget-matrix/view/${budget.designation.replace(/\s+/g, '')}`
                    )
                  }
                  sx={{
                    p: 2,
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
                  <Box
                    sx={{
                      bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      p: 3,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>{budget.designation}</Typography>
                      <Typography sx={{ fontSize: 10 }}>{budget.locationUnit}</Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Box className='text-sm text-gray-700 flex flex-col gap-y-3'>
                          <Box className='grid grid-cols-2 w-full items-center'>
                            <Typography className='w-full whitespace-nowrap' sx={{ fontWeight: 'bold', fontSize: 10 }}>
                              Expected Budget
                            </Typography>
                            <Typography
                              className='flex w-full whitespace-nowrap justify-end'
                              variant='body2'
                              fontSize='10px'
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              {budget.count}
                            </Typography>
                          </Box>
                          <Box className='grid grid-cols-2 w-full items-center'>
                            <Typography className='w-full whitespace-nowrap' sx={{ fontWeight: 'bold', fontSize: 10 }}>
                              Actual Budget
                            </Typography>
                            <Box className='flex gap-2 items-center'>
                              <Typography
                                className='flex w-full whitespace-nowrap justify-end'
                                variant='body2'
                                fontSize='12px'
                                fontWeight='bold'
                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                              >
                                {budget.count}
                              </Typography>
                              <Box className='flex border border-gray-400 rounded-full justify-center items-center'>
                                <Typography
                                  className='px-2 py-0.5 whitespace-nowrap'
                                  variant='body2'
                                  fontWeight='bold'
                                  fontSize='8px'
                                >
                                  (No Variance)
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Box className='flex justify-between w-full items-center'>
                            <Typography className='w-full whitespace-nowrap' sx={{ fontWeight: 'bold', fontSize: 10 }}>
                              Temporary Position
                            </Typography>
                            <Typography
                              variant='body2'
                              fontSize='10px'
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              {budget['isTemporary?'] ? <WarningAmberRounded fontSize='small' /> : 'null'}
                            </Typography>
                          </Box>
                          <Box className='flex flex-col gap-0.5'>
                            <BorderLinearProgress variant='determinate' value={100} />
                            <Typography
                              variant='body2'
                              fontSize='8px'
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'medium' }}
                            >
                              100% Filled
                            </Typography>
                          </Box>
                          <Box className='flex w-full justify-center border border-[#0095DA] rounded-md'>
                            <Button className='flex gap-1 items-center w-full'>
                              <Visibility />
                              View Details
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </>
    </Box>
  )
}

export default PositionBudgetMatrix
