// CandidateListing.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

import { Box, Card, CardContent, CircularProgress, TextField, IconButton, Typography, Button } from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchCandidates, resetCandidatesStatus } from '@/redux/JobPosting/jobListingSlice'

interface Candidate {
  id: number
  name: string
  email: string
  status: string
  appliedDate: string
  gender?: string
  appliedPortal?: string
  minExperience?: string
  maxExperience?: string
  phoneNumber?: string
  match?: string
}

const CandidateTable = dynamic(() => import('../../candidateManagement/candidateTable'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const CandidateGrid = dynamic(() => import('../../candidateManagement/candidateGrid'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const CandidateListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [gridPage, setGridPage] = useState(1)
  const [gridLimit] = useState(6)
  const [tablePage, setTablePage] = useState(1)
  const [tableLimit, setTableLimit] = useState(10)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [effectiveJobId, setEffectiveJobId] = useState<string | null>(null)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { candidatesData, isCandidatesLoading, candidatesFailure, candidatesFailureMessage } = useAppSelector(
    (state: any) => state.JobPostingReducer
  )

  // Handle jobId from query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const jobIdFromUrl = url.searchParams.get('jobId')
      const jobIdFromSearchParams = searchParams.get('jobId')

      console.log('CandidateListing URL:', window.location.href)
      console.log('CandidateListing searchParams:', Object.fromEntries(searchParams.entries()))
      console.log('CandidateListing jobId (searchParams):', jobIdFromSearchParams)
      console.log('CandidateListing jobId (URL):', jobIdFromUrl)
      console.log('CandidateListing candidatesData:', candidatesData)
      setEffectiveJobId(jobIdFromSearchParams || jobIdFromUrl)
    }
  }, [searchParams, candidatesData])

  // Fetch candidates from API
  useEffect(() => {
    if (effectiveJobId) {
      console.log('Fetching candidates for jobId:', effectiveJobId)
      dispatch(
        fetchCandidates({
          jobId: effectiveJobId,
          page: view === 'grid' ? gridPage : tablePage,
          limit: view === 'grid' ? gridLimit : tableLimit
        })
      )
    } else {
      console.log('No effective jobId, resetting candidates status')
      dispatch(resetCandidatesStatus())
    }

    return () => {
      dispatch(resetCandidatesStatus())
    }
  }, [effectiveJobId, gridPage, tablePage, gridLimit, tableLimit, view, dispatch])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setGridPage(1)
      setTablePage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter candidates by search
  const filteredCandidates = useMemo(() => {
    if (!debouncedSearch || !Array.isArray(candidatesData)) return candidatesData || []
    const lowerSearch = debouncedSearch.toLowerCase()

    return candidatesData.filter(
      (candidate: Candidate) =>
        candidate.name.toLowerCase().includes(lowerSearch) ||
        candidate.email.toLowerCase().includes(lowerSearch) ||
        (candidate.appliedPortal?.toLowerCase().includes(lowerSearch) ?? false) ||
        candidate.status.toLowerCase().includes(lowerSearch)
    )
  }, [debouncedSearch, candidatesData])

  // Paginate filtered candidates for table/grid
  const paginatedCandidates = useMemo(() => {
    const start = ((view === 'grid' ? gridPage : tablePage) - 1) * (view === 'grid' ? gridLimit : tableLimit)
    const end = start + (view === 'grid' ? gridLimit : tableLimit)

    return filteredCandidates.slice(start, end)
  }, [filteredCandidates, gridPage, tablePage, gridLimit, tableLimit, view])

  // const handleView = (candidateId: number) => {
  //   console.log('Navigating to candidateDetails with candidateId:', candidateId)
  //   router.push(`/candidateDetails?candidateId=${candidateId}`)
  // }

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
              placeholder='Search candidates...'
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
              <IconButton onClick={() => setView('grid')} color={view === 'grid' ? 'primary' : 'default'}>
                <GridViewIcon />
              </IconButton>
              <IconButton onClick={() => setView('table')} color={view === 'table' ? 'primary' : 'default'}>
                <TableChartIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {!effectiveJobId ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5 }}>
          <Typography color='error'>No job ID provided. Please select a job from the job postings page.</Typography>
          <Button variant='contained' onClick={() => router.push('/jobPostListing')} sx={{ mt: 2 }}>
            Go to Job Postings
          </Button>
        </Box>
      ) : isCandidatesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : candidatesFailure ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography color='error'>{candidatesFailureMessage}</Typography>
        </Box>
      ) : paginatedCandidates.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No candidates available for this job</Typography>
        </Box>
      ) : view === 'grid' ? (
        <CandidateGrid
          data={paginatedCandidates}
          loading={isCandidatesLoading}
          page={gridPage}
          totalCount={filteredCandidates.length}
          onLoadMore={handleGridLoadMore}
          updateCandidateStatus={function (candidateId: number, newStatus: string): void {
            newStatus
            candidateId
            throw new Error('Function not implemented.')
          }}
        />
      ) : (
        <CandidateTable
          data={paginatedCandidates}
          page={tablePage}
          limit={tableLimit}
          totalCount={filteredCandidates.length}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          updateCandidateStatus={function (candidateId: number, newStatus: string): void {
            candidateId
            newStatus
            throw new Error('Function not implemented.')
          }}
        />
      )}
    </Box>
  )
}

export default CandidateListing
