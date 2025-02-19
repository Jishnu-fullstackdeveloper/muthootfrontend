'use client'
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
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import CustomTextField from '@/@core/components/mui/TextField'
import type { TextFieldProps } from '@mui/material/TextField'
import GridViewIcon from '@mui/icons-material/GridView' // Replace with your icon library if different
//import ViewListIcon from '@mui/icons-material/ViewList'
import DynamicButton from '@/components/Button/dynamicButton'
import JobListingCustomFilters from '@/@core/components/dialogs/job-listing-filters'
import { RestartAlt } from '@mui/icons-material'
import {
  getJDManagementFiltersFromCookie,
  removeJDManagementFiltersFromCookie,
  setJDManagementFiltersToCookie
} from '@/utils/functions'
import FileUploadDialog from '@/components/Dialog/jdFileUploadDialog'
import TableChartIcon from '@mui/icons-material/TableChart'
import JobListingTableView from './JobListingTable'
import { jobs } from '@/utils/sampleData/JobListingData'

const JobListing = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [addMoreFilters, setAddMoreFilters] = useState<any>(false)
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState<any>(false)
  const FiltersFromCookie = getJDManagementFiltersFromCookie()

  const [selectedFilters, setSelectedFilters] = useState({
    jobType: [], // Array for checkboxes
    experience: [],
    education: [],
    skills: [],
    salaryRange: [0, 0], // Default range for the slider
    jobRole: '' // Default value for the select dropdown
  })

  const [appliedFilters, setAppliedFilters] = useState({
    jobType: [], // Array for checkboxes
    experience: [],
    education: [],
    skills: [],
    salaryRange: [0, 0], // Default range for the slider
    jobRole: '' // Default value for the select dropdown
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
      jobType: [], // Array for checkboxes
      experience: [],
      education: [],
      skills: [],
      salaryRange: [0, 0], // Default range for the slider
      jobRole: '' // Default value for the select dropdown
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
    }, [value])

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
        // For arrays, check if empty or salaryRange specifically equals [0, 0]
        return key === 'salaryRange' ? value[0] === 0 && value[1] === 0 : value.length === 0
      }
      if (typeof value === 'string') {
        // For strings, check if empty
        return value.trim() === ''
      }
      if (typeof value === 'object' && value !== null) {
        // For objects, check if they are empty
        return Object.keys(value).length === 0
      }
      return !value // Handles numbers, null, undefined, etc.
    })
  }

  // Function to remove a value dynamically from a filter array
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
        // Toggle salary range: set to [0, 0] if already applied
        return {
          ...prev,
          salaryRange:
            prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1]
              ? [0, 0] // Reset to default
              : filterValue
        }
      } else if (filterType === 'jobRole') {
        return {
          ...prev,
          jobRole: prev.jobRole === filterValue ? '' : filterValue // Reset if matched, otherwise set new value
        }
      } else {
        // Toggle for other filters
        return {
          ...prev,
          [filterType]: prev[filterType]?.includes(filterValue)
            ? prev[filterType].filter((item: any) => item !== filterValue) // Remove filter value
            : [...(prev[filterType] || []), filterValue] // Add filter value
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
          top: 70, // Sticks the card at the top of the viewport
          zIndex: 10, // Ensures it stays above other elements
          backgroundColor: 'white',
          // height: 'auto', // Automatically adjusts height based on content
          paddingBottom: 2 // Adds some space at the bottom
        }}
      >
        {/* <CardHeader title='Filters' className='pbe-4' /> */}
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <DebouncedInput
              label='Search JD'
              // value={search}
              // onChange={value => setSearch(String(value))}
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
                icon={<RestartAlt />} // Proper reset icon from MUI
                position='start'
                onClick={handleResetFilters}
                children='Reset Filters'
                disabled={CheckAllFiltersEmpty(selectedFilters)}
              />
            </Box>
          </div>

          {/* Buttons */}
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
                gap: 2, // Spacing between icons
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
        {/* Reset Filters */}
        <Box>
          <Stack direction='row' spacing={1} ml={5}>
            {!CheckAllFiltersEmpty(selectedFilters) && (
              <Typography component='h3' color='black'>
                Filters
              </Typography>
            )}
          </Stack>
          <Stack direction='row' spacing={1} ml={5}>
            {/*
            <Chip label='Filter1' variant='outlined' color='primary' onDelete={() => {}} sx={{ ml: 5 }} />
            <Chip label='Filter2' variant='outlined' onDelete={() => {}} />
            */}

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
              {/* Map Experience Chips */}
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

              {/* Map Education Chips */}
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

              {/* Map Job Type Chips */}
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

              {/* Map Skills Chips */}
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

              {/* Handle Salary Range */}
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
      {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'> */}
      {/* <div className='space-y-4'> */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          jobs?.map(job => (
            <Box
              onClick={() => router.push(`/jd-management/view/${job.id}`)}
              key={job.id}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1`}
              sx={{
                cursor: 'pointer',
                minHeight: '150px'
              }}
            >
              {/* Header Section with Action Buttons */}
              <Box className='pt-4 pl-4 pb-3 pr-2 flex justify-between items-center'>
                <Typography variant='h5' mt={2} fontWeight='bold' gutterBottom color='primary'>
                  {job.title}
                </Typography>
                <div className='flex space-x-2'>
                  <Tooltip title='Edit JD' placement='top'>
                    <IconButton
                      sx={{ ':hover': { color: 'primary.main' } }}
                      onClick={e => {
                        e.stopPropagation()
                        router.push(`/jd-management/edit/${job.id}`)
                      }}
                    >
                      <i className='tabler-edit' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete JD' placement='top'>
                    <IconButton
                      sx={{ ':hover': { color: 'error.main' } }}
                      onClick={e => {
                        e.stopPropagation()
                        //handleDeleteClick(job.id);
                      }}
                    >
                      <i className='tabler-trash' />
                    </IconButton>
                  </Tooltip>
                </div>
              </Box>

              {/* Job Details */}
              <Box className='p-4 border-t grid grid-cols-2'>
                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Job Type:</strong> {job.job_type}
                </p>
                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Job Role:</strong> {job.job_role}
                </p>
                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Experience:</strong> {job.experience}
                </p>
                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Education</strong> {job.education}
                </p>
                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Salary Range:</strong> {job.salary_range}
                </p>
                {/* <p className='text-sm text-gray-700 mb-4'>
                  <strong>Role Description:</strong>{' '}
                  {job.description.length > 110 ? `${job.description.slice(0, 110)}...` : job.description}
                </p> */}
                {/* <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {job.skills.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant='outlined'
                      sx={{
                        fontSize: '12px',
                        backgroundColor: '#f5f5f5',
                        color: '#555',
                        ':hover': { backgroundColor: 'primary.light', color: 'white' }
                      }}
                    />
                  ))}
                </Stack> */}

                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Skills:</strong> {job.skills.join(', ')}
                </p>
              </Box>
            </Box>
          ))
        ) : (
          <JobListingTableView jobs={jobs} />
        )}
      </div>

      {viewMode !== 'table' && (
        <div className='flex items-center justify-end mt-6'>
          {/* Center-aligned "Load More" Button */}
          {/* <Box className='flex items-center justify-start flex-grow gap-4'>
          <Button variant='outlined' color='primary' endIcon={<ArrowDropDownIcon />}>
            Load More
          </Button>
        </Box> */}

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
              count={paginationState?.display_numbers_count} //pagination numbers display count
              page={paginationState?.page} //current page
              onChange={handlePageChange} //changing page function
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default JobListing
