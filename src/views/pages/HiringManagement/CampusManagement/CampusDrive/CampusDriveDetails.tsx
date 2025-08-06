'use client'
import React, { useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Box, Typography, Divider, Chip, Grid, Paper, Avatar, Stack, Button } from '@mui/material'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CommentIcon from '@mui/icons-material/Comment'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchCollegeDriveById } from '@/redux/CampusManagement/campusDriveSlice'

interface CampusDrive {
  id: string
  job_role: string
  drive_date: string
  expected_candidates: number
  status: 'Active' | 'Inactive' | 'Completed' | 'Planned' | 'Ongoing' | 'Cancelled'
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

  // Define status colors for consistency
  const statusColors = {
    Active: '#4CAF50',
    Inactive: '#FF9800',
    Completed: '#2196F3',
    Planned: '#4CAF50', // Align with Active for consistency
    Ongoing: '#00CED1',
    Cancelled: '#F44336',
    Sent: '#4CAF50',
    Pending: '#FF9800',
    Failed: '#F44336',
    Interested: '#4CAF50',
    NotInterested: '#F44336',
    NotResponded: '#9E9E9E'
  }

  return (
    <Box
      className="p-4 md:p-7 max-w-6xl mx-auto font-['Public_Sans',_Roboto,_sans-serif]"
      sx={{ boxShadow: 1, bgcolor: '#F3F3F3', borderRadius: 2 }}
    >
      {/* Header Section */}
      <Box className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-gradient-to-r from-[#c3daf1] to-[#dae2f0] p-6 rounded-lg shadow-md'>
        <Box className='flex flex-row items-center gap-4'>
          <Avatar sx={{ bgcolor: '#F9F8F7', width: 45, height: 45, borderRadius: 2 }}>
            <WorkOutlineIcon sx={{ fontSize: 25, color: 'black' }} />
          </Avatar>
          <Box>
            <Box className='flex gap-3'>
              <Typography
                variant='h5'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[20px] leading-[34px] text-[#1E1E1E]"
              >
                {drive.job_role}
              </Typography>
              <Chip
                label={drive.status}
                size='small'
                sx={{
                  bgcolor: statusColors[drive.status],
                  color: '#fff',
                  fontFamily: 'Public Sans, Roboto, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  height: 20,
                  mt: 2.4
                }}
              />
            </Box>
            <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
              <Typography
                variant='body2'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[18px] text-[#616161]"
              >
                College: <strong>{drive.college}</strong>
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Button
          variant='contained'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            backgroundColor: '#1976D2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#1565C0'
            },
            textTransform: 'none',
            padding: '6px 16px'
          }}
          aria-label='Back to campus drive list'
        >
          Back to List
        </Button>
      </Box>

      <Divider className='my-8 border-gray-200' />

      {/* General Information */}
      <Typography
        variant='h5'
        className="font-['Public_Sans',_Roboto,_sans-serif] font-semibold text-[20px] leading-[26px] text-[#1E1E1E] mb-4"
      >
        General Information
      </Typography>
      <Grid container spacing={3} className='mb-8'>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              Job Role
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
            >
              {drive.job_role}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              Drive Date
            </Typography>
            <Box className='flex items-center gap-2'>
              <EventIcon sx={{ color: '#757575', fontSize: 20 }} />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
              >
                {new Date(drive.drive_date).toLocaleDateString('en-IN')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              Expected Candidates
            </Typography>
            <Box className='flex items-center gap-2'>
              <GroupIcon sx={{ color: '#757575', fontSize: 20 }} />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
              >
                {drive.expected_candidates}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              College
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
            >
              {drive.college}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              College Coordinator
            </Typography>
            <Box className='flex items-center gap-2'>
              <PersonOutlineIcon sx={{ color: '#757575', fontSize: 20 }} />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
              >
                {drive.college_coordinator}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider className='my-8 border-gray-200' />

      {/* Engagement Information */}
      <Typography
        variant='h5'
        className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[20px] leading-[26px] text-[#1E1E1E] mb-4"
      >
        College & SPOC Information
      </Typography>
      <Grid container spacing={3} className='mb-8'>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              Invite Status
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px]"
              sx={{ color: statusColors[drive.invite_status] }}
            >
              {drive.invite_status}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              Response Status
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px]"
              sx={{ color: statusColors[drive.response_status] }}
            >
              {drive.response_status}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              SPOC Notified At
            </Typography>
            <Box className='flex items-center gap-2'>
              <NotificationsIcon sx={{ color: '#757575', fontSize: 20 }} />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
              >
                {drive.spoc_notified_at ? new Date(drive.spoc_notified_at).toLocaleString('en-IN') : 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#F9FAFB', borderRadius: 2 }}>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[13px] leading-[18px] text-[#757575]"
            >
              Remarks
            </Typography>
            <Box className='flex items-center gap-2'>
              <CommentIcon sx={{ color: '#757575', fontSize: 20 }} />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[22px] text-[#1E1E1E]"
              >
                {drive.remarks || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Actions */}
      <Box className='mt-8 flex justify-end'>
        <Button
          variant='outlined'
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          onClick={() => router.back()}
          aria-label='Back to campus drive list'
        >
          Back
        </Button>
      </Box>
    </Box>
  )
}

// Wrapper component to fetch data dynamically
const CampusDriveDetailWrapper = () => {
  const dispatch = useAppDispatch()
  const { collegeDrive, collegeDriveStatus, collegeDriveError } = useAppSelector(state => state.campusDriveReducer)
  const { id } = useParams()

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchCollegeDriveById(id))
    }
  }, [dispatch, id])

  if (collegeDriveStatus === 'loading') {
    return <Typography>Loading...</Typography>
  }

  if (collegeDriveStatus === 'failed') {
    return <Typography color='error'>{collegeDriveError || 'Failed to fetch drive details'}</Typography>
  }

  if (!collegeDrive) {
    return <Typography>No drive data available</Typography>
  }

  return <CampusDriveDetails drive={collegeDrive} />
}

export default CampusDriveDetailWrapper
