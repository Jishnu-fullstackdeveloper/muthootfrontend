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
  const [addMoreFilters, setAddMoreFilters] = useState(false)
  const [moreFiltersApplied, setMoreFiltersApplied] = useState(false)

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

  return (
    <div className='min-h-screen'>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'sticky',
          zIndex: 10,
          top: 93,
          backgroundColor: '#faf9f5',
          mb: 5
        }}
      >
        <Typography variant='h1' className='text-2xl font-bold mb-6'>
          Job Description Management
        </Typography>
        <Box></Box>
      </Box> */}
      <JobListingCustomFilters
        open={addMoreFilters}
        setOpen={setAddMoreFilters}
        onApplyFilters={function (selectedFilters: Record<string, string[]>): void {
          throw new Error('Function not implemented.')
        }}
        // onApplyFilters={setMoreFiltersApplied}
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

            {/* <CustomTextField
              select
              // value={status}
              label='Job placement'
              // onChange={e => setStatus(e.target.value)}
              className='is-[150px]'
              SelectProps={{ displayEmpty: true }}
              data-testid='status-filter'
              placeholder='Select Role'
            >
              <MenuItem value='in-progress'>On-site</MenuItem>
              <MenuItem value='open'>Remote</MenuItem>
            </CustomTextField>

            <CustomTextField
              select
              // value={status}
              label='Job type'
              // onChange={e => setStatus(e.target.value)}
              className='is-[150px]'
              SelectProps={{ displayEmpty: true }}
              data-testid='status-filter'
              placeholder='Select Role'
            >
              <MenuItem value='in-progress'>Full-Time</MenuItem>
              <MenuItem value='open'>Part-Time</MenuItem>
              <MenuItem value='open'>Contract</MenuItem>
              <MenuItem value='open'>Temporary</MenuItem>
            </CustomTextField> */}

            {/* <Box>
              <Typography color='text.primary' sx={{ fontSize: 13 }}>
                Location
              </Typography>
              <Autocomplete
                id='size-small-outlined'
                aria-label='Location'
                // fullWidth
                // options={filteredContactsListData || []} // Provide a fallback empty array
                // getOptionLabel={(option: any) => option?.first_name + ' ' + option?.last_name || ''}
                // defaultValue={filteredContactsListData?.[0] || null} // Provide a fallback value
                // value={selectedConsumer}
                // onChange={(e, newValue: any) => {
                //   setSelectedConsumer(newValue)
                //   TicketFormik.setFieldValue('consumer_id', newValue?.id || '')
                // }}
                size='small' // Reduces default padding
                sx={{
                  height: '40px', // Set the desired height
                  '.MuiInputBase-root': {
                    minHeight: '40px' // Ensures consistent height for the input box
                  },
                  width: '100%',
                  minWidth: 250
                }}
                renderInput={params => <TextField {...params} placeholder='Select Location' />}
                value=''
                onChange={(e, newValue: any) => {
                  // setSelectedConsumer(newValue)
                  // TicketFormik.setFieldValue('consumer_id', newValue?.id || '')
                }}
                options={[]}
              />
            </Box> */}

            {/* New Filter: Salary Range */}
            {/* <CustomTextField
              label='Salary Range'
              placeholder='Select salary range'
              value='10000 - 20000'
              // onChange={e => setSelectedSalaryRange(e.target.value)}
              select // Enables dropdown functionality
              className='is-[200px]'
            >
              <MenuItem value='10000 - 20000'>10000 - 20000</MenuItem>
              <MenuItem value='20000 - 40000'>20000 - 40000</MenuItem>
              <MenuItem value='40000 - 60000'>40000 - 60000</MenuItem>
              <MenuItem value='60000 - 80000'>60000 - 80000</MenuItem>
              <MenuItem value='80000 - 100000'>80000 - 100000</MenuItem>
              <MenuItem value='100000 - 120000'>100000 - 120000</MenuItem>
            </CustomTextField> */}

            {/* New Filter: Experience */}
            {/* <CustomTextField
              label='Experience'
              placeholder='e.g., 2+ Years'
              value=''
              onChange={e => setExperience(e.target.value)}
              className='is-[200px]'
            /> */}
            {/* <Button
              variant='contained'
              startIcon={<i className='tabler-refresh' />}
              // onClick={() => resetFiltersFunction()}
              className='is-full sm:is-auto w-100'
              data-testid='reset-filters-button'
              sx={{ ml: 3, mt: 4 }}
            >
              Reset Filters
            </Button> */}
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
            <Chip label='Filter1' variant='outlined' color='primary' onDelete={() => {}} sx={{ ml: 5 }} />
            <Chip label='Filter2' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter3' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter4' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter5' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter1' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter1' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter1' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter1' variant='outlined' onDelete={() => {}} />
            <Chip label='Filter1' variant='outlined' onDelete={() => {}} />
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
