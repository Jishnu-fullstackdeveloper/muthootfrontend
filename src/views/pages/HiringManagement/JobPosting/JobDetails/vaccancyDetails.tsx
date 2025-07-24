'use client'

import React, { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { Box, Typography, Divider, Paper } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { fetchJobPostingsById, resetJobPostingByIdStatus } from '@/redux/JobPosting/jobListingSlice'

const JobVacancyView = () => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  // Redux state
  const { jobPostingByIdData, isJobPostingByIdLoading, jobPostingByIdFailure, jobPostingByIdFailureMessage } =
    useAppSelector((state: any) => state.JobPostingReducer)

  // Fetch job details when jobId changes
  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobPostingsById(jobId))
    } else {
      console.error('No jobId provided in URL parameters')
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetJobPostingByIdStatus())
    }
  }, [dispatch, jobId])

  // Render loading state
  if (isJobPostingByIdLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Typography>Loading job details...</Typography>
      </Box>
    )
  }

  // Render error state
  if (jobPostingByIdFailure) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Typography color='error'>{jobPostingByIdFailureMessage || 'Failed to load job details'}</Typography>
      </Box>
    )
  }

  // Render data if available
  if (!jobPostingByIdData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Typography>No job details available</Typography>
      </Box>
    )
  }

  const vacancy = jobPostingByIdData.data // Access the nested data from the API response

  return (
    <Box>
      <Paper elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 1 }}>
        <Box mb={4} className='space-y-2'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
              {vacancy.jobTitle || 'No Title'}
            </Typography>
          </Box>

          <Box>
            <Box className='mb-4 mt-2 p-6 border-primary rounded-lg bg-white' sx={{ margin: 'auto', borderRadius: 4 }}>
              <Typography variant='h6' color='text.primary'>
                Application Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <Typography variant='body2'>
                  Designation: <strong>{vacancy.designation || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Job Role: <strong>{vacancy.jobRole || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Grade: <strong>{vacancy.grade || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Openings: <strong>{vacancy.openings || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Campus/Lateral: <strong>{vacancy.campusOrLateral || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Employee Category: <strong>{vacancy.employeeCategory || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Employee Type: <strong>{vacancy.employeeType || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Hiring Manager: <strong>{vacancy.hiringManager || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Company: <strong>{vacancy.company || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Business Unit: <strong>{vacancy.businessUnit || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Department: <strong>{vacancy.department || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Starting Date: <strong>{vacancy.startingDate || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Closing Date: <strong>{vacancy.closingDate || 'N/A'}</strong>
                </Typography>
              </Box>
            </Box>

            <Box className='mb-4 mt-2 p-6 border-primary rounded-lg bg-white' sx={{ margin: 'auto', borderRadius: 4 }}>
              <Typography variant='h6' color='text.primary' gutterBottom>
                Location Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <Typography variant='body2'>
                  Territory: <strong>{vacancy.territory || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Region: <strong>{vacancy.region || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Area: <strong>{vacancy.area || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Cluster: <strong>{vacancy.cluster || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Branch: <strong>{vacancy.branch || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Branch Code: <strong>{vacancy.branchCode || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  City: <strong>{vacancy.city || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  State: <strong>{vacancy.state || 'N/A'}</strong>
                </Typography>
                <Typography variant='body2'>
                  Origin: <strong>{vacancy.origin || 'N/A'}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default JobVacancyView
