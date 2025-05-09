'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import { Box, Card, CardContent, CircularProgress, TextField, IconButton, Typography } from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon
} from '@mui/icons-material'

interface JobPosting {
  id: number
  designation: string // Renamed from title
  jobRole: string // Added new field
  location: string
  status: 'Hiring' | 'In Progress' | 'Completed' // Updated status values
  openings: number
  candidatesApplied: number
  shortlisted: number
  hired: number
}

// Lazy load JobTable and JobPostGrid
const JobTable = dynamic(() => import('./jobPostTable'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const JobPostGrid = dynamic(() => import('./jobPostGrid'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const JobPostListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [gridPage, setGridPage] = useState(1)
  const [gridLimit] = useState(6)
  const [tablePage, setTablePage] = useState(1)
  const [tableLimit, setTableLimit] = useState(10)
  const [view, setView] = useState<'grid' | 'table'>('table')
  const [allJobs, setAllJobs] = useState<JobPosting[]>([])
  const [tableJobs, setTableJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // Mock data
  const jobPostings = useMemo<JobPosting[]>(
    () => [
      {
        id: 1,
        designation: 'Software Engineer',
        jobRole: 'Full Stack Developer',
        location: 'New York',
        status: 'Hiring',
        openings: 5,
        candidatesApplied: 20,
        shortlisted: 10,
        hired: 2
      },
      {
        id: 2,
        designation: 'Product Manager',
        jobRole: 'Product Strategy Lead',
        location: 'San Francisco',
        status: 'Completed',
        openings: 2,
        candidatesApplied: 15,
        shortlisted: 5,
        hired: 1
      },
      {
        id: 3,
        designation: 'Data Analyst',
        jobRole: 'Business Intelligence Analyst',
        location: 'Chicago',
        status: 'Hiring',
        openings: 3,
        candidatesApplied: 30,
        shortlisted: 12,
        hired: 0
      },
      {
        id: 4,
        designation: 'UX Designer',
        jobRole: 'User Interface Specialist',
        location: 'Austin',
        status: 'In Progress',
        openings: 4,
        candidatesApplied: 25,
        shortlisted: 8,
        hired: 3
      }
    ],
    []
  )

  // Memoized filtered job postings
  const filteredJobPostings = useMemo(() => {
    if (!debouncedSearch) return jobPostings

    const lowerSearch = debouncedSearch.toLowerCase()

    return jobPostings.filter(
      job =>
        job.designation.toLowerCase().includes(lowerSearch) ||
        job.jobRole.toLowerCase().includes(lowerSearch) ||
        job.location.toLowerCase().includes(lowerSearch) ||
        job.status.toLowerCase().includes(lowerSearch)
    )
  }, [debouncedSearch, jobPostings])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setGridPage(1)
      setTablePage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch and paginate data
  useEffect(() => {
    setLoading(true)

    if (view === 'grid') {
      const start = (gridPage - 1) * gridLimit
      const end = start + gridLimit
      const newJobs = filteredJobPostings.slice(start, end)

      setAllJobs(prev => {
        const existingIds = new Set(prev.map(job => job.id))

        return [...prev, ...newJobs.filter(job => !existingIds.has(job.id))]
      })
    } else {
      const start = (tablePage - 1) * tableLimit
      const end = start + tableLimit

      setTableJobs(filteredJobPostings.slice(start, end))
    }

    setLoading(false)
  }, [filteredJobPostings, gridPage, tablePage, view, gridLimit, tableLimit])

  // Initialize data on mount
  useEffect(() => {
    if (view === 'table') {
      const start = (tablePage - 1) * tableLimit
      const end = start + tableLimit

      setTableJobs(filteredJobPostings.slice(start, end))
    } else {
      const start = (gridPage - 1) * gridLimit
      const end = start + gridLimit

      setAllJobs(filteredJobPostings.slice(start, end))
    }
  }, [filteredJobPostings, view, gridLimit, tableLimit, gridPage, tablePage])

  const handleView = (jobId: number) => {
    router.push(`/candidateListing/${jobId}`)
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
              <IconButton onClick={() => setView('table')} color={view === 'table' ? 'primary' : 'default'}>
                <TableChartIcon />
              </IconButton>
              <IconButton onClick={() => setView('grid')} color={view === 'grid' ? 'primary' : 'default'}>
                <GridViewIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (view === 'grid' ? allJobs : tableJobs).length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No job postings available</Typography>
        </Box>
      ) : view === 'grid' ? (
        <JobPostGrid
          data={allJobs}
          loading={loading}
          page={gridPage}
          totalCount={filteredJobPostings.length}
          onLoadMore={handleGridLoadMore}
        />
      ) : (
        <JobTable
          data={tableJobs}
          page={tablePage}
          limit={tableLimit}
          totalCount={filteredJobPostings.length}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default JobPostListing
