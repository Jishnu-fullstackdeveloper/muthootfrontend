'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, Button, Divider, Chip, Grid } from '@mui/material'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CommentIcon from '@mui/icons-material/Comment'

interface CampusDrive {
  id: string
  job_role: string
  drive_date: string
  expected_candidates: number
  status: 'Active' | 'Inactive' | 'Completed'
  college: string
  college_coordinator: string
  invite_status: 'Pending' | 'Sent' | 'Failed'
  response_status: 'Not Responded' | 'Interested' | 'Not Interested'
  spoc_notified_at: string
  remarks: string
}

interface CampusDriveDetailsProps {
  drive: CampusDrive
}

const CampusDriveDetails = ({ drive }: CampusDriveDetailsProps) => {
  const router = useRouter()

  return (
    <Box className="p-4 md:p-8 max-w-5xl mx-auto bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif]">
      {/* Header Section */}
      <Box className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <Box className='flex flex-row items-center gap-3'>
          <Box className='flex justify-center items-center w-12 h-12 bg-[#F2F3FF] rounded-full'>
            <WorkOutlineIcon className='w-6 h-6 text-[#23262F]' />
          </Box>
          <Box>
            <Typography
              variant='h5'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[20px] leading-[26px] text-[#23262F]"
            >
              {drive.job_role}
            </Typography>
            <Box className='flex items-center gap-2 mt-1'>
              <Typography
                variant='body2'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[18px] text-[#5E6E78]"
              >
                College: <strong>{drive.college}</strong>
              </Typography>
              <Chip
                label={drive.status}
                size='small'
                sx={{
                  bgcolor: drive.status === 'Active' ? '#00B798' : drive.status === 'Inactive' ? '#ED960B' : '#00CED1',
                  color: '#fff',
                  fontFamily: 'Public Sans, Roboto, sans-serif',
                  fontSize: '12px'
                }}
              />
            </Box>
          </Box>
        </Box>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          aria-label='Back to campus drive list'
        >
          Back to List
        </Button>
      </Box>

      <Divider className='my-6 border-[#eee]' />

      {/* General Information */}
      <Typography
        variant='h6'
        className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
      >
        General Information
      </Typography>
      <Grid container spacing={4} className='mb-6'>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Job Role
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {drive.job_role}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Drive Date
            </Typography>
            <Box className='flex items-center gap-2'>
              <EventIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {new Date(drive.drive_date).toLocaleDateString('en-IN')}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Expected Candidates
            </Typography>
            <Box className='flex items-center gap-2'>
              <GroupIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {drive.expected_candidates}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              College
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {drive.college}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              College Coordinator
            </Typography>
            <Box className='flex items-center gap-2'>
              <PersonOutlineIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {drive.college_coordinator}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider className='my-6 border-[#eee]' />

      {/* Engagement Information */}
      <Typography
        variant='h6'
        className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
      >
        College & SPOC Information
      </Typography>
      <Grid container spacing={4} className='mb-6'>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Invite Status
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px]"
              sx={{
                color:
                  drive.invite_status === 'Sent' ? '#00B798' : drive.invite_status === 'Pending' ? '#ED960B' : '#FF4500'
              }}
            >
              {drive.invite_status}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Response Status
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px]"
              sx={{
                color:
                  drive.response_status === 'Interested'
                    ? '#00B798'
                    : drive.response_status === 'Not Interested'
                      ? '#FF4500'
                      : '#5E6E78'
              }}
            >
              {drive.response_status}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              SPOC Notified At
            </Typography>
            <Box className='flex items-center gap-2'>
              <NotificationsIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {new Date(drive.spoc_notified_at).toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Remarks
            </Typography>
            <Box className='flex items-center gap-2'>
              <CommentIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {drive.remarks || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Actions */}
      {/* <Box className='mt-8 flex justify-end'>
        <Button
          variant='outlined'
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          onClick={() => router.back()}
          aria-label='Back to campus drive list'
        >
          Back
        </Button>
      </Box> */}
    </Box>
  )
}

// Sample data for demonstration
const campusDrivesData: CampusDrive[] = [
  {
    id: '1',
    job_role: 'Software Engineer',
    drive_date: '2025-08-15',
    expected_candidates: 50,
    status: 'Active',
    college: 'ABC College',
    college_coordinator: 'John Doe',
    invite_status: 'Sent',
    response_status: 'Interested',
    spoc_notified_at: '2025-07-28T15:30:00Z',
    remarks: 'Drive scheduled for final-year students'
  }
]

// Wrapper component to pass sample data (for demonstration)
const CampusDriveDetailWrapper = () => {
  const drive = campusDrivesData[0] // Use the first drive from the data

  return <CampusDriveDetails drive={drive} />
}

export default CampusDriveDetailWrapper
