'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Tooltip
} from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CustomTextField from '@/@core/components/mui/TextField'
import BranchListingTableView from './BranchListingTableView'
import { getBranchList } from '@/redux/BranchManagementSlice'
import type { RootState } from '@/redux/store'
import type { Branch, BranchManagementState } from '@/types/branch'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BranchListResponse } from '@/types/branch'

const BranchListing = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, display_numbers_count: 5 })

  // Memoize branch tabs for performance, removing unused `selectedTabs`
  // const branchTabs = useMemo(() => {
  //   return (branchListData || []).reduce((acc, branch) => ({ ...acc, [branch.id]: 0 }), {} as Record<string, number>)
  // }, [branchListData])

  // Use optional chaining and provide defaults to handle undefined state
  const {
    branchListData = [],
    branchListLoading = false,
    branchListTotal,
    branchListFailure = false,
    branchListFailureMessage = ''
  } = useAppSelector((state: RootState) => state.branchManagementReducer) as BranchManagementState

  useEffect(() => {
    dispatch(
      getBranchList({ search: searchQuery, page: pagination.page, limit: pagination.limit }) // branchStatus: 'ACTIVE'
    )
  }, [dispatch, searchQuery, pagination.page, pagination.limit])

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
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => handlePaginationChange('page', value)
  const handleChangeLimit = (value: number) => handlePaginationChange('limit', value)

  const handleBranchClick = (branch: Branch) => router.push(`/branch-management/view/employees-details?id=${branch.id}`)

  if (branchListLoading) return <div>Loading branches...</div>
  if (branchListFailure) return <div>Error: {branchListFailureMessage}</div>

  return (
    <div className=''>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <CustomTextField
              label='Search Branch'
              placeholder='Search by Branch Name or Code...'
              className='is-full sm:is-[400px]'
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            {/* <Button
              className='mr-2'
              variant='contained'
              color='primary'
              startIcon={<AssessmentIcon />}
              onClick={() => router.push('/branch-management/budget-report')}
            >
              Branch Report Dashboard
            </Button> */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip> */}
              <Tooltip title='Table View'>
                <IconButton color={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Card>

      {(viewMode === 'grid' || viewMode === 'list') && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}>
          {(branchListData || []).map(branch => (
            <Box
              onClick={() => handleBranchClick(branch)}
              key={branch.id}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 ${
                viewMode !== 'grid' && 'p-6'
              }`}
              sx={{
                cursor: 'pointer',
                minHeight: viewMode !== 'grid' ? '150px' : 'auto'
              }}
            >
              {viewMode === 'grid' ? (
                <>
                  <Box className='pt-4 pl-4 pb-3 flex justify-between items-center'>
                    <div className='flex items-center'>
                      <Typography variant='h5' mt={2} fontWeight='bold' gutterBottom>
                        {branch.name}
                      </Typography>
                    </div>
                    <div className='flex space-x-2 mr-10'>
                      <Stack sx={{ marginTop: 2 }}>
                        <Chip
                          label={branch.branchStatus}
                          color={
                            branch.branchStatus === 'ACTIVE'
                              ? 'success'
                              : branch.branchStatus === 'INACTIVE'
                                ? 'default'
                                : 'warning'
                          }
                          size='small'
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase'
                          }}
                        />
                      </Stack>
                    </div>
                  </Box>
                  <Box className='p-4 border-t flex justify-between'>
                    <Box className='space-y-2 text-sm text-gray-700'>
                      <p>
                        <strong>Branch Code:</strong> {branch.branchCode}
                      </p>
                      <p>
                        <strong>Territory:</strong> {branch.area.regionId}{' '}
                        {/* Using area.regionId as a proxy for territory */}
                      </p>
                      <p>
                        <strong>Zonal:</strong> {branch.area.name} {/* Using area.name as a proxy for zonal */}
                      </p>
                      <p>
                        <strong>Region:</strong> {branch.area.regionId}{' '}
                        {/* Using area.regionId as a proxy for region */}
                      </p>
                    </Box>
                    <Box className='space-y-2 text-sm text-gray-700'>
                      <p>
                        <strong>Area:</strong> {branch.area.name}
                      </p>
                      <p>
                        <strong>Cluster:</strong> {branch.bucket?.name} {/* Using bucket.name as a proxy for cluster */}
                      </p>
                      <p>
                        <strong>City Classification:</strong> {branch.district?.name}{' '}
                        {/* Using district.name as a proxy for city classification */}
                      </p>
                      <p>
                        <strong>State:</strong> {branch.state?.name}
                      </p>
                    </Box>
                  </Box>
                </>
              ) : (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant='h5' fontWeight='bold'>
                      {branch.name}
                    </Typography>
                    <Typography>
                      <strong>Branch Code:</strong> {branch.branchCode}
                    </Typography>
                    <Typography>
                      <strong>Territory:</strong> {branch.area.regionId}
                    </Typography>
                    <Typography>
                      <strong>Zonal:</strong> {branch.area.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Region:</strong> {branch.area.regionId}
                    </Typography>
                    <Typography>
                      <strong>Area:</strong> {branch.area.name}
                    </Typography>
                    <Typography>
                      <strong>Cluster:</strong> {branch.bucket.name}
                    </Typography>
                    <Typography>
                      <strong>City Classification:</strong> {branch.district.name}
                    </Typography>
                    <Typography>
                      <strong>State:</strong> {branch.state.name}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
        </div>
      )}
      {viewMode === 'table' && <BranchListingTableView branchData={branchListData || []} />}
      {viewMode !== 'table' && (
        <div className='flex items-center justify-end mt-6'>
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
          {branchListTotal}
          <Pagination
            color='primary'
            shape='rounded'
            showFirstButton
            showLastButton
            count={Math.ceil(branchListTotal / pagination.limit)}
            page={pagination.page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default BranchListing
