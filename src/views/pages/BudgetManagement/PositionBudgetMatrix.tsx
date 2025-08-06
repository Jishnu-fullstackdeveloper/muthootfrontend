/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { useEffect, useState, useCallback, useRef } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import type { TextFieldProps } from '@mui/material'
import { Box, Card, CardContent, Chip, Grid, Typography, IconButton, CircularProgress, Button } from '@mui/material'
import { Visibility, Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material'

import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

import { ClearIcon } from '@mui/x-date-pickers'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

// Components and Utils
import CustomTextField from '@/@core/components/mui/TextField'
import AreaFilterDialog from '@/@core/components/dialogs/recruitment-location-filters'

// Redux Imports
import { fetchPositionMatrix, createEmployeeCount } from '@/redux/PositionBudgetMatrix/positionMatrixSlice'

const PositionBudgetMatrix = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Redux State
  const { positionMatrixData, status, error, totalCount, page, limit } = useAppSelector(
    state => state.positionBudgetMatrixReducer
  )

  // Toggle View
  const locationTypes = ['Branch', 'Area', 'Cluster', 'Region', 'Zone', 'Territory', 'Corporate']

  const [selectedLocationType, setSelectedLocationType] = useState<
    'Branch' | 'Area' | 'Cluster' | 'Region' | 'Zone' | 'Territory' | 'Corporate'
  >('Branch')

  const [gridLimit, setGridLimit] = useState(10) // Initial limit for grid view
  const [selectedLocationFilters, setSelectedLocationFilters] = useState<Record<string, any>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  // State Management
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 100, display_numbers_count: 10 })
  const [openLocationFilter, setOpenLocationFilter] = useState(false)

  // Filter Area Options
  const filterAreaOptions = {
    territory: [{ name: 'Territory 1' }, { name: 'Territory 2' }, { name: 'Territory 3' }],
    zone: ['Zone 1', 'Zone 2', 'Zone 3'],
    region: ['Region 1', 'Region 2', 'Region 3'],
    area: ['Area 1', 'Area 2', 'Area 3'],
    cluster: ['Cluster 1', 'Cluster 2', 'Cluster 3'],
    branch: ['Branch 1', 'Branch 2', 'Branch 3']
  }

  // const truncatedesignation = (designation: string) => {
  //   if (designation.length > 20) {
  //     return `${designation.slice(0, 20)}...`
  //   }

  //   return designation
  // }

  // Handle Location Filter Changes
  const handleLocationFilterChange = (filterKey: string) => (value: any) => {
    setSelectedLocationFilters(prev => ({ ...prev, [filterKey]: value }))
  }

  const handleApplyFilters = (selectedFilters: Record<string, any>) => {
    console.log(selectedFilters)
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
      if (value === initialValue) return // Prevent unnecessary updates

      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, debounce, onChange, initialValue])

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

  // Fetch data function
  const fetchData = useCallback(
    (pageNum: number, reset: boolean = false) => {
      if (status === 'loading' || (!reset && positionMatrixData.length >= totalCount)) return
      const selectedLocation = selectedLocationType.toLowerCase()

      dispatch(
        fetchPositionMatrix({
          page: pageNum,
          limit,
          filterType: selectedLocation
        })
      )
    },
    [dispatch, limit, selectedLocationType, status, positionMatrixData.length, totalCount]
  )

  // Initial load and search change effect
  useEffect(() => {
    setGridLimit(10)

    //dispatch(resetPositionBudgetState())
    fetchData(1, true)
  }, [search, viewMode, selectedLocationType])

  // Scroll-based lazy loading
  useEffect(() => {
    if (viewMode !== 'grid' || status === 'loading' || positionMatrixData.length >= totalCount) return

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop
      const documentHeight = document.documentElement.offsetHeight
      const threshold = 100 // pixels from bottom

      if (scrollPosition >= documentHeight - threshold && positionMatrixData.length < totalCount) {
        const nextPage = page + 1

        fetchData(nextPage)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [positionMatrixData, totalCount, page, fetchData, viewMode, status])

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
  const budgetData = positionMatrixData.length > 0 ? positionMatrixData : []

  // console.log(budgetData, 'ssssssssssssssssss', positionMatrixData)

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )} */}
      {/* {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, color: 'error.main' }}>
          <Typography>Error: {error}</Typography>
        </Box>
      )} */}
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
            {/* FILTERS */}
            {/* <Autocomplete
              disablePortal
              options={locationTypes}
              sx={{ width: 150 }}
              value={selectedLocationType}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedLocationType(newValue as typeof selectedLocationType)
                }
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Branch Type'
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      textAlign: 'center'
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0 8px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      transform: 'translate(10%, -50%) scale(0.85)'
                    }
                  }}
                />
              )}
            /> */}
            {/* <Autocomplete
              disablePortal
              options={['Department 1', 'Department 2', 'Department 3']}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      textAlign: 'center'
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0 8px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      transform: 'translate(10%, -50%) scale(0.85)'
                    }
                  }}
                  {...params}
                  label='Departments'
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={[...new Set(positionMatrixData.map(item => item.designation))]}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      textAlign: 'center'
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0 8px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      transform: 'translate(10%, -50%) scale(0.85)'
                    }
                  }}
                  {...params}
                  label='designation'
                />
              )}
            /> */}
          </Box>
        </Box>
      </Card>

      <Box className='flex justify-between w-full items-center'>
        <Box className='flex gap-2 rounded-md p-1 justify-center'>
          <DebouncedInput
            className='bg-white rounded-md'
            size='small'
            placeholder='Search users...'
            value={searchTerm}
            onChange={value => setSearchTerm(value)}
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
        <Box>
          {status === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {status === 'failed' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, color: 'error.main' }}>
              <Typography>Error: {error || 'Failed to fetch budget data'}</Typography>
            </Box>
          )}
          {status === 'succeeded' && positionMatrixData.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='h6' color='text.secondary'>
                No budget data found
              </Typography>
            </Box>
          )}
          {status === 'succeeded' && positionMatrixData.length > 0 && (
            <Grid container spacing={4} className='mt-4'>
              {positionMatrixData.map((budget, index) => {
                const variance = budget.expectedCount - budget.actualCount

                const fillPercentage =
                  budget.expectedCount > 0 ? Math.min((budget.actualCount / budget.expectedCount) * 100, 100) : 0

                return (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1, pr: 2 }}>
                          <Typography
                            className='overflow-hidden text-ellipsis uppercase'
                            sx={{ fontWeight: 'bold', fontSize: 14 }}
                          >
                            {budget.designation}
                          </Typography>
                          <Typography className='uppercase' sx={{ fontSize: 10 }}>
                            {budget.locationUnit}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Box className='text-sm text-gray-700 flex flex-col gap-y-3'>
                              <Box className='grid grid-cols-2 w-full items-center'>
                                <Typography
                                  className='w-full whitespace-nowrap'
                                  sx={{ fontWeight: 'bold', fontSize: 10 }}
                                >
                                  Expected Budget
                                </Typography>
                                <Typography
                                  className='flex w-full whitespace-nowrap justify-end'
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  {budget.expectedCount}
                                </Typography>
                              </Box>
                              <Box className='grid grid-cols-2 w-full items-center'>
                                <Typography
                                  className='w-full whitespace-nowrap'
                                  sx={{ fontWeight: 'bold', fontSize: 10 }}
                                >
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
                                    {budget.actualCount}
                                  </Typography>
                                  <Box className='flex border border-gray-400 rounded-full justify-center items-center'>
                                    <Typography
                                      className='px-2 py-0.5 whitespace-nowrap'
                                      variant='body2'
                                      fontWeight='bold'
                                      fontSize='8px'
                                    >
                                      {variance === 0 ? '(No Variance)' : `(${variance > 0 ? '+' : ''}${variance})`}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Box className='flex justify-between w-full items-center'>
                                <Typography
                                  className='w-full whitespace-nowrap'
                                  sx={{ fontWeight: 'bold', fontSize: 10 }}
                                >
                                  Temporary Position
                                </Typography>
                                <Typography
                                  variant='body2'
                                  fontSize='10px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  {budget.temporaryCount}
                                </Typography>
                              </Box>
                              <Box className='flex flex-col gap-0.5'>
                                <BorderLinearProgress variant='determinate' value={fillPercentage} />
                                <Typography
                                  variant='body2'
                                  fontSize='8px'
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'medium' }}
                                >
                                  {fillPercentage.toFixed(0)}% Filled
                                </Typography>
                              </Box>
                              <Box className='flex w-full justify-center border border-[#0095DA] rounded-md'>
                                <Button
                                  className='flex gap-1 items-center w-full'
                                  onClick={async () => {
                                    try {
                                      const response = await dispatch(
                                        createEmployeeCount({
                                          expectedCount: budget.expectedCount,
                                          actualCount: budget.actualCount,
                                          additionalCount: budget.additionalCount,
                                          temporaryCount: budget.temporaryCount,
                                          employeeCodes: budget.employeeCodes
                                        })
                                      ).unwrap()

                                      router.push(
                                        `/hiring-management/budget-management/position-budget-matrix/view/detail?designation=${encodeURIComponent(budget.designation)}&employeeCodes=${encodeURIComponent(budget.employeeCodes.join(','))}`
                                      )
                                    } catch (error) {
                                      console.error('Failed to create employee count:', error)
                                    }
                                  }}
                                >
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
              })}
            </Grid>
          )}
        </Box>
      </>
    </Box>
  )
}

export default PositionBudgetMatrix
