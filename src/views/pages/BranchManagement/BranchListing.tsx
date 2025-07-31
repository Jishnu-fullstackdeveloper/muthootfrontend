'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,

  // FormControl,
  Grid,
  IconButton,
  InputAdornment,

  // InputLabel,
  // MenuItem,
  // Select,
  Typography,
  Tooltip,
  Drawer,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  CircularProgress
} from '@mui/material'

// import Pagination from '@mui/material/Pagination'
//import GridViewIcon from '@mui/icons-material/GridView'
//import TableChartIcon from '@mui/icons-material/TableChart'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CustomTextField from '@/@core/components/mui/TextField'
import BranchListingTableView from './BranchListingTableView'
import { getBranchList } from '@/redux/BranchManagement/BranchManagementSlice'
import type { RootState } from '@/redux/store'
import type { Branch, BranchManagementState } from '@/types/branch'

//import GridIcon from '@/icons/GridAndTableIcons/Grid.svg'

import GridIcon from '@/icons/GridAndTableIcons/Grid'
import TableIcon from '@/icons/GridAndTableIcons/TableIcon'
import { ROUTES } from '@/utils/routes'

const BranchListing = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Filter options
  const filterOptions = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']

  // Use optional chaining and provide defaults to handle undefined state
  const {
    branchListData,
    branchListLoading = false,
    branchListTotal,
    branchListFailure = false

    //branchListFailureMessage = ''
  } = useAppSelector((state: RootState) => state.branchManagementReducer) as BranchManagementState

  // Fetch branches
  useEffect(() => {
    dispatch(
      getBranchList({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        bucketNames: selectedFilters.length > 0 ? selectedFilters : undefined
      })
    )
  }, [dispatch, searchQuery, pagination.page, pagination.limit, selectedFilters])

  // Lazy loading observer for grid view
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]

      if (
        target.isIntersecting &&
        !isLoadingMore &&
        viewMode === 'grid' &&
        branchListData?.data.length < branchListTotal
      ) {
        setIsLoadingMore(true)
        setPagination(prev => ({
          ...prev,
          limit: prev.limit + 10
        }))
      }
    },
    [isLoadingMore, viewMode, branchListData?.data?.length, branchListTotal]
  )

  useEffect(() => {
    if (viewMode === 'grid') {
      observer.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '20px',
        threshold: 0
      })
      if (loadMoreRef.current) observer.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [handleObserver, viewMode])

  useEffect(() => {
    if (!branchListLoading) {
      setIsLoadingMore(false)
    }
  }, [branchListLoading])

  // Consolidated pagination handler
  const handlePaginationChange = (key: 'page' | 'limit', value: number) => {
    setPagination(prev => ({
      ...prev,
      [key]: value,
      page: key === 'limit' ? 1 : prev.page // Reset page when limit changes
    }))
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    handlePaginationChange('page', 1) // Reset to first page on search

    if (viewMode === 'grid') {
      setPagination(prev => ({ ...prev, limit: 10 })) // Reset limit for grid view
    }
  }

  // const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => handlePaginationChange('page', value)
  // const handleChangeLimit = (value: number) => handlePaginationChange('limit', value)

  const handleBranchClick = (branch: Branch) => router.push(ROUTES.BRANCH_MANAGEMENT_VIEW(branch.id))

  // Drawer toggle
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  // Handle individual filter checkbox change
  const handleFilterChange = (filter: string) => {
    setSelectedFilters(prev => (prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]))
    handlePaginationChange('page', 1) // Reset to first page on filter change

    if (viewMode === 'grid') {
      setPagination(prev => ({ ...prev, limit: 10 })) // Reset limit for grid view
    }
  }

  // Handle Select All checkbox
  const handleSelectAll = () => {
    if (selectedFilters.length === filterOptions.length) {
      setSelectedFilters([])
    } else {
      setSelectedFilters([...filterOptions])
    }

    handlePaginationChange('page', 1) // Reset to first page on select all

    if (viewMode === 'grid') {
      setPagination(prev => ({ ...prev, limit: 10 })) // Reset limit for grid view
    }
  }

  return (
    <Box>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 40,
          zIndex: 10,
          backgroundColor: 'white'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-start' },
            p: 4,
            borderBottom: 1,
            borderColor: 'divider',
            gap: 4,
            overflowX: 'auto'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <CustomTextField
              placeholder='Search by Branch Name or Code...'
              sx={{ width: { xs: '100%', sm: '400px' } }}
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
            <Tooltip title='Filter Branches'>
              {/* <IconButton onClick={toggleDrawer}>
                <i className='tabler-filter text-xl' />
              </IconButton> */}
              <Button
                onClick={toggleDrawer}
                variant='outlined'
                color='secondary'
                startIcon={<i className='tabler-filter text-xl' />}
              >
                Filter
              </Button>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'

              // '&:hover': {
              //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
              // }
            }}
          >
            <Tooltip title='Grid View'>
              <IconButton
                className='hover:bg-[primary]'
                onClick={() => setViewMode('grid')}
                sx={{
                  p: 2.7,
                  borderRadius: 1,
                  color: viewMode === 'grid' ? '#FFFFFF' : undefined, // White color when active
                  bgcolor: viewMode === 'grid' ? 'primary.main' : undefined // Blue background when active
                }}
              >
                <GridIcon
                  className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-gray-500'} hover:text-gray-500`}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Table View'>
              <IconButton
                className='hover:bg-[primary]'
                onClick={() => setViewMode('table')}
                sx={{
                  p: 2.7,
                  borderRadius: 1,
                  color: viewMode === 'table' ? '#FFFFFF' : undefined, // White color when active
                  bgcolor: viewMode === 'table' ? 'primary.main' : undefined // Blue background when active
                }}
              >
                <TableIcon
                  className={`w-4 h-4 ${viewMode === 'table' ? 'text-white' : 'text-gray-500'} hover:text-white`}
                />{' '}
                {/* Updated hover:text-white */}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 300 },
            p: 4
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Filter by Bucket</Typography>
          <IconButton onClick={toggleDrawer}>
            <i className='tabler-x' />
          </IconButton>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFilters.length === filterOptions.length}
                onChange={handleSelectAll}
                indeterminate={selectedFilters.length > 0 && selectedFilters.length < filterOptions.length}
              />
            }
            label='Select All'
          />
          {filterOptions.map(filter => (
            <FormControlLabel
              key={filter}
              control={
                <Checkbox checked={selectedFilters.includes(filter)} onChange={() => handleFilterChange(filter)} />
              }
              label={filter}
            />
          ))}
        </FormGroup>
        <Button variant='contained' color='primary' onClick={toggleDrawer} sx={{ mt: 4, width: '100%' }}>
          Apply Filters
        </Button>
      </Drawer>

      {branchListFailure ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>No Branch Data Found</Box>
      ) : (
        <>
          {(viewMode === 'grid' || viewMode === 'list') && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr' },
                gap: 4,
                ...(viewMode !== 'grid' && { '& > * + *': { mt: 6 } }) // Space between items in list view
              }}
            >
              {branchListLoading && !branchListData?.data.length ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                (branchListData?.data || []).map(branch => (
                  <Box
                    key={branch.id}
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)'
                      },

                      minHeight: viewMode !== 'grid' ? '150px' : 'auto',
                      p: 3

                      //p: viewMode !== 'grid' ? 6 : 0
                    }}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Typography
                              variant='subtitle2'
                              sx={{ mt: 1, fontWeight: 'bold', color: '#23262F' }}
                              gutterBottom
                            >
                              {branch.name}
                            </Typography>
                            <Typography>
                              Branch Code: <strong>{branch?.branchCode}</strong>
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            borderTop: 1,
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              color: 'text.secondary',
                              fontSize: '0.575rem',
                              mt: 2
                            }}
                            className='grid grid-cols-2 gap-x-24'
                          >
                            <Typography variant='body1'>
                              Bucket Name <br />
                              <strong>{branch?.bucketName}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              Territory
                              <br />
                              <strong>{branch.cluster?.area?.region?.zone?.territory?.name || 'TERRITORY-1'}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              Zonal
                              <br />
                              <strong>{branch.cluster?.area?.region?.zone?.name || 'KERALA SOUTH'}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              Region
                              <br />
                              <strong>{branch.cluster?.area?.region?.name || 'KOLLAM'}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              Area
                              <br />
                              <strong>{branch?.cluster?.area?.name || 'KOTTARAKKARA'}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              Cluster
                              <br />
                              <strong>{branch.cluster?.name || 'KOTTARAKKARA'}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              City Classification
                              <br />
                              <strong>{branch.district?.name || 'THRISSUR'}</strong>
                            </Typography>
                            <Typography variant='body1'>
                              State
                              <br />
                              <strong>{branch.state?.name || 'KERALA'}</strong>
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            pt: 2,

                            //borderTop: '1px solid',

                            //borderColor: 'divider',
                            textAlign: 'center'
                          }}
                        >
                          <Button
                            variant='outlined'
                            color='primary'
                            sx={{ width: '100%' }}
                            onClick={() => handleBranchClick(branch)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Grid container spacing={4}>
                        <Typography className='text-[12px]' sx={{ fontWeight: 'bold' }}>
                          {branch.name}
                        </Typography>
                        <Typography>
                          <strong>Branch Code:</strong> {branch?.branchCode}
                        </Typography>
                        <Typography>
                          <strong>Territory:</strong> {branch.cluster?.area?.region?.zone?.territory?.name}
                        </Typography>
                        <Typography>
                          <strong>Zonal:</strong> {branch.cluster?.area?.region?.zone?.name}
                        </Typography>
                        <Typography>
                          <strong>Region:</strong> {branch.cluster?.area?.region?.name}
                        </Typography>
                        <Typography>
                          <strong>Area:</strong> {branch?.cluster?.area?.name}
                        </Typography>
                        <Typography>
                          <strong>Cluster:</strong> {branch.cluster?.name}
                        </Typography>
                        <Typography>
                          <strong>City Classification:</strong> {branch?.district?.name}
                        </Typography>
                        <Typography>
                          <strong>State:</strong> {branch.state.name}
                        </Typography>
                      </Grid>
                    )}
                  </Box>
                ))
              )}
              {viewMode === 'grid' && (
                <Box ref={loadMoreRef} sx={{ height: 20, textAlign: 'center' }}>
                  {isLoadingMore && <CircularProgress size={24} />}
                </Box>
              )}
            </Box>
          )}

          {viewMode === 'table' && <BranchListingTableView branchData={branchListData} />}
          {/* {(viewMode === 'list' || viewMode === 'table') && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 6, gap: 2 }}>
              <FormControl size='small' sx={{ minWidth: 70 }}>
                <InputLabel>Count</InputLabel>
                <Select
                  value={pagination.limit}
                  onChange={e => handleChangeLimit(Number(e.target.value))}
                  label='Limit per page'
                >
                  {[5, 10, 25, 50, 100].map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography>{branchListTotal}</Typography>
              <Pagination
                color='primary'
                shape='rounded'
                showFirstButton
                showLastButton
                count={Math.ceil(branchListTotal / pagination.limit)}
                page={pagination.page}
                onChange={handlePageChange}
              />
            </Box>
          )} */}
        </>
      )}
    </Box>
  )
}

export default BranchListing
