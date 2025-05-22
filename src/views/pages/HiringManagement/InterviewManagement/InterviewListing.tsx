'use client'
import React, { useEffect, useState, useRef } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import SearchIcon from '@mui/icons-material/Search' // Added for search bar
import InterviewTableView from './InterviewListTable'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { InterviewCandidate, staticCandidates } from '@/utils/sampleData/InterviewManagement/InterviewListData'

//import InterviewTableView from './InterviewTableView'

type ViewMode = 'grid' | 'table'

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
            <TextField
              label='Search'
              variant='outlined'
              size='small'
              sx={{ width: '300px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            {/* <AppReactDatepicker
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
            /> */}
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
              <Box className=' pl-4  pr-2 flex justify-between items-center'>
                <Box className='flex'>
                  <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
                    {candidate.candidateName}
                  </Typography>
                  <Divider orientation='vertical' flexItem sx={{ mx: 1, height: '36px', alignSelf: 'center' }} />
                  <Tooltip title='Job ID'>
                    <Typography mt={3} fontWeight='medium' fontSize='10px' gutterBottom>
                      {candidate.jobId}
                    </Typography>
                  </Tooltip>
                </Box>
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
                <Divider orientation='horizontal' sx={{ mt: 2 }} />
                {/* <Box className='mt-3 flex justify-end gap-2'>
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
                </Box> */}
                <Box className='mt-3 flex justify-end items-center gap-2'>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 17 }}>
                    <CircularProgress
                      variant='determinate'
                      value={candidate.profileMatchPercent || 0}
                      size={40}
                      thickness={3}
                      sx={{ color: 'primary.main' }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant='body2' component='div' color='text.secondary' fontWeight='bold'>
                        {`${Math.round(candidate.profileMatchPercent || 0)}%`}
                      </Typography>
                    </Box>
                  </Box>
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
