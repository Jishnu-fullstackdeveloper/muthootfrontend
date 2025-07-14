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
  TextField
} from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import Tooltip from '@mui/material/Tooltip'

import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJd, fetchJdDismiss } from '@/redux/jdManagemenet/jdManagemnetSlice'
import DynamicButton from '@/components/Button/dynamicButton'
import JobListingTableView from './JobListingTable'
import { ROUTES } from '@/utils/routes'
import EditIcon from '@/icons/EditIcon'

// interface JobRole {
//   id: string
//   jobRoleId: string
//   approvalStatus: string
//   details: {
//     roleSpecification: Array<{
//       roleTitle: string
//       companyName: string
//       functionOrDepartment: string
//       reportsTo: string
//       dateWritten: string
//     }>
//   }
//   createdAt: string
// }

const JobRoleList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { jdData, totalCount, isJdLoading, jdSuccess, jdFailure, jdFailureMessage } = useAppSelector(
    state => state.jdManagementReducer
  )

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')

  const [searchQuery, setSearchQuery] = useState('') // State for search query

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
    display_numbers_count: Math.ceil(totalCount / 10) || 1
  })

  // const [selectedFilters, setSelectedFilters] = useState({
  //   jobType: [],
  //   experience: [],
  //   education: [],
  //   skills: [],
  //   salaryRange: [0, 0],
  //   jobRole: ''
  // })

  // const [appliedFilters, setAppliedFilters] = useState({
  //   jobType: [],
  //   experience: [],
  //   education: [],
  //   skills: [],
  //   salaryRange: [0, 0],
  //   jobRole: ''
  // })

  // Fetch job roles with pagination and search query
  useEffect(() => {
    dispatch(
      fetchJd({
        page: paginationState.page,
        limit: paginationState.limit,
        search: searchQuery // Pass search query to backend
      })
    )
  }, [dispatch, paginationState.page, paginationState.limit, searchQuery])

  // Update pagination count when totalCount changes
  useEffect(() => {
    setPaginationState(prev => ({
      ...prev,
      display_numbers_count: Math.ceil(totalCount / prev.limit) || 1
    }))
  }, [totalCount])

  const handleDismiss = () => {
    dispatch(fetchJdDismiss())
  }

  // const handleResetFilters = () => {
  //   setSelectedFilters({
  //     jobType: [],
  //     experience: [],
  //     education: [],
  //     skills: [],
  //     salaryRange: [0, 0],
  //     jobRole: ''
  //   })
  //   setSearchQuery('') // Reset search query
  // }

  const handlePageChange = (event: any, value: number) => {
    setPaginationState(prev => ({ ...prev, page: value }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChangeLimit = (value: number) => {
    setPaginationState(prev => ({ ...prev, limit: value, page: 1 }))
  }

  // const CheckAllFiltersEmpty = (filters: typeof selectedFilters) => {
  //   return Object.entries(filters).every(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       return key === 'salaryRange' ? value[0] === 0 && value[1] === 0 : value.length === 0
  //     }

  //     if (typeof value === 'string') {
  //       return value.trim() === ''
  //     }

  //     if (typeof value === 'object' && value !== null) {
  //       return Object.keys(value).length === 0
  //     }

  //     return !value
  //   })
  // }

  // const removeSelectedFilterItem = (category: string, value: any) => {
  //   setSelectedFilters(prev => {
  //     if (category === 'jobRole') {
  //       return { ...prev, jobRole: '' }
  //     } else if (Array.isArray(prev[category])) {
  //       return {
  //         ...prev,
  //         [category]: prev[category].filter(item => item !== value)
  //       }
  //     }

  //     return prev
  //   })
  // }

  // const toggleFilter = (filterType: string, filterValue: any) => {
  //   setAppliedFilters(prev => {
  //     if (filterType === 'salaryRange') {
  //       return {
  //         ...prev,
  //         salaryRange:
  //           prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1] ? [0, 0] : filterValue
  //       }
  //     } else if (filterType === 'jobRole') {
  //       return {
  //         ...prev,
  //         jobRole: prev.jobRole === filterValue ? '' : filterValue
  //       }
  //     } else {
  //       return {
  //         ...prev,
  //         [filterType]: prev[filterType]?.includes(filterValue)
  //           ? prev[filterType].filter(item => item !== filterValue)
  //           : [...(prev[filterType] || []), filterValue]
  //       }
  //     }
  //   })
  // }

  

  return (
    <div className='min-h-screen'>
      {/* <JobListingCustomFilters
        open={addMoreFilters}
        setOpen={setAddMoreFilters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setAppliedFilters={setAppliedFilters}
        handleResetFilters={handleResetFilters}
      /> */}
      {/* <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(false)}
        onUpload={file => {
          if (file) {
            console.log('File uploaded:', file)
          }
        }}
      /> */}
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
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <Box sx={{ display: 'flex', gap: 2 , width:'420px'}}>
              <TextField sx={{ width: '420px' }}
                size='small'
                placeholder='Search JD...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
                  endAdornment: searchQuery && (
                    <IconButton size='small' onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>

            {/* <Box sx={{ mt: 5 }}>
              <DynamicButton
                label='Add more filters'
                variant='tonal'
                icon={<i className='tabler-plus' />}
                position='start'
                children='Add more filters'
                onClick={() => setAddMoreFilters(true)}
              />
            </Box> */}
            {/* <Box
              sx={{ mt: 5, cursor: CheckAllFiltersEmpty(selectedFilters) && !searchQuery ? 'not-allowed' : 'pointer' }}
            >
              <DynamicButton
                label='Reset Filters'
                variant='outlined'
                icon={<RestartAlt />}
                position='start'
                onClick={handleResetFilters}
                children='Reset Filters'
                disabled={CheckAllFiltersEmpty(selectedFilters) && !searchQuery}
              />
            </Box> */}
          </div>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='New JD'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push('/jd-management/add/jd')}
              children='New JD'
            />
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                backgroundColor: '#f5f5f5',
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
        </div>
        <Box>
          {/* <Stack direction='row' spacing={1} ml={5}>
            {(!CheckAllFiltersEmpty(selectedFilters) || searchQuery) && (
              <Typography component='h3' color='black'>
                Filters
              </Typography>
            )}
          </Stack> */}
          {/* <Stack direction='row' spacing={1} ml={5}>
            <Box
              sx={{
                overflow: 'hidden',
                maxWidth: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 1
              }}
            >
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  variant='outlined'
                  color='primary'
                  onDelete={() => setSearchQuery('')}
                />
              )}
              {selectedFilters.experience.map(exp => (
                <Chip
                  key={exp}
                  label={exp}
                  variant='outlined'
                  color={appliedFilters.experience.includes(exp) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('experience', exp)}
                  onDelete={() => removeSelectedFilterItem('experience', exp)}
                />
              ))}
              {selectedFilters.education.map(edu => (
                <Chip
                  key={edu}
                  label={edu}
                  variant='outlined'
                  color={appliedFilters.education.includes(edu) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('education', edu)}
                  onDelete={() => removeSelectedFilterItem('education', edu)}
                />
              ))}
              {selectedFilters.jobType.map(type => (
                <Chip
                  key={type}
                  label={type}
                  variant='outlined'
                  color={appliedFilters.jobType.includes(type) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('jobType', type)}
                  onDelete={() => removeSelectedFilterItem('jobType', type)}
                />
              ))}
              {selectedFilters.skills.map(skill => (
                <Chip
                  key={skill}
                  label={skill}
                  variant='outlined'
                  color={appliedFilters.skills.includes(skill) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('skills', skill)}
                  onDelete={() => removeSelectedFilterItem('skills', skill)}
                />
              ))}
              {selectedFilters?.salaryRange[0] !== 0 || selectedFilters?.salaryRange[1] !== 0 ? (
                <Chip
                  key='salary-range'
                  label={`${selectedFilters.salaryRange[0]} - ${selectedFilters.salaryRange[1]}`}
                  variant='outlined'
                  color={
                    appliedFilters.salaryRange?.[0] !== 0 || appliedFilters.salaryRange?.[1] !== 0
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => toggleFilter('salaryRange', selectedFilters?.salaryRange)}
                  onDelete={() => {
                    setSelectedFilters({
                      ...selectedFilters,
                      salaryRange: [0, 0]
                    })
                  }}
                />
              ) : null}
              {selectedFilters?.jobRole && (
                <Chip
                  key='job-role'
                  label={selectedFilters?.jobRole}
                  variant='outlined'
                  color={appliedFilters?.jobRole === selectedFilters?.jobRole ? 'primary' : 'default'}
                  onClick={() => toggleFilter('jobRole', selectedFilters?.jobRole)}
                  onDelete={() => removeSelectedFilterItem('jobRole', '')}
                />
              )}
            </Box>
          </Stack> */}
        </Box>
      </Card>
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-5' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          jdSuccess &&
          jdData.length > 0 &&
          jdData.map(jobRole => (
            <Box
              key={jobRole.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 border border-gray-200'
              sx={{ cursor: 'pointer', minHeight: '150px' }}
            >
              <Box className='flex justify-between items-center p-4 border-b border-gray-200'>
                <Typography variant='h6' fontWeight='bold' color='#23262F'>
                  {jobRole.details.roleSpecification[0]?.roleTitle.toUpperCase() || 'N/A'}
                </Typography>
                <IconButton
                  sx={{ ':hover': { color: 'error.main' } }}
                  onClick={() => router.push(ROUTES.JD_EDIT(jobRole.id))}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Box className='p-4 grid grid-cols-2 gap-4'>
                <Box className='flex flex-col gap-2'>
                  <Typography sx={{ fontSize: '12px', fontWeight: '400px', color: '#5E6E78' }}>Reports To</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}>
                    {jobRole.details.roleSpecification[0]?.reportsTo || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: '400px', color: '#5E6E78' }}>
                    Function/Department:
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}>
                    {jobRole.details.roleSpecification[0]?.functionOrDepartment || 'N/A'}
                  </Typography>
                </Box>
                <Box className='flex flex-col gap-2'>
                  <Typography sx={{ fontSize: '12px', fontWeight: '400px', color: '#5E6E78' }}>Department:</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}>
                    {jobRole.details.roleSpecification[0]?.companyName || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: '400px', color: '#5E6E78' }}>
                    Date Written:
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}>
                    {jobRole.details.roleSpecification[0]?.dateWritten
                      ? new Date(jobRole.details.roleSpecification[0].dateWritten).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
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
                  margin: '10px'
                }}
                onClick={() => router.push(ROUTES.JD_VIEW(jobRole.id))}
              >
                <Typography sx={{ color: '#0096DA' }}>View Details</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <JobListingTableView jobs={jdData} />
        )}
      </div>
      {viewMode !== 'table' && (
        <div className='flex items-center justify-end mt-6'>
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
        </div>
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
    </div>
  )
}

export default JobRoleList
