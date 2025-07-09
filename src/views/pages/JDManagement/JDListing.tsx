'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography
} from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { RestartAlt } from '@mui/icons-material'

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

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [addMoreFilters, setAddMoreFilters] = useState(false)
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false)
  const [jobList, setJobList] = useState(jobs) // initial static jobs

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

  // Load jobs from localStorage on mount
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jdList') || '[]')

    setJobList([...jobs, ...storedJobs])
  }, [])

  // Load filters from cookies
  useEffect(() => {
    if (FiltersFromCookie?.selectedFilters) setSelectedFilters(FiltersFromCookie.selectedFilters)
    if (FiltersFromCookie?.appliedFilters) setAppliedFilters(FiltersFromCookie.appliedFilters)
  }, [])

  // Save filters to cookies when changed
  useEffect(() => {
    setJDManagementFiltersToCookie({ selectedFilters, appliedFilters })
  }, [selectedFilters, appliedFilters])

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

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10
  })

  const handlePageChange = (_event: any, value: number) => {
    setPaginationState(prev => ({ ...prev, page: value }))
  }

  const handleChangeLimit = (value: number) => {
    setPaginationState(prev => ({ ...prev, limit: value, page: 1 }))
  }

  const CheckAllFiltersEmpty = (filters: any): boolean => {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) {
        return key === 'salaryRange' ? value[0] === 0 && value[1] === 0 : value.length === 0
      }

      return typeof value === 'string' ? value.trim() === '' : !value
    })
  }

  const removeSelectedFilterItem = (category: string, value: string) => {
    setSelectedFilters(prev => {
      if (category === 'jobRole') return { ...prev, jobRole: '' }

      if (Array.isArray(prev[category as keyof typeof prev])) {
        return {
          ...prev,
          [category]: prev[category as keyof typeof prev].filter((item: string) => item !== value)
        }
      }

      return prev
    })
  }

  const toggleFilter = (filterType: string, filterValue: any) => {
    setAppliedFilters(prev => {
      if (filterType === 'salaryRange') {
        return {
          ...prev,
          salaryRange:
            prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1] ? [0, 0] : filterValue
        }
      } else if (filterType === 'jobRole') {
        return { ...prev, jobRole: prev.jobRole === filterValue ? '' : filterValue }
      } else {
        return {
          ...prev,
          [filterType]: prev[filterType as keyof typeof prev].includes(filterValue)
            ? prev[filterType as keyof typeof prev].filter((item: any) => item !== filterValue)
            : [...prev[filterType as keyof typeof prev], filterValue]
        }
      }
    })
  }

  // Filter jobs based on applied filters
  const filteredJobs = jobList.filter(job => {
    const matchesJobType = appliedFilters.jobType.length === 0 || appliedFilters.jobType.includes(job.job_type)

    const matchesExperience =
      appliedFilters.experience.length === 0 || appliedFilters.experience.includes(job.experience)

    const matchesEducation = appliedFilters.education.length === 0 || appliedFilters.education.includes(job.education)

    const matchesSkills =
      appliedFilters.skills.length === 0 || appliedFilters.skills.every((skill: string) => job.skills.includes(skill))

    const matchesSalary =
      appliedFilters.salaryRange[0] === 0 && appliedFilters.salaryRange[1] === 0
        ? true
        : job.salary_range === `${appliedFilters.salaryRange[0]} - ${appliedFilters.salaryRange[1]}`

    const matchesJobRole =
      appliedFilters.jobRole === '' || job.job_role.toLowerCase().includes(appliedFilters.jobRole.toLowerCase())

    return matchesJobType && matchesExperience && matchesEducation && matchesSkills && matchesSalary && matchesJobRole
  })

  const paginatedJobs = filteredJobs.slice(
    (paginationState.page - 1) * paginationState.limit,
    paginationState.page * paginationState.limit
  )

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
          if (file) console.log('File uploaded:', file)

          // Implement upload logic here
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
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <Box sx={{ mt: 5 }}>
              <DynamicButton
                label='Add more filters'
                variant='tonal'
                icon={<i className='tabler-plus' />}
                position='start'
                onClick={() => setAddMoreFilters(true)}
              >
                Add more filters
              </DynamicButton>
            </Box>
            <Box sx={{ mt: 5, cursor: CheckAllFiltersEmpty(selectedFilters) ? 'not-allowed' : 'pointer' }}>
              <DynamicButton
                label='Reset Filters'
                variant='outlined'
                icon={<RestartAlt />}
                position='start'
                onClick={handleResetFilters}
                disabled={CheckAllFiltersEmpty(selectedFilters)}
              >
                Reset Filters
              </DynamicButton>
            </Box>
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <DynamicButton
              label='Upload JD'
              variant='tonal'
              icon={<i className='tabler-upload' />}
              position='start'
              onClick={() => setFileUploadDialogOpen(true)}
            >
              Upload JD
            </DynamicButton>
            <DynamicButton
              label='New JD'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/jd-management/add/jd`)}
            >
              New JD
            </DynamicButton>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                padding: '1px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }
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
            <Box sx={{ overflow: 'hidden', maxWidth: '100%', display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
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
              {(selectedFilters.salaryRange[0] !== 0 || selectedFilters.salaryRange[1] !== 0) && (
                <Chip
                  key='salary-range'
                  label={`${selectedFilters.salaryRange[0]} - ${selectedFilters.salaryRange[1]}`}
                  variant='outlined'
                  color={
                    appliedFilters.salaryRange[0] !== 0 || appliedFilters.salaryRange[1] !== 0 ? 'primary' : 'default'
                  }
                  onClick={() => toggleFilter('salaryRange', selectedFilters.salaryRange)}
                  onDelete={() => setSelectedFilters({ ...selectedFilters, salaryRange: [0, 0] })}
                />
              )}
              {selectedFilters.jobRole && (
                <Chip
                  key='job-role'
                  label={selectedFilters.jobRole}
                  variant='outlined'
                  color={appliedFilters.jobRole === selectedFilters.jobRole ? 'primary' : 'default'}
                  onClick={() => toggleFilter('jobRole', selectedFilters.jobRole)}
                  onDelete={() => removeSelectedFilterItem('jobRole', '')}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Card>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-5' : 'space-y-6'}>
        {viewMode === 'grid' ? (
          paginatedJobs.map(job => (
            <Box
              onClick={() => router.push(`/jd-management/view/${job.id}`)}
              key={job.id}
              className='rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer bg-[#F9FAFB]'
              sx={{ p: 4, width: '366px' }}
            >
              <Box className='flex justify-between items-center mb-2'>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className='tabler-code' />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 2 }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#23262F' }}>{job.title}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>{job.job_role}</Typography>
                </Box>
                <Tooltip title='Delete JD' placement='top'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation()
                      const updatedJobs = jobList.filter(j => j.id !== job.id)

                      setJobList(updatedJobs)
                      localStorage.setItem(
                        'jdList',
                        JSON.stringify(updatedJobs.filter(j => !jobs.some(sj => sj.id === j.id)))
                      )
                    }}
                  >
                    <i className='tabler-trash text-red-500' />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ my: 2, borderBottom: '1px solid #E5E7EB' }} />

              <Box className='grid grid-cols-2 gap-2 '>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'semibold' }}>Experience</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'semibold',color: '#23262F' }}>{job.experience}</Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'semibold' }}>
                    Job Type
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'semibold',color: '#23262F' }}>{job.job_type}</Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'semibold'}}>
                    Education
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'semibold',color: '#23262F' }}>{job.education}</Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'semibold'}}>
                    Salary Range
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'semibold',color: '#23262F' }}>{job.salary_range}</Typography>
                </Box>

                <Box className='col-span-2'>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'semibold'}}>
                    Skills
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'semibold',color: '#23262F' }}>{job.skills.join(', ')}</Typography>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <JobListingTableView jobs={paginatedJobs} />
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
            count={Math.ceil(filteredJobs.length / paginationState.limit)}
            page={paginationState.page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default JobListing
