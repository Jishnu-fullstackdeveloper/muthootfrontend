'use client'

import React, { useState } from 'react'

import { Typography, Card, MenuItem, Select, Grid, Box, Pagination, FormControl, InputLabel } from '@mui/material'
import type { TableMeta } from '@tanstack/react-table'

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

// Define custom TableMeta interface to include updateData
interface CandidateTableMeta extends TableMeta<Candidate> {
  updateData: (rowIndex: number, columnId: string, value: any) => void
}

const CandidateDetails = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [candidates, setCandidates] = useState<Candidate[]>([
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
  ])

  const statusOptions = ['Shortlisted', 'Rejected', 'L1']

  // Table meta to handle data updates
  const tableMeta: CandidateTableMeta = {
    updateData: (rowIndex: number, columnId: string, value: any) => {
      setCandidates(old => old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)))
    }
  }

  const paginatedCandidates = candidates.slice((page - 1) * limit, page * limit)
  const totalPages = Math.ceil(candidates.length / limit)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Candidate List
      </Typography>
      <Grid container spacing={3}>
        {paginatedCandidates.map((candidate, index) => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant='h6'>{candidate.name}</Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Email:</strong> {candidate.email}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Applied Portal:</strong> {candidate.appliedPortal || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Applied Date:</strong> {candidate.appliedDate}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Min Experience:</strong> {candidate.minExperience || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Max Experience:</strong> {candidate.maxExperience || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Phone Number:</strong> {candidate.phoneNumber || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Match:</strong> {candidate.match || 'N/A'}
              </Typography>
              <FormControl sx={{ mt: 2, minWidth: 120 }} size='small'>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusOptions.includes(candidate.status) ? candidate.status : ''}
                  onChange={e => {
                    const newStatus = e.target.value

                    tableMeta.updateData((page - 1) * limit + index, 'status', newStatus)
                    console.log(`Updated status for ${candidate.name} to ${newStatus}`)
                  }}
                  label='Status'
                >
                  <MenuItem value='' disabled>
                    Select Status
                  </MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={(_, newPage) => setPage(newPage)} color='primary' />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <FormControl sx={{ minWidth: 120 }} size='small'>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={limit}
            onChange={e => {
              setLimit(Number(e.target.value))
              setPage(1) // Reset to first page when changing limit
            }}
            label='Rows per page'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

export default CandidateDetails
