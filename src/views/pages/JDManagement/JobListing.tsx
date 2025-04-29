'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography
} from '@mui/material'

import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

import type { TextFieldProps } from '@mui/material/TextField'

import GridViewIcon from '@mui/icons-material/GridView'

import { RestartAlt } from '@mui/icons-material'

import TableChartIcon from '@mui/icons-material/TableChart'

import CustomTextField from '@/@core/components/mui/TextField'

import DynamicButton from '@/components/Button/dynamicButton'
import JobListingCustomFilters from '@/@core/components/dialogs/job-listing-filters'

import {
  getJDManagementFiltersFromCookie,
  removeJDManagementFiltersFromCookie,
  setJDManagementFiltersToCookie
} from '@/utils/functions'
import FileUploadDialog from '@/components/Dialog/jdFileUploadDialog'

import JobListingTableView from './JobListingTable'
import { jobs } from '@/utils/sampleData/JobListingData'

const JobListing = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [addMoreFilters, setAddMoreFilters] = useState<any>(false)
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState<any>(false)
  const FiltersFromCookie = getJDManagementFiltersFromCookie()

  const [selectedFilters, setSelectedFilters] = useState({
    jobType: [],
    experience: [],
    education: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const [appliedFilters, setAppliedFilters] = useState({
    jobType: [],
    experience: [],
    education: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  useEffect(() => {
    if (FiltersFromCookie?.selectedFilters) {
      setSelectedFilters(FiltersFromCookie?.selectedFilters)
    }

    if (FiltersFromCookie?.appliedFilters) {
      setAppliedFilters(FiltersFromCookie?.appliedFilters)
    }
  }, [])

  const handleResetFilters = () => {
    setSelectedFilters({
      jobType: [],
      experience: [],
      education: [],
      skills: [],
      salaryRange: [0, 0],
      jobRole: ''
    })
    removeJDManagementFiltersFromCookie()
  }

  useEffect(() => {
    setJDManagementFiltersToCookie({
      selectedFilters,
      appliedFilters
    })
  }, [selectedFilters, appliedFilters])

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
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
    }, [debounce, onChange, value])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
    display_numbers_count: 5
  })

  const handlePageChange = (event: any, value: any) => {
    setPaginationState(prev => ({ ...prev, page: value }))
  }

  const handleChangeLimit = (value: any) => {
    setPaginationState(prev => ({ ...prev, limit: value }))
  }

  const CheckAllFiltersEmpty = (filters: any): boolean => {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) {
        return key === 'salaryRange' ? value[0] === 0 && value[1] === 0 : value.length === 0
      }

      if (typeof value === 'string') {
        return value.trim() === ''
      }

      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length === 0
      }

      return !value
    })
  }

  const removeSelectedFilterItem = (category: any, value: string) => {
    setSelectedFilters((prev: any) => {
      if (category === 'jobRole') {
        setSelectedFilters({ ...selectedFilters, jobRole: '' })
      } else if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: prev[category].filter((item: string) => item !== value)
        }
      }

      return prev
    })
  }

  const toggleFilter = (filterType: any, filterValue: any) => {
    setAppliedFilters((prev: any) => {
      if (filterType === 'salaryRange') {
        return {
          ...prev,
          salaryRange:
            prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1] ? [0, 0] : filterValue
        }
      } else if (filterType === 'jobRole') {
        return {
          ...prev,
          jobRole: prev.jobRole === filterValue ? '' : filterValue
        }
      } else {
        return {
          ...prev,
          [filterType]: prev[filterType]?.includes(filterValue)
            ? prev[filterType].filter((item: any) => item !== filterValue)
            : [...(prev[filterType] || []), filterValue]
        }
      }
    })
  }

  return (
    <div className='min-h-screen'>
      <JobListingCustomFilters
        open={addMoreFilters}
        setOpen={setAddMoreFilters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setAppliedFilters={setAppliedFilters}
        handleResetFilters={handleResetFilters}
      />

      <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(false)}
        onUpload={file => {
          if (file) {
            console.log('File uploaded:', file)
          }
        }}
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
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <DebouncedInput
              label='Search JD'
              value=''
              onChange={() => {}}
              placeholder='Search by Job Title or Job Description, Category...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ mt: 5 }}>
              <DynamicButton
                label='Add more filters'
                variant='tonal'
                icon={<i className='tabler-plus' />}
                position='start'
                children='Add more filters'
                onClick={() => setAddMoreFilters(true)}
              />
            </Box>

            <Box sx={{ mt: 5, cursor: CheckAllFiltersEmpty(selectedFilters) ? 'not-allowed' : 'pointer' }}>
              <DynamicButton
                label='Reset Filters'
                variant='outlined'
                icon={<RestartAlt />}
                position='start'
                onClick={handleResetFilters}
                children='Reset Filters'
                disabled={CheckAllFiltersEmpty(selectedFilters)}
              />
            </Box>
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='Upload JD'
              variant='tonal'
              icon={<i className='tabler-upload' />}
              position='start'
              onClick={() => setFileUploadDialogOpen(true)}
              children='Upload JD'
            />
            <DynamicButton
              label='New JD'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/jd-management/add/jd`)}
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
          <Stack direction='row' spacing={1} ml={5}>
            {!CheckAllFiltersEmpty(selectedFilters) && (
              <Typography component='h3' color='black'>
                Filters
              </Typography>
            )}
          </Stack>
          <Stack direction='row' spacing={1} ml={5}>
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
          </Stack>
        </Box>
      </Card>

      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-5 ' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          jobs?.map(job => (
            <Box
              onClick={() => router.push(`/jd-management/view/${job.id}`)}
              key={job.id}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 border border-gray-200`}
              sx={{
                cursor: 'pointer',
                minHeight: '150px'
              }}
            >
              <Box className='flex justify-between items-center p-4 border-b border-gray-200'>
                <Typography variant='h6' fontWeight='bold' color='primary'>
                  {job.title.toUpperCase()}
                </Typography>
                <div className='flex space-x-2'>
                  <Tooltip title='Edit JD' placement='top'>
                    {/* <IconButton
                      sx={{ ':hover': { color: 'primary.main' } }}
                      onClick={e => {
                        e.stopPropagation()
                        router.push(`/jd-management/edit/${job.id}`)
                      }}
                    >
                      <i className='tabler-edit' />
                    </IconButton> */}
                  </Tooltip>
                  <Tooltip title='Delete JD' placement='top'>
                    <IconButton
                      sx={{ ':hover': { color: 'error.main' } }}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <i className='tabler-trash' />
                    </IconButton>
                  </Tooltip>
                </div>
              </Box>

              <Box className='p-4 grid gap-2'>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Job Role:</strong> {job.job_role}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Experience:</strong> {job.experience}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Job Type:</strong> {job.job_type}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Education:</strong> {job.education}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Salary Range:</strong> {job.salary_range}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Skills:</strong> {job.skills.join(', ')}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <JobListingTableView jobs={jobs} />
        )}
      </div>

      {viewMode !== 'table' && (
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
          <div>
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
      )}
    </div>
  )
}

export default JobListing
