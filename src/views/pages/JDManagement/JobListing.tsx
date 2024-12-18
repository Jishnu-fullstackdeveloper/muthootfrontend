'use client'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/navigation'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import CustomTextField from '@/@core/components/mui/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

import GridViewIcon from '@mui/icons-material/GridView' // Replace with your icon library if different
import ViewListIcon from '@mui/icons-material/ViewList'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicChip from '@/components/Chip/dynamicChip'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import JobListingCustomFilters from '@/@core/components/dialogs/job-listing-filters'

const JobListing = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [addMoreFilters, setAddMoreFilters] = useState<any>(false)
  const [filterBtnApplied, setFilterBtnApplied] = useState<any>(false)
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: [], // Array for checkboxes
    experience: [],
    education: [],
    skills: [],
    salaryRange: [0, 0], // Default range for the slider
    jobRole: '' // Default value for the select dropdown
  })

  const [appliedFilters, setAppliedFliters] = useState({
    jobType: [], // Array for checkboxes
    experience: [],
    education: [],
    skills: [],
    salaryRange: [0, 0], // Default range for the slider
    jobRole: '' // Default value for the select dropdown
  })

  useEffect(() => {
    console.log('selectedFilters', selectedFilters)
    console.log('appliedFilters', appliedFilters)
  }, [selectedFilters, appliedFilters])

  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      experience: '3+ years',
      description: 'Develop and maintain web applications using React and Node.js.',
      location: 'Kochi, Bengaluru, Thiruvananthapuram',
      job_type: 'Remote',
      job_placement: 'Full-Time',
      tags: ['ERP', 'python', 'openrep', 'development', 'ERP', 'python', 'openrep', 'development']
    },
    {
      id: 2,
      title: 'Project Manager',
      experience: '5+ years',
      description: 'Manage teams and deliver projects on time and budget.',
      location: 'Mumbai, Pune, Hyderabad',
      job_type: 'Onsite',
      job_placement: 'Part-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      experience: '2+ years',
      description: 'Design intuitive user interfaces and enhance user experiences.',
      location: 'Delhi, Gurugram, Noida',
      job_type: 'Remote',
      job_placement: 'Full-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 4,
      title: 'Data Scientist',
      experience: '4+ years',
      description: 'Analyze complex datasets and build predictive models.',
      location: 'Chennai, Coimbatore, Bengaluru',
      job_type: 'Onsite',
      job_placement: 'Part-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 5,
      title: 'Software Engineer',
      experience: '3+ years',
      description: 'Develop and maintain web applications using React and Node.js.',
      location: 'Ahmedabad, Surat, Vadodara',
      job_type: 'Remote',
      job_placement: 'Full-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 6,
      title: 'Project Manager',
      experience: '5+ years',
      description: 'Manage teams and deliver projects on time and budget.',
      location: 'Kolkata, Bhubaneswar, Guwahati',
      job_type: 'Onsite',
      job_placement: 'Part-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 7,
      title: 'UI/UX Designer',
      experience: '2+ years',
      description: 'Design intuitive user interfaces and enhance user experiences.',
      location: 'Lucknow, Kanpur, Varanasi',
      job_type: 'Remote',
      job_placement: 'Full-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 8,
      title: 'Data Scientist',
      experience: '4+ years',
      description: 'Analyze complex datasets and build predictive models.',
      location: 'Indore, Bhopal, Raipur',
      job_type: 'Onsite',
      job_placement: 'Part-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 9,
      title: 'Software Engineer',
      experience: '3+ years',
      description: 'Develop and maintain web applications using React and Node.js.',
      location: 'Jaipur, Jodhpur, Udaipur',
      job_type: 'Remote',
      job_placement: 'Full-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 10,
      title: 'Project Manager',
      experience: '5+ years',
      description: 'Manage teams and deliver projects on time and budget.',
      location: 'Patna, Ranchi, Jamshedpur',
      job_type: 'Onsite',
      job_placement: 'Part-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    },
    {
      id: 11,
      title: 'UI/UX Designer',
      experience: '2+ years',
      description: 'Design intuitive user interfaces and enhance user experiences.',
      location: 'Goa, Panaji, Vasco da Gama',
      job_type: 'Remote',
      job_placement: 'Full-Time',
      tags: ['ERP', 'python', 'openrep', 'development', 'openrep']
    },
    {
      id: 12,
      title: 'Data Scientist',
      experience: '4+ years',
      description: 'Analyze complex datasets and build predictive models.',
      location: 'Chandigarh, Mohali, Zirakpur',
      job_type: 'Onsite',
      job_placement: 'Part-Time',
      tags: ['ERP', 'python', 'openrep', 'development']
    }
  ]

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
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  // Function to remove a specific value from any filter array
  // Function to remove a value dynamically from a filter array
  const removeItem = (category: any, value: string) => {
    setSelectedFilters((prev: any) => {
      if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: prev[category].filter((item: string) => item !== value)
        }
      }
      return prev
    })
  }

  //to check whether that filter is applied or not
  const isFilterApplied = (filterType: string[], appliedFilters: string[]) => {
    return filterType.every(item => appliedFilters.includes(item))
  }

  const toggleFilter = (filterType: any, filterValue: any) => {
    setAppliedFliters((prev: any) => {
      if (filterType === 'salaryRange') {
        // Toggle salary range: set to [0, 0] if already applied
        return {
          ...prev,
          salaryRange:
            prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1]
              ? [0, 0] // Reset to default
              : filterValue
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
        setAppliedFliters={setAppliedFliters}
      />
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70, // Sticks the card at the top of the viewport
          zIndex: 10, // Ensures it stays above other elements
          backgroundColor: 'white',
          height: 'auto', // Automatically adjusts height based on content
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
          </div>

          {/* Buttons */}
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='Upload JD'
              variant='tonal'
              icon={<i className='tabler-upload' />}
              position='start'
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
              <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
        {/* Reset Filters */}
        <Box>
          <Stack direction='row' spacing={1} ml={5}>
            <Typography component='h3' color='black'>
              Filters
            </Typography>
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
                  onDelete={() => removeItem('experience', exp)}
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
                  onDelete={() => removeItem('education', edu)}
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
                  onDelete={() => removeItem('jobType', type)}
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
                  onDelete={() => removeItem('skills', skill)}
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
                  onDelete={() => {
                    setSelectedFilters({
                      ...selectedFilters,
                      salaryRange: [0, 0]
                    })
                  }}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Card>
      {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'> */}
      {/* <div className='space-y-4'> */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
        {jobs.map(job => (
          <Box
            sx={{ cursor: 'pointer' }}
            key={job.id}
            className='bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition'
            onClick={() => router.push(`/jd-management/view/${job.id}`)}
          >
            {/* Title and Icons Container */}
            <Box className='flex justify-between items-center'>
              {/* Job Title */}
              <h2 className='text-lg font-semibold text-gray-800'>{job.title}</h2>

              {/* Icons */}
              <div className='flex items-center space-x-2'>
                {/* Edit Icon */}
                <Tooltip title='Edit JD' placement='top'>
                  <IconButton
                    aria-label='edit'
                    component='span'
                    onClick={e => {
                      e.stopPropagation() // Prevent triggering the parent's onClick
                      router.push(`/jd-management/edit/${job.id}`)
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                {/* Delete Icon */}
                <Tooltip title='Delete JD' placement='top'>
                  <IconButton color='secondary' aria-label='delete' component='span' onClick={e => e.stopPropagation()}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Box>

            {/* Job Details */}
            <p className='text-sm text-gray-500 mb-2'>
              <strong>Experience:</strong> {job.experience}
            </p>
            <p className='text-gray-600 text-sm mb-4'>
              <strong>Role Description: </strong>
              {job.description}
            </p>

            {/* Job Tags */}
            <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {job.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant='outlined' />
              ))}
            </Stack>
          </Box>
        ))}
      </div>
      <div className='flex items-center justify-end mt-6'>
        {/* Center-aligned "Load More" Button */}
        {/* <Box className='flex items-center justify-start flex-grow gap-4'>
          <Button variant='outlined' color='primary' endIcon={<ArrowDropDownIcon />}>
            Load More
          </Button>
        </Box> */}

        {/* Right-aligned Pagination */}
        <FormControl size='small' sx={{ minWidth: 70 }}>
          <InputLabel>Count</InputLabel>
          <Select
            value='10'
            // onChange={handleCountChange}
            label='Count per page'
          >
            {[10, 20, 30, 50].map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Pagination count={10} color='primary' />
        </div>
      </div>
    </div>
  )
}

export default JobListing
