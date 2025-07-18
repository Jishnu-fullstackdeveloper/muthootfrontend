// JobPostListing.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import { Box, Card, CardContent, CircularProgress, TextField, IconButton, Typography, Tooltip } from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJobPostings } from '@/redux/JobPosting/jobListingSlice'
import DynamicButton from '@/components/Button/dynamicButton'

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
  const [tablePage, setTablePage] = useState(1)
  const [tableLimit, setTableLimit] = useState(10)
  const [view, setView] = useState<'grid' | 'table'>('grid')

  const router = useRouter()
  const dispatch = useAppDispatch()

  const { jobPostingsData, isJobPostingsLoading, totalCount, jobPostingsFailure, jobPostingsFailureMessage } =
    useAppSelector((state: any) => state.JobPostingReducer)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setGridPage(1)
      setTablePage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch jobs from API
  useEffect(() => {
    dispatch(
      fetchJobPostings({
        page: view === 'grid' ? gridPage : tablePage,
        limit: view === 'grid' ? undefined : tableLimit,
        search: debouncedSearch || undefined
      })
    )
  }, [dispatch, view, gridPage, tablePage, tableLimit, debouncedSearch])

  const jobs = useMemo(() => {
    if (!jobPostingsData) return []

    const mappedJobs = jobPostingsData.map((item: any) => ({
      ...item.job,
      id: item.job?.id, // Ensure job ID is included
      candidatesApplied: item.candidateStatusCounts?.APPLIED || 0,
      shortlisted: item.candidateStatusCounts?.SHORTLISTED || 0,
      hired: item.candidateStatusCounts?.HIRED || 0
    }))

    console.log('Mapped Jobs:', mappedJobs)

    return mappedJobs.filter(job => job.id) // Filter out jobs without an ID
  }, [jobPostingsData])

  const handleView = (jobId: string) => {
    if (!jobId) {
      console.error('handleView: jobId is undefined or null')

      return
    }

    const url = `/candidateListing?jobId=${encodeURIComponent(jobId)}`

    console.log('Navigating to:', url)
    router.push(url)
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

      {isJobPostingsLoading && !jobs.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : jobPostingsFailure ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography color='error'>{jobPostingsFailureMessage}</Typography>
        </Box>
      ) : jobs.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No job postings available</Typography>
        </Box>
      ) : view === 'grid' ? (
        <JobPostGrid
          data={jobs}
          loading={isJobPostingsLoading}
          page={gridPage}
          totalCount={totalCount}
          onLoadMore={handleGridLoadMore}
        />
      ) : (
        <JobTable
          data={jobs}
          page={tablePage}
          limit={tableLimit}
          totalCount={totalCount}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default JobPostListing
