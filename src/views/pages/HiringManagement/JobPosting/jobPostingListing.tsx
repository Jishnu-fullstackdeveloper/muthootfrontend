'use client'

import React, { useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import { Box, Card, CardContent, CircularProgress, TextField, IconButton, Typography, Tooltip } from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon
} from '@mui/icons-material'

import DynamicButton from '@/components/Button/dynamicButton'

interface JobPosting {
  filter(arg0: (job: any) => any): any
  id: string
  designation: string
  jobRole: string
  location: string
  status: 'Pending' | 'Posted' | 'Closed'
  openings: number
  jobGrade: string
  postedDate: string
  department?: string
  manager?: string
  employeeCategory?: string
  branch?: string
  attachments?: string[]
  businessUnit?: string
  branchBusiness?: string
  zone?: string
  area?: string
  state?: string
  candidatesApplied?: number
  shortlisted?: number
  hired?: number
}

const JobPostGrid = dynamic(() => import('./jobPostGrid'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const JobTable = dynamic(() => import('./jobPostTable'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const dummyJobs: JobPosting[] = [
  {
    id: '1',
    designation: 'Senior Customer Service Executive',
    jobRole: 'Manager',
    location: 'TVM, India',
    status: 'Pending',
    openings: 2,
    jobGrade: 'JM2-60',
    postedDate: '12-08-2024',
    department: 'Customer Service',
    manager: 'Manager or Lateral',
    employeeCategory: 'Employee Type',
    branch: 'Permanent',
    attachments: ['www.google.com', 'www.example.com'],
    businessUnit: 'XCC',
    branchBusiness: 'Territory',
    zone: 'Kerala South',
    area: 'Mangalore',
    state: 'Kerala',
    candidatesApplied: 10,
    shortlisted: 3,
    hired: 1,
    filter: function () {
      throw new Error('Function not implemented.')
    }
  },
  {
    id: '2',
    designation: 'Product Manager',
    jobRole: 'Technical PM',
    location: 'New York, NY',
    status: 'Pending',
    openings: 2,
    jobGrade: 'JM2-60',
    postedDate: '10-08-2024',
    department: 'Product Development',
    manager: 'John Doe',
    employeeCategory: 'Full-time',
    branch: 'Head Office',
    attachments: ['www.report.pdf'],
    businessUnit: 'Tech Division',
    branchBusiness: 'North America',
    zone: 'East Coast',
    area: 'NY Metro',
    state: 'New York',
    candidatesApplied: 8,
    shortlisted: 2,
    hired: 0,
    filter: function () {
      throw new Error('Function not implemented.')
    }
  },
  {
    id: '3',
    designation: 'UX Designer',
    jobRole: 'UI/UX Specialist',
    location: 'Remote',
    status: 'Pending',
    openings: 1,
    jobGrade: 'JM2-60',
    postedDate: '08-08-2024',
    department: 'Design',
    manager: 'Jane Smith',
    employeeCategory: 'Contract',
    branch: 'Remote Team',
    attachments: ['www.design.doc'],
    businessUnit: 'Creative Unit',
    branchBusiness: 'Global',
    zone: 'Online',
    area: 'Virtual',
    state: 'N/A',
    candidatesApplied: 5,
    shortlisted: 1,
    hired: 0,
    filter: function () {
      throw new Error('Function not implemented.')
    }
  },
  {
    id: '4',
    designation: 'Data Scientist',
    jobRole: 'ML Engineer',
    location: 'Boston, MA',
    status: 'Closed',
    openings: 2,
    jobGrade: 'JM2-60',
    postedDate: '05-08-2024',
    department: 'Data Science',
    manager: 'Alex Brown',
    employeeCategory: 'Full-time',
    branch: 'Research Center',
    attachments: ['www.data.xlsx', 'www.model.pdf'],
    businessUnit: 'Analytics',
    branchBusiness: 'East Region',
    zone: 'New England',
    area: 'Boston Area',
    state: 'Massachusetts',
    candidatesApplied: 12,
    shortlisted: 4,
    hired: 2,
    filter: function () {
      throw new Error('Function not implemented.')
    }
  },
  {
    id: '5',
    designation: 'Software Engineer',
    jobRole: 'Backend Developer',
    location: 'San Francisco, CA',
    status: 'Posted',
    openings: 3,
    jobGrade: 'JM2-60',
    postedDate: '03-08-2024',
    department: 'Engineering',
    manager: 'Sarah Lee',
    employeeCategory: 'Full-time',
    branch: 'Main Office',
    attachments: ['www.code.zip'],
    businessUnit: 'DevOps',
    branchBusiness: 'West Coast',
    zone: 'California',
    area: 'Bay Area',
    state: 'California',
    candidatesApplied: 15,
    shortlisted: 5,
    hired: 3,
    filter: function () {
      throw new Error('Function not implemented.')
    }
  }
]

const JobPostListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [gridPage, setGridPage] = useState(1)
  const [tablePage, setTablePage] = useState(1)
  const [tableLimit, setTableLimit] = useState(10)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [isLoading] = useState(false)

  const router = useRouter()

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setGridPage(1)
      setTablePage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const jobs = useMemo(() => {
    return dummyJobs.filter(
      job =>
        job.designation.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.jobRole.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.location.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch])

  const handleView = (jobId: string) => {
    if (!jobId) {
      console.error('handleView: jobId is undefined or null')

      return
    }

    router.push(`/candidateListing?jobId=${encodeURIComponent(jobId)}`)
  }

  const handleGridLoadMore = (newPage: number) => {
    setGridPage(newPage)
  }

  const handleTablePageChange = (newPage: number) => {
    setTablePage(newPage)
  }

  const handleTableRowsPerPageChange = (newPageSize: number) => {
    setTableLimit(newPageSize)
    setTablePage(1)
  }

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              size='small'
              placeholder='Search job postings...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
                endAdornment: searchTerm && (
                  <IconButton size='small' onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                )
              }}
            />
            <Box>
              <Tooltip title='Interview Management'>
                <DynamicButton
                  variant='contained'
                  onClick={() => router.push('/hiring-management/interview-management')}
                >
                  Interview
                </DynamicButton>
              </Tooltip>
              <IconButton
                onClick={() => setView('table')}
                color={view === 'table' ? 'primary' : 'default'}
                aria-label='Table view'
              >
                <TableChartIcon />
              </IconButton>
              <IconButton
                onClick={() => setView('grid')}
                color={view === 'grid' ? 'primary' : 'default'}
                aria-label='Grid view'
              >
                <GridViewIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {isLoading && !jobs.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No job postings found</Typography>
        </Box>
      ) : view === 'grid' ? (
        <JobPostGrid
          data={jobs}
          loading={isLoading}
          page={gridPage}
          totalCount={jobs.length}
          onLoadMore={handleGridLoadMore}
        />
      ) : (
        <JobTable
          data={jobs}
          page={tablePage}
          limit={tableLimit}
          totalCount={jobs.length}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default JobPostListing
