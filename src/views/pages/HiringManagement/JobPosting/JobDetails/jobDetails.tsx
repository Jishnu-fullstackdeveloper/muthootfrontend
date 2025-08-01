'use client'

import React, { useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Box, Tabs, Tab, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJobPostingsById, resetJobPostingByIdStatus } from '@/redux/JobPosting/jobListingSlice'

import CandidateListing from './candidateListing'
import VacancyDetails from './vaccancyDetails'
import ViewJD from '@views/pages/JDManagement/viewJD'

export default function Home() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  // Redux state
  const { jobPostingByIdData, jobPostingByIdFailure, jobPostingByIdFailureMessage } = useAppSelector(
    (state: any) => state.JobPostingReducer
  )

  // Use ref to track fetch initiation without causing re-renders
  const isFetchInitiated = useRef(false)

  // Fetch job details when jobId changes, but only if not already fetched
  useEffect(() => {
    if (jobId && !isFetchInitiated.current && !jobPostingByIdData) {
      dispatch(fetchJobPostingsById(jobId))
      isFetchInitiated.current = true // Mark fetch as initiated
    }

    // Cleanup on unmount or jobId change
    return () => {
      dispatch(resetJobPostingByIdStatus())
      isFetchInitiated.current = false // Reset on unmount or jobId change
    }
  }, []) // Only depend on jobId and dispatch

  const [activeTab, setActiveTab] = useState('Vacancy Details')

  // Render error state
  if (jobPostingByIdFailure) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Typography color='error'>{jobPostingByIdFailureMessage || 'Failed to load job details'}</Typography>
      </Box>
    )
  }

  // Extract jdId from the API response
  const jdId = jobPostingByIdData?.data?.jdId

  console.log('JD ID:', jdId)

  return (
    <Box sx={{}}>
      {/* Tab Navigation */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#F9FAFB',
          '& .MuiTabs-indicator': { backgroundColor: 'transparent', display: 'none' } // Hide underline
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: '#23262F',
                bgcolor: '#FFFFFF', // White background for active tab
                borderRadius: 2, // Chip-like rounded corners
                mx: 0.5,
                boxShadow: 1,
                my: 1
              },
              '&:hover': { textDecoration: 'none', color: 'inherit', borderBottom: 'none' } // Remove underline on hover
            }
          }}
        >
          <Tab label='Vacancy Details' value='Vacancy Details' />
          <Tab label='Jd Details' value='Jd Details' />
          <Tab label='Candidate Listing' value='Candidate Listing' />
        </Tabs>
      </Box>
      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {activeTab === 'Jd Details' && <ViewJD jdId={jdId} />}
        {activeTab === 'Vacancy Details' && <VacancyDetails />}
        {activeTab === 'Candidate Listing' && <CandidateListing />}
      </Box>
    </Box>
  )
}
