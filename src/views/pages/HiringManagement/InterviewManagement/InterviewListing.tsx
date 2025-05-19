'use client'
import React, { useEffect, useState, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, TextField, InputAdornment, Button, Chip } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import 'react-datepicker/dist/react-datepicker.css'

//import InterviewTableView from './InterviewTableView'

interface InterviewCandidate {
  id: string
  candidateName: string
  email: string
  mobileNumber: string
  designationApplied: string
  screeningStatus: 'Shortlisted' | 'Rejected' | 'Pending' | 'Interviewed'
  interviewDate?: string
}

type ViewMode = 'grid' | 'table'

const staticCandidates: InterviewCandidate[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+1234567890',
    designationApplied: 'Software Engineer',
    screeningStatus: 'Shortlisted',
    interviewDate: '2025-05-10T00:00:00Z'
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobileNumber: '+1987654321',
    designationApplied: 'Product Manager',
    screeningStatus: 'Pending',
    interviewDate: '2025-05-11T00:00:00Z'
  },
  {
    id: '3',
    candidateName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    mobileNumber: '+1123456789',
    designationApplied: 'UI/UX Designer',
    screeningStatus: 'Rejected',
    interviewDate: '2025-05-12T00:00:00Z'
  },
  {
    id: '4',
    candidateName: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    mobileNumber: '+1098765432',
    designationApplied: 'Data Analyst',
    screeningStatus: 'Interviewed',
    interviewDate: '2025-05-13T00:00:00Z'
  },
  {
    id: '5',
    candidateName: 'Emma Brown',
    email: 'emma.brown@example.com',
    mobileNumber: '+1345678901',
    designationApplied: 'DevOps Engineer',
    screeningStatus: 'Shortlisted',
    interviewDate: '2025-05-14T00:00:00Z'
  },
  {
    id: '6',
    candidateName: 'Michael Lee',
    email: 'michael.lee@example.com',
    mobileNumber: '+1789012345',
    designationApplied: 'QA Engineer',
    screeningStatus: 'Pending',
    interviewDate: '2025-05-15T00:00:00Z'
  },
  {
    id: '7',
    candidateName: 'Sarah Davis',
    email: 'sarah.davis@example.com',
    mobileNumber: '+1567890123',
    designationApplied: 'Backend Developer',
    screeningStatus: 'Rejected',
    interviewDate: '2025-05-16T00:00:00Z'
  }
]

const InterviewListingPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filteredCandidates, setFilteredCandidates] = useState<InterviewCandidate[]>(staticCandidates)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Filter candidates based on fromDate
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : undefined

      const filtered = staticCandidates.filter(candidate => {
        if (!formattedFromDate || !candidate.interviewDate) return true

        return candidate.interviewDate.split('T')[0] >= formattedFromDate
      })

      setFilteredCandidates(filtered)
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [fromDate])

  return (
    <Box>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 1,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-3 border-bs gap-3 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-3 flex-wrap'>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 3 }}>
              Interview Listing
            </Typography>
          </Box>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 3, zIndex: 1100 }}>
            <AppReactDatepicker
              selected={fromDate}
              onChange={(date: Date | null) => setFromDate(date)}
              placeholderText='Select from date'
              isClearable
              customInput={
                <TextField
                  label='Filter by date'
                  variant='outlined'
                  size='small'
                  sx={{ width: '160px', mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <CalendarTodayOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                />
              }
              popperProps={{
                strategy: 'fixed'
              }}
              popperClassName='date-picker-popper'
              portalId='date-picker-portal'
            />
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
                padding: '2px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
                width: 'fit-content'
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('grid')}
                  size='small'
                  sx={{ p: 0.5 }}
                >
                  <GridViewIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  size='small'
                  sx={{ p: 0.5 }}
                >
                  <TableChartIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {filteredCandidates.length === 0 && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='secondary'>
            No interview candidates found
          </Typography>
        </Box>
      )}

      <Box className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          filteredCandidates?.map(candidate => (
            <Box
              onClick={() =>
                router.push(`/hiring-management/interview-management/view/interview-details?id=${candidate.id}`)
              }
              key={candidate.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              sx={{ cursor: 'pointer', minHeight: '150px' }}
            >
              <Box className='pt-3 pl-4 pb-1 pr-2 flex justify-between items-center'>
                <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
                  {candidate.candidateName}
                </Typography>
                <Tooltip title='Screening Status'>
                  <Chip
                    label={candidate.screeningStatus}
                    size='small'
                    variant='outlined'
                    sx={{ fontSize: '10px' }}
                    color={
                      candidate.screeningStatus === 'Shortlisted'
                        ? 'success'
                        : candidate.screeningStatus === 'Rejected'
                          ? 'error'
                          : candidate.screeningStatus === 'Interviewed'
                            ? 'info'
                            : 'default'
                    }
                  />
                </Tooltip>
              </Box>
              <Box className='p-2 border-t'>
                <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                  <Tooltip title='Email'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailOutlinedIcon fontSize='small' />: {candidate.email}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Mobile Number'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneOutlinedIcon fontSize='small' />: {candidate.mobileNumber}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Designation Applied'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkOutlineIcon fontSize='small' />: {candidate.designationApplied}
                    </Typography>
                  </Tooltip>
                  <Tooltip title='Interview Date'>
                    <Typography variant='body2' fontSize='10px' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayOutlinedIcon fontSize='small' />:
                      {candidate.interviewDate ? candidate.interviewDate.split('T')[0] : '-'}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box className='mt-4 flex justify-end gap-2'>
                  <Tooltip title='Shortlist'>
                    <Button
                      variant='tonal'
                      color='success'
                      size='small'
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={e => {
                        e.stopPropagation()
                        console.log(`Shortlist candidate ${candidate.candidateName}`)
                      }}
                    >
                      Shortlist
                    </Button>
                  </Tooltip>
                  <Tooltip title='Reject'>
                    <Button
                      variant='tonal'
                      color='error'
                      size='small'
                      startIcon={<CancelOutlinedIcon />}
                      onClick={e => {
                        e.stopPropagation()
                        console.log(`Reject candidate ${candidate.candidateName}`)
                      }}
                    >
                      Reject
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <InterviewTableView candidates={filteredCandidates} />
        )}
      </Box>

      <div id='date-picker-portal' />
    </Box>
  )
}

export default InterviewListingPage
