'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Card,
  Typography,
  CircularProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
  IconButton,
  TextField,
  Chip,
  Tooltip
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJd, fetchJdDismiss } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicButton from '@/components/Button/dynamicButton'
import JobListingTableView from './JobListingTable'
import { ROUTES } from '@/utils/routes'
import EditIcon from '@/icons/EditIcon'
import JDIcon from '@/icons/JdIcon'

const JobRoleList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { jdData, totalCount, isJdLoading, jdSuccess, jdFailure, jdFailureMessage } = useAppSelector(
    state => state.jdManagementReducer
  )

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
    display_numbers_count: Math.ceil(totalCount / 10) || 1
  })

  useEffect(() => {
    dispatch(
      fetchJd({
        page: paginationState.page,
        limit: paginationState.limit,
        search: searchQuery
      })
    )
  }, [dispatch, paginationState.page, paginationState.limit, searchQuery])

  useEffect(() => {
    setPaginationState(prev => ({
      ...prev,
      display_numbers_count: Math.ceil(totalCount / prev.limit) || 1
    }))
  }, [totalCount])

  const handleDismiss = () => {
    dispatch(fetchJdDismiss())
  }

  const handlePageChange = (event: any, value: number) => {
    setPaginationState(prev => ({ ...prev, page: value }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChangeLimit = (value: number) => {
    setPaginationState(prev => ({ ...prev, limit: value, page: 1 }))
  }

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
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
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4'>
          <Box
            sx={{ display: 'flex', flex: { xs: '1 1 100%', sm: '0 0 auto' }, maxWidth: { xs: '100%', sm: '420px' } }}
          >
            <TextField
              size='small'
              placeholder='Search JD...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label='Search job descriptions'
              sx={{ width: '100%', minWidth: '200px' }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
                endAdornment: searchQuery && (
                  <IconButton size='small' onClick={() => setSearchQuery('')} aria-label='Clear search'>
                    <ClearIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'start', md: 'end' }, alignItems: 'center' }}>
            <DynamicButton
              label='New JD'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push('/jd-management/add/jd')}
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              New JD
            </DynamicButton>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                padding: '4px',

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
                  aria-label='Switch to grid view'
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  aria-label='Switch to table view'
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Card>
      {viewMode === 'grid' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {jdSuccess &&
            jdData.length > 0 &&
            jdData.map(jobRole => (
              <Card
                key={jobRole.id}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <JDIcon />
                    <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#23262F' }}>
                      {jobRole.details.roleSpecification?.jobRole?.toUpperCase() || 'N/A'}
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{ ':hover': { color: 'error.main' } }}
                    onClick={() => router.push(ROUTES.JD_EDIT(jobRole.id))}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <Box sx={{ p: 3, flex: 1 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78' }}>Experience:</Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 2 }}>
                        {jobRole.details.educationAndExperience?.[0]?.experienceDescription
                          ? `${jobRole.details.educationAndExperience[0].experienceDescription.min} - ${jobRole.details.educationAndExperience[0].experienceDescription.max} years`
                          : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78', mt: 1 }}>
                        Education:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 2 }}>
                        {jobRole.details.educationAndExperience?.[0]?.minimumQualification
                          ? toTitleCase(jobRole.details.educationAndExperience[0].minimumQualification)
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78' }}>
                        Company Name:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 2 }}>
                        {jobRole.details.roleSpecification?.companyName
                          ? toTitleCase(jobRole.details.roleSpecification.companyName.replace(/_/g, ' '))
                          : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#5E6E78', mt: 1 }}>
                        Job Type:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'black', mt: 2 }}>
                        {jobRole.details.roleSpecification?.jobType
                          ? toTitleCase(jobRole.details.roleSpecification.jobType)
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1, mt: 4 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: '40px', mt: 2 }}>
                    {jobRole.details.skills?.length > 0 ? (
                      jobRole.details.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={toTitleCase(skill)}
                          sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        No skills listed
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    border: '1px solid #0096DA',
                    borderRadius: '4px',
                    padding: '10px',
                    margin: '10px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#D0F7E7'
                    }
                  }}
                  onClick={() => router.push(ROUTES.JD_VIEW(jobRole.id))}
                >
                  <Typography sx={{ color: '#0096DA' }}>View Details</Typography>
                </Box>
              </Card>
            ))}
        </Box>
      ) : (
        <JobListingTableView
          jobs={jdData}
          totalCount={totalCount}
          pagination={{
            pageIndex: paginationState.page - 1, // Convert to 0-based index for table
            pageSize: paginationState.limit
          }}
          onPageChange={newPage => handlePageChange(null, newPage + 1)} // Convert back to 1-based index
          onRowsPerPageChange={handleChangeLimit}
        />
      )}
      {viewMode !== 'table' && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <FormControl size='small' sx={{ minWidth: 70 }}>
            <InputLabel>Count</InputLabel>
            <Select
              value={paginationState.limit}
              onChange={e => handleChangeLimit(Number(e.target.value))}
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
            count={paginationState.display_numbers_count}
            page={paginationState.page}
            onChange={handlePageChange}
          />
        </Box>
      )}
      {isJdLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {jdFailure && (
        <Alert severity='error' onClose={handleDismiss} sx={{ mb: 2 }}>
          {jdFailureMessage}
        </Alert>
      )}
      {jdSuccess && jdData.length === 0 && <Alert severity='info'>No job roles found.</Alert>}
      {!isJdLoading && !jdSuccess && !jdFailure && (
        <Alert severity='warning'>No data loaded. Check Redux state or API call.</Alert>
      )}
    </Box>
  )
}

export default JobRoleList
