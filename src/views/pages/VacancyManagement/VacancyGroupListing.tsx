'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Tooltip,
  Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// import { set } from 'lodash'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import type { VacancyManagementState, VacancyGroupByDesignationResponse } from '@/types/vacancyManagement'
import { fetchVacanciesGroupByDesignation } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import { ROUTES } from '@/utils/routes'

type ViewMode = 'grid' | 'table'

const locationTypes = ['BRANCH', 'CLUSTER', 'AREA', 'REGION', 'ZONE', 'TERRITORY']

const VacancyGroupListing = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // State for search, location type, view mode, and pagination
  const [searchDesignation, setSearchDesignation] = useState<string>('')

  const [selectedLocationType, setSelectedLocationType] = useState<
    'BRANCH' | 'CLUSTER' | 'AREA' | 'REGION' | 'ZONE' | 'TERRITORY'
  >('BRANCH')

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [gridPage] = useState(1) // Fixed page for grid view (lazy loading uses limit)
  const [gridLimit, setGridLimit] = useState(10) // Initial limit for grid view
  const [hasMore, setHasMore] = useState(true) // Track if more data is available
  const [isFetching, setIsFetching] = useState(false) // Prevent multiple API calls

  const [tablePagination, setTablePagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Selectors for vacancy management state
  const {
    vacancyGroupByDesignationLoading = false,
    vacancyGroupByDesignationData = null,
    vacancyGroupByDesignationFailure = false
  } = useAppSelector((state: RootState) => state.vacancyManagementReducer) as VacancyManagementState

  // Ref for the sentinel element in grid view
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Fetch vacancies grouped by designation
  useEffect(() => {
    const params: {
      page: number
      limit: number
      search?: string
      locationType: 'BRANCH' | 'CLUSTER' | 'AREA' | 'REGION' | 'ZONE' | 'TERRITORY'
    } = {
      page: viewMode === 'grid' ? gridPage : tablePagination.pageIndex + 1, // API expects 1-based page index
      limit: viewMode === 'grid' ? gridLimit : tablePagination.pageSize,
      locationType: selectedLocationType
    }

    if (searchDesignation) params.search = searchDesignation

    setIsFetching(true)
    dispatch(fetchVacanciesGroupByDesignation(params)).finally(() => {
      setIsFetching(false)

      if (vacancyGroupByDesignationData) {
        // setHasMore((vacancyGroupByDesignationData.data?.length || 0) < vacancyGroupByDesignationData?.totalCount)
        setHasMore((gridLimit || 0) <= vacancyGroupByDesignationData?.totalCount)
      }
    })
  }, [dispatch, searchDesignation, selectedLocationType, viewMode, gridPage, gridLimit, tablePagination])

  // Set up IntersectionObserver for lazy loading in grid view
  useEffect(() => {
    if (viewMode !== 'grid' || !hasMore || vacancyGroupByDesignationLoading || isFetching) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetching) {
          setGridLimit(prev => prev + 10) // Increase limit by 10
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current = observer

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [viewMode, hasMore, vacancyGroupByDesignationLoading, isFetching])

  const columnHelper = createColumnHelper<VacancyGroupByDesignationResponse>()

  const handleViewDetails = (designation: string) => {
    router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_REQUEST_DETAIL(designation))
    console.log(`Viewing details for designation: ${designation}`)
  }

  const filteredData = useMemo(() => {
    return vacancyGroupByDesignationData?.data || []
  }, [vacancyGroupByDesignationData])

  const columns = useMemo<ColumnDef<VacancyGroupByDesignationResponse, any>[]>(
    () => [
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designation}</Typography>
      }),
      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.department}</Typography>
      }),
      columnHelper.accessor(row => row[selectedLocationType.toLowerCase() as keyof VacancyGroupByDesignationResponse], {
        header: selectedLocationType,
        id: selectedLocationType.toLowerCase(),
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original[selectedLocationType.toLowerCase() as keyof VacancyGroupByDesignationResponse] || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('designationCount', {
        header: 'VACANCY COUNT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designationCount}</Typography>
      }),
      columnHelper.accessor('designation', {
        header: 'ACTION',
        id: 'action',
        cell: ({ row }) => (
          <Tooltip title='View Details'>
            <IconButton color='primary' onClick={() => handleViewDetails(row.original.designation)}>
              <VisibilityIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, selectedLocationType]
  )

  const handlePageChange = (newPage: number) => {
    setTablePagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setTablePagination({ pageIndex: 0, pageSize: newPageSize })
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f9fafb' }}>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          p: 4,
          mb: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: '30%' } }}>
            <TextField
              label='Search Designation'
              variant='outlined'
              size='small'
              value={searchDesignation}
              onChange={e => {
                setSearchDesignation(e.target.value)
                setGridLimit(10) // Reset grid limit on search
                setTablePagination(prev => ({ ...prev, pageIndex: 0 })) // Reset table page on search
              }}
              sx={{
                flex: 1,
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
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {locationTypes.map(type => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => {
                    setSelectedLocationType(type as typeof selectedLocationType)
                    setHasMore(true) // Reset hasMore to allow lazy loading
                    setGridLimit(10) // Reset grid limit on location change
                    setTablePagination(prev => ({ ...prev, pageIndex: 0 })) // Reset table page
                  }}
                  color={selectedLocationType === type ? 'primary' : 'default'}
                  sx={{
                    fontSize: '0.75rem',
                    height: '24px',

                    // padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: selectedLocationType === type ? 600 : 400,
                    bgcolor: selectedLocationType === type ? '#1976d2' : '#e0e0e0',
                    color: selectedLocationType === type ? '#fff' : '#333',
                    boxShadow: selectedLocationType === type ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
                    '&:hover': {
                      bgcolor: selectedLocationType === type ? '#1565c0' : '#d5d5d5',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                />
              ))}
            </Box>
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
      </Box>

      {vacancyGroupByDesignationFailure ? (
        <Box sx={{ textAlign: 'center', mt: 4, color: '#757575' }}>
          <Typography variant='h6'>No Data Available</Typography>
        </Box>
      ) : vacancyGroupByDesignationLoading && filteredData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : viewMode === 'grid' ? (
        <>
          <Grid container spacing={3}>
            {filteredData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                    },
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant='h6'
                      sx={{ fontWeight: 600, color: '#333', mb: 1, textTransform: 'capitalize' }}
                    >
                      {item.designation}
                    </Typography>
                    <Typography variant='body2' sx={{ color: '#757575', mb: 1 }}>
                      <strong>Department:</strong> {item.department}
                    </Typography>
                    <Typography variant='body2' sx={{ color: '#757575', mb: 1, textTransform: 'capitalize' }}>
                      <strong>{selectedLocationType.toLowerCase()}:</strong>{' '}
                      {item[selectedLocationType.toLowerCase() as keyof VacancyGroupByDesignationResponse] || '-'}
                    </Typography>
                    <Typography variant='body2' sx={{ color: '#757575' }}>
                      <strong>Vacancy Count:</strong> {item.designationCount}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, bgcolor: '#fafafa' }}>
                    <Button
                      size='small'
                      color='primary'
                      variant='outlined'
                      onClick={() => handleViewDetails(item.designation)}
                      startIcon={<VisibilityIcon />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#e3f2fd' }
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {hasMore && (
            <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', mt: 4, height: '40px' }}>
              {vacancyGroupByDesignationLoading && <CircularProgress size={24} />}
            </Box>
          )}
        </>
      ) : (
        <DynamicTable
          columns={columns}
          data={filteredData}
          totalCount={vacancyGroupByDesignationData?.totalCount}
          pagination={tablePagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Vacancy Groups'
          loading={vacancyGroupByDesignationLoading}
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      )}
    </Box>
  )
}

export default VacancyGroupListing
