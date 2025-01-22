'use client'
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
  Button,
  Tooltip
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import CustomTextField from '@/@core/components/mui/TextField'
import AssessmentIcon from '@mui/icons-material/Assessment'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'

const BranchListing = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTabs, setSelectedTabs] = useState<Record<number, number>>({})

  const branches = [
    {
      id: 1,
      name: 'Downtown Branch',
      branchCode: 'B001',
      territory: 'North',
      zonal: 'Zone1',
      region: 'Region1',
      area: 'Area1',
      cluster: 'Cluster1',
      cityClassification: 'Metro',
      state: 'California',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Market Square',
      branchCode: 'B002',
      territory: 'West',
      zonal: 'Zone2',
      region: 'Region2',
      area: 'Area2',
      cluster: 'Cluster2',
      cityClassification: 'Urban',
      state: 'Texas',
      status: 'Inactive'
    },
    {
      id: 3,
      name: 'Tech Hub',
      branchCode: 'B003',
      territory: 'East',
      zonal: 'Zone3',
      region: 'Region3',
      area: 'Area3',
      cluster: 'Cluster3',
      cityClassification: 'Rural',
      state: 'New York',
      status: 'Active'
    }
  ]

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
    display_numbers_count: 5
  })

  useEffect(() => {
    const initialTabsState = branches.reduce(
      (acc, branch) => {
        acc[branch.id] = 0 // Default to the 'Details' tab
        return acc
      },
      {} as Record<number, number>
    )
    setSelectedTabs(initialTabsState)
  }, [])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationState({ ...paginationState, page: value })
  }

  const handleChangeLimit = (value: any) => {
    setPaginationState({ ...paginationState, limit: value })
  }

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
              <Button
                className='mr-2'
                variant='contained'
                color='primary'
                startIcon={<AssessmentIcon />}
                onClick={() => router.push('/branch-management/budget-report')}
              >
                Budget Report Dashboard
              </Button>
              <Tooltip title='Grid View'>
                <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Card>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}>
        {branches?.map(branch => (
          <Box
            onClick={() => router.push(`/branch-management/view/${branch.id}`)}
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
                        label={branch.status}
                        color={
                          branch.status === 'Active' ? 'success' : branch.status === 'Inactive' ? 'default' : 'warning'
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
                      <strong>Territory:</strong> {branch.territory}
                    </p>
                    <p>
                      <strong>Zonal:</strong> {branch.zonal}
                    </p>
                    <p>
                      <strong>Region:</strong> {branch.region}
                    </p>
                  </Box>
                  <Box className='space-y-2 text-sm text-gray-700'>
                    <p>
                      <strong>Area:</strong> {branch.area}
                    </p>
                    <p>
                      <strong>Cluster:</strong> {branch.cluster}
                    </p>
                    <p>
                      <strong>City Classification:</strong> {branch.cityClassification}
                    </p>
                    <p>
                      <strong>State:</strong> {branch.state}
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
                    <strong>Territory:</strong> {branch.territory}
                  </Typography>
                  <Typography>
                    <strong>Zonal:</strong> {branch.zonal}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography>
                    <strong>Region:</strong> {branch.region}
                  </Typography>
                  <Typography>
                    <strong>Area:</strong> {branch.area}
                  </Typography>
                  <Typography>
                    <strong>Cluster:</strong> {branch.cluster}
                  </Typography>
                  <Typography>
                    <strong>City Classification:</strong> {branch.cityClassification}
                  </Typography>
                  <Typography>
                    <strong>State:</strong> {branch.state}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        ))}
      </div>

      <div className='flex items-center justify-end mt-6'>
        <FormControl size='small' sx={{ minWidth: 70 }}>
          <InputLabel>Count</InputLabel>
          <Select
            value={paginationState?.limit}
            onChange={e => handleChangeLimit(e.target.value)}
            label='Limit per page'
          >
            {[10, 25, 50, 100].map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Pagination
          color='primary'
          shape='rounded'
          showFirstButton
          showLastButton
          count={paginationState?.display_numbers_count}
          page={paginationState?.page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default BranchListing
