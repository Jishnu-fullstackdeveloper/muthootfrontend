'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,

  // Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  Button

  // Stack
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import Pagination from '@mui/material/Pagination'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CustomTextField from '@/@core/components/mui/TextField'
import BranchListingTableView from './BranchListingTableView'
import { getBranchList } from '@/redux/BranchManagement/BranchManagementSlice'
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

  // Use optional chaining and provide defaults to handle undefined state
  const {
    branchListData,
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

  if (branchListLoading) return <Box>Loading branches...</Box>
  if (branchListFailure) return <Box>Error: {branchListFailureMessage}</Box>

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
              gap: 4,
              flexWrap: 'wrap'
            }}
          >
            <CustomTextField
              label='Search Branch'
              placeholder='Search by Branch Name or Code...'
              sx={{ width: { xs: '100%', sm: '400px' } }}
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
          </Box>

          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mt: { xs: 4, md: 0 } }}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<AssessmentIcon />}
              onClick={() => router.push('/branch-management/budget-report')}
              sx={{ mr: 2 }}
            >
              Branch Report Dashboard
            </Button>
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
              <Tooltip title='Table View'>
                <IconButton color={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {(viewMode === 'grid' || viewMode === 'list') && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr' },
            gap: 6,
            ...(viewMode !== 'grid' && { '& > * + *': { mt: 6 } }) // Space between items in list view
          }}
        >
          {(branchListData?.data || []).map(branch => (
            <Box
              onClick={() => handleBranchClick(branch)}
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
                cursor: 'pointer',
                minHeight: viewMode !== 'grid' ? '150px' : 'auto',
                p: viewMode !== 'grid' ? 6 : 0
              }}
            >
              {viewMode === 'grid' ? (
                <>
                  <Box
                    sx={{ pt: 2, pl: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ mt: 1, fontWeight: 'bold' }} gutterBottom>
                        {branch.name}
                      </Typography>
                    </Box>
                    {/* <Box sx={{ display: 'flex', mr: 10 }}>
                      <Stack sx={{ mt: 2 }}>
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

                            // fontSize: '0.85rem',
                            textTransform: 'uppercase'
                          }}
                        />
                      </Stack>
                    </Box> */}
                  </Box>
                  <Box
                    sx={{
                      p: 4,
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
                        gap: 1,
                        color: 'text.secondary',
                        fontSize: '0.575rem'
                      }}
                    >
                      <Typography>
                        <strong>Branch Code:</strong> {branch.branchCode}
                      </Typography>
                      <Typography>
                        <strong>Territory:</strong> {branch.area.regionId}
                      </Typography>
                      <Typography>
                        <strong>Zonal:</strong> {branch.area.name}
                      </Typography>
                      <Typography>
                        <strong>Region:</strong> {branch.area.regionId}
                      </Typography>
                      <Typography>
                        <strong>Area:</strong> {branch.area.name}
                      </Typography>
                      <Typography>
                        <strong>Cluster:</strong> {branch.bucket?.name}
                      </Typography>
                      <Typography>
                        <strong>City Classification:</strong> {branch.district?.name}
                      </Typography>
                      <Typography>
                        <strong>State:</strong> {branch.state?.name}
                      </Typography>
                    </Box>
                    {/* <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        color: 'text.secondary'

                        // fontSize: '0.275rem'
                      }}
                    >
                      <Typography>
                        <strong>Area:</strong> {branch.area.name}
                      </Typography>
                      <Typography>
                        <strong>Cluster:</strong> {branch.bucket?.name}
                      </Typography>
                      <Typography>
                        <strong>City Classification:</strong> {branch.district?.name}
                      </Typography>
                      <Typography>
                        <strong>State:</strong> {branch.state?.name}
                      </Typography>
                    </Box> */}
                  </Box>
                </>
              ) : (
                <Grid container spacing={4}>
                  {/* <Grid item xs={12} md={6}> */}
                  <Typography className='text-[12px]' sx={{ fontWeight: 'bold' }}>
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
                  {/* </Grid> */}
                  {/* <Grid item xs={12} md={6}> */}
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
                  {/* </Grid> */}
                </Grid>
              )}
            </Box>
          ))}
        </Box>
      )}
      {viewMode === 'table' && <BranchListingTableView branchData={branchListData?.data || []} />}
      {viewMode !== 'table' && (
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
      )}
    </Box>
  )
}

export default BranchListing
