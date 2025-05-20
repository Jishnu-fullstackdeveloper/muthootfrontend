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
import DynamicButton from '@/components/Button/dynamicButton'

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

// Lazy load CandidateTable and CandidateGrid
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
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
  const [tableCandidates, setTableCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // Mock data
  const candidates = useMemo<Candidate[]>(
    () => [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        status: 'Shortlisted',
        appliedDate: '2025-05-01',
        gender: 'Male',
        appliedPortal: 'LinkedIn',
        minExperience: '2 years',
        maxExperience: '5 years',
        phoneNumber: '123-456-7890',
        match: '85%'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        status: 'L1',
        appliedDate: '2025-05-02',
        gender: 'Female',
        appliedPortal: 'Indeed',
        minExperience: '1 year',
        maxExperience: '3 years',
        phoneNumber: '234-567-8901',
        match: '90%'
      },
      {
        id: 3,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        status: 'Shortlisted',
        appliedDate: '2025-05-03',
        gender: 'Other',
        appliedPortal: 'Company Website',
        minExperience: '3 years',
        maxExperience: '6 years',
        phoneNumber: '345-678-9012',
        match: '78%'
      },
      {
        id: 4,
        name: 'Bob Brown',
        email: 'bob.brown@example.com',
        status: 'Rejected',
        appliedDate: '2025-05-04',
        gender: '',
        appliedPortal: 'Referral',
        minExperience: '0 years',
        maxExperience: '2 years',
        phoneNumber: '456-789-0123',
        match: '65%'
      },
      {
        id: 5,
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        status: 'L1',
        appliedDate: '2025-05-05',
        gender: 'Female',
        appliedPortal: 'Glassdoor',
        minExperience: '4 years',
        maxExperience: '7 years',
        phoneNumber: '567-890-1234',
        match: '82%'
      },
      {
        id: 6,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        status: 'Shortlisted',
        appliedDate: '2025-05-06',
        gender: 'Male',
        appliedPortal: 'LinkedIn',
        minExperience: '5 years',
        maxExperience: '8 years',
        phoneNumber: '678-901-2345',
        match: '88%'
      },
      {
        id: 7,
        name: 'Sarah Davis',
        email: 'sarah.davis@example.com',
        status: 'Rejected',
        appliedDate: '2025-05-07',
        gender: 'Female',
        appliedPortal: 'Indeed',
        minExperience: '2 years',
        maxExperience: '4 years',
        phoneNumber: '789-012-3456',
        match: '70%'
      }
    ],
    []
  )

  // Memoized filtered candidates
  const filteredCandidates = useMemo(() => {
    if (!debouncedSearch) return candidates

    const lowerSearch = debouncedSearch.toLowerCase()

    return candidates.filter(
      candidate =>
        candidate.name.toLowerCase().includes(lowerSearch) ||
        candidate.email.toLowerCase().includes(lowerSearch) ||
        (candidate.appliedPortal?.toLowerCase().includes(lowerSearch) ?? false) ||
        candidate.status.toLowerCase().includes(lowerSearch)
    )
  }, [debouncedSearch, candidates])

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
      const newCandidates = filteredCandidates.slice(start, end)

      setAllCandidates(prev => {
        const existingIds = new Set(prev.map(candidate => candidate.id))
        return [...prev, ...newCandidates.filter(candidate => !existingIds.has(candidate.id))]
      })
    } else {
      const start = (tablePage - 1) * tableLimit
      const end = start + tableLimit

      setTableCandidates(filteredCandidates.slice(start, end))
    }

    setLoading(false)
  }, [filteredCandidates, gridPage, tablePage, view, gridLimit, tableLimit])

  // Initialize data on mount
  useEffect(() => {
    if (view === 'table') {
      const start = (tablePage - 1) * tableLimit
      const end = start + tableLimit

      setTableCandidates(filteredCandidates.slice(start, end))
    } else {
      const start = (gridPage - 1) * gridLimit
      const end = start + gridLimit

      setAllCandidates(filteredCandidates.slice(start, end))
    }
  }, [filteredCandidates, view, gridLimit, tableLimit, gridPage, tablePage])

  const handleView = (candidateId: number) => {
    router.push('./candidateDetails.tsx')
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

  const updateCandidateStatus = (candidateId: number, newStatus: string) => {
    setAllCandidates(prev =>
      prev.map(candidate => (candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate))
    )
    setTableCandidates(prev =>
      prev.map(candidate => (candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate))
    )
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (view === 'grid' ? allCandidates : tableCandidates).length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No candidates available</Typography>
        </Box>
      ) : view === 'grid' ? (
        <CandidateGrid
          data={allCandidates}
          loading={loading}
          page={gridPage}
          totalCount={filteredCandidates.length}
          onLoadMore={handleGridLoadMore}
          updateCandidateStatus={updateCandidateStatus}
        />
      ) : (
        <CandidateTable
          data={tableCandidates}
          page={tablePage}
          limit={tableLimit}
          totalCount={filteredCandidates.length}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default CandidateListing
