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
  Tab,
  Tabs,
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
import ViewListIcon from '@mui/icons-material/ViewList'
import DynamicButton from '@/components/Button/dynamicButton'
import VacancyManagementFilters from '@/@core/components/dialogs/vacancy-listing-filters'
import { RestartAlt } from '@mui/icons-material'

const JobListing = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [addMoreFilters, setAddMoreFilters] = useState<any>(false)
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    department: [],
    employmentType: [],
    experience: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const [appliedFilters, setAppliedFilters] = useState({
    location: [],
    department: [],
    employmentType: [],
    experience: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const handleTabChange = (vacancyId: any, newValue: number) => {
    setSelectedTabs(prev => ({
      ...prev,
      [vacancyId]: newValue // Update the tab index for the specific vacancy
    }))
  }

  const vacancies = [
    {
      id: 1,
      title: 'Software Engineer',
      jobType: 'Full-time',
      numberOfOpenings: 5,
      branch: 'IT Department',
      city: 'New York',
      experience: 3,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      contactPerson: 'John Doe',
      status: 'Open' // Possible values: Open, Closed, On Hold
    },
    {
      id: 2,
      title: 'Marketing Manager',
      jobType: 'Part-time',
      numberOfOpenings: 2,
      branch: 'Marketing',
      city: 'San Francisco',
      experience: 5,
      startDate: '2024-01-01',
      endDate: '2024-01-30',
      contactPerson: 'Jane Smith',
      status: 'On Hold'
    },
    {
      id: 3,
      title: 'Data Scientist',
      jobType: 'Full-time',
      numberOfOpenings: 3,
      branch: 'Data Analytics',
      city: 'Los Angeles',
      experience: 4,
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      contactPerson: 'Emily Zhang',
      status: 'Open'
    },
    {
      id: 4,
      title: 'HR Specialist',
      jobType: 'Full-time',
      numberOfOpenings: 1,
      branch: 'Human Resources',
      city: 'Chicago',
      experience: 3,
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      contactPerson: 'Michael Johnson',
      status: 'Closed'
    },
    {
      id: 5,
      title: 'Sales Executive',
      jobType: 'Full-time',
      numberOfOpenings: 4,
      branch: 'Sales',
      city: 'Dallas',
      experience: 2,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      contactPerson: 'Sarah Williams',
      status: 'On Hold'
    },
    {
      id: 6,
      title: 'Product Manager',
      jobType: 'Full-time',
      numberOfOpenings: 2,
      branch: 'Product Development',
      city: 'Austin',
      experience: 5,
      startDate: '2024-01-25',
      endDate: '2024-02-25',
      contactPerson: 'David Lee',
      status: 'Open'
    }
  ]
  const [selectedTabs, setSelectedTabs] = useState<{ [key: string]: number }>(() =>
    vacancies?.reduce(
      (acc, vacancy) => {
        acc[vacancy.id] = 0 // Set the default tab to 'Details' (index 0) for each vacancy
        return acc
      },
      {} as { [key: string]: number }
    )
  )

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

  const handleResetFilters = () => {
    setSelectedFilters({
      location: [],
      department: [],
      employmentType: [],
      experience: [],
      skills: [],
      salaryRange: [0, 0],
      jobRole: ''
    })
  }

  // Function to remove a specific value from any filter array
  // Function to remove a value dynamically from a filter array
  const removeItem = (category: any, value: string) => {
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
      <VacancyManagementFilters
        open={addMoreFilters}
        setOpen={setAddMoreFilters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setAppliedFilters={setAppliedFilters}
        handleResetFilters={handleResetFilters}
      />
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
            <DebouncedInput
              label='Search Vacancy'
              // value={search}
              // onChange={value => setSearch(String(value))}
              value=''
              onChange={() => {}}
              placeholder='Search by Job Title or skill...'
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

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='New Vacancy'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/vacancy-management/add/new-vacancy`)}
              children='New Vacancy'
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
              {selectedFilters.location.map(loc => (
                <Chip
                  key={loc}
                  label={loc}
                  variant='outlined'
                  color={appliedFilters.location.includes(loc) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('location', loc)}
                  onDelete={() => removeItem('location', loc)}
                />
              ))}

              {/* Map Job Type Chips */}
              {selectedFilters.department.map(dept => (
                <Chip
                  key={dept}
                  label={dept}
                  variant='outlined'
                  color={appliedFilters.department.includes(dept) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('department', dept)}
                  onDelete={() => removeItem('department', dept)}
                />
              ))}

              {/* Map Skills Chips */}
              {selectedFilters.employmentType.map(emp_type => (
                <Chip
                  key={emp_type}
                  label={emp_type}
                  variant='outlined'
                  color={appliedFilters.employmentType.includes(emp_type) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('employmentType', emp_type)}
                  onDelete={() => removeItem('employmentType', emp_type)}
                />
              ))}

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
                  onDelete={() => removeItem('jobRole', '')}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Card>

      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {vacancies.map(vacancy => (
          <Box
            onClick={() => router.push(`/vacancy-management/view/${vacancy.id}`)}
            key={vacancy.id}
            className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 ${
              viewMode !== 'grid' && 'p-6'
            }`}
            sx={{
              cursor: 'pointer',
              minHeight: viewMode !== 'grid' ? '150px' : 'auto'
            }}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <>
                {/* Header Section with Action Buttons */}
                <Box className='pt-4 pl-4 pb-3 flex justify-between items-center'>
                  <div className='flex items-center'>
                    <Typography variant='h5' mt={2} fontWeight='bold' color='primary' gutterBottom>
                      {vacancy.title}
                    </Typography>
                  </div>
                  <div className='flex space-x-2'>
                    <Stack sx={{ marginTop: 2 }}>
                      <Chip
                        label={vacancy.status}
                        color={
                          vacancy.status === 'Open' ? 'success' : vacancy.status === 'Closed' ? 'default' : 'warning'
                        }
                        size='small'
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.85rem', // Slightly increased font size
                          textTransform: 'uppercase'
                        }}
                      />
                    </Stack>
                    <Tooltip title='Edit Vacancy' placement='top'>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation() // Prevent card click
                          router.push(`/vacancy-management/edit/${vacancy.id}`)
                        }}
                      >
                        <i className='tabler-edit' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete Vacancy' placement='top'>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation() // Prevent card click
                          // Add delete logic here
                        }}
                      >
                        <i className='tabler-trash' />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Box>

                {/* Tabbed Details Section */}
                <Box className='p-4 border-t'>
                  <Tabs
                    value={selectedTabs[vacancy.id] || 0} // Get the selected tab for the current vacancy
                    onClick={e => e.stopPropagation()}
                    onChange={(e, newValue) => handleTabChange(vacancy.id, newValue)} // Pass vacancy ID to handleTabChange
                    aria-label='vacancy details'
                  >
                    {/* Tab Labels */}
                    <Tab label='Details' />
                    <Tab label='Dates' />
                    <Tab label='Contact' />
                  </Tabs>

                  {/* Tab Content */}
                  <Box className='mt-4'>
                    {selectedTabs[vacancy.id] === 0 && (
                      <Box className='space-y-2 text-sm text-gray-700'>
                        <p>
                          <strong>Job Type:</strong> {vacancy.jobType}
                        </p>
                        <p>
                          <strong>Openings:</strong> {vacancy.numberOfOpenings}
                        </p>
                        <p>
                          <strong>Branch:</strong> {vacancy.branch}
                        </p>
                        <p>
                          <strong>City:</strong> {vacancy.city}
                        </p>
                        <p>
                          <strong>Experience:</strong> {vacancy.experience} years
                        </p>
                      </Box>
                    )}
                    {selectedTabs[vacancy.id] === 1 && (
                      <Box className='space-y-2 text-sm text-gray-700'>
                        <p>
                          <strong>Start Date:</strong> {vacancy.startDate}
                        </p>
                        <p>
                          <strong>End Date:</strong> {vacancy.endDate}
                        </p>
                      </Box>
                    )}
                    {selectedTabs[vacancy.id] === 2 && (
                      <Box className='space-y-2 text-sm text-gray-700'>
                        <p>
                          <strong>Contact Person:</strong> {vacancy.contactPerson}
                        </p>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              // List View
              <Grid container spacing={4} alignItems='center'>
                {/* Column 1 */}
                <Grid item xs={12} md={4}>
                  <Typography variant='h5' fontWeight='bold' color='primary' gutterBottom>
                    {/* Increased size for title */}
                    {vacancy.title}
                  </Typography>
                  <Typography variant='body1'>
                    {/* Larger font for body text */}
                    <strong>Job Type:</strong> {vacancy.jobType}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Openings:</strong> {vacancy.numberOfOpenings}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Branch:</strong> {vacancy.branch}
                  </Typography>
                </Grid>

                {/* Column 2 */}
                <Grid item xs={12} md={4}>
                  <Typography variant='body1'>
                    <strong>City:</strong> {vacancy.city}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Experience:</strong> {vacancy.experience} years
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Start Date:</strong> {vacancy.startDate}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>End Date:</strong> {vacancy.endDate}
                  </Typography>
                </Grid>

                {/* Column 3 */}
                <Grid item xs={12} md={4}>
                  <Typography variant='body1'>
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={vacancy.status}
                      color={
                        vacancy.status === 'Open' ? 'success' : vacancy.status === 'Closed' ? 'default' : 'warning'
                      }
                      size='small'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Contact Person:</strong> {vacancy.contactPerson}
                  </Typography>
                </Grid>
              </Grid>
            )}
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
