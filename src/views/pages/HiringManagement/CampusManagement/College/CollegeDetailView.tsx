'use client'
import React, { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, Typography, Button, Divider, Chip, Grid } from '@mui/material'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EventIcon from '@mui/icons-material/Event'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchCollegeCoordinators } from '@/redux/CampusManagement/collegeAndSpocSlice'

interface College {
  collegeCode: string
  universityAffiliation: string
  collegeType: string
  pinCode: string
  websiteUrl: string
  fullAddress: string
  collegeName: string
  id: string
  name: string
  college_code: string
  university_affiliation: string
  college_type: string
  location: string
  district: string
  pin_code: string
  full_address: string
  website_url: string
  spoc_name: string
  spoc_designation: string
  spoc_email: string
  spoc_alt_email: string
  spoc_mobile: string
  spoc_alt_phone: string
  spoc_linkedin: string
  spoc_whatsapp: string
  last_visited_date: string
  last_engagement_type: string
  last_feedback: string
  preferred_drive_months: string[]
  remarks: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
  status: 'Active' | 'Inactive' | 'Blocked'
}

interface CollegeDetailProps {
  college: College
}

const CollegeDetails = ({ college }: CollegeDetailProps) => {
  const router = useRouter()

  return (
    <Box className="p-4 md:p-8 max-w-5xl mx-auto bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[14px] font-['Public_Sans',_Roboto,_sans-serif]">
      {/* Header Section */}
      <Box className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <Box className='flex flex-row items-center gap-3'>
          <Box className='flex justify-center items-center w-[48px] h-[48px] bg-[#F2F3FF] rounded-full'>
            <SchoolOutlinedIcon className='w-8 h-8 text-[#23262F]' />
          </Box>
          <Box>
            <Box className='flex gap-2'>
              <Typography
                variant='h5'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[20px] leading-[26px] text-[#23262F]"
              >
                {college.collegeName}
              </Typography>
              <Chip
                label={college.status}
                size='small'
                color={college.status === 'Active' ? 'success' : college.status === 'Inactive' ? 'warning' : 'error'}
                className="font-['Public_Sans',_Roboto,_sans-serif] text-[12px]"
              />
            </Box>
            <Box className='flex items-center gap-2 mt-1'>
              <Typography
                variant='body2'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[18px] text-[#5E6E78]"
              >
                <strong>{college.collegeCode}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          aria-label='Back to college list'
        >
          Back to List
        </Button>
      </Box>
      <Divider className='mb-6 border-[#eee]' />
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
              University Affiliation
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.universityAffiliation}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              College Type
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.collegeType}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Location
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.location}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              District
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.district}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Pin Code
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.pinCode}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Website URL
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#0096DA] hover:underline"
              component='a'
              href={college.websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {college.websiteUrl}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Full Address
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.fullAddress}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider className='my-6 border-[#eee]' />
      {/* SPOC Information */}
      <Typography
        variant='h6'
        className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
      >
        SPOC Information
      </Typography>
      <Grid container spacing={4} className='mb-6'>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Name
            </Typography>
            <Box className='flex items-center gap-2'>
              <PersonOutlineIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {college.spoc_name}
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
              Designation
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.spoc_designation}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Email
            </Typography>
            <Box className='flex items-center gap-2'>
              <EmailIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#0096DA] hover:underline"
                component='a'
                href={`mailto:${college.spoc_email}`}
              >
                {college.spoc_email}
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
              Alternate Email
            </Typography>
            <Box className='flex items-center gap-2'>
              <EmailIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#0096DA] hover:underline"
                component='a'
                href={`mailto:${college.spoc_alt_email}`}
              >
                {college.spoc_alt_email || 'N/A'}
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
              Mobile
            </Typography>
            <Box className='flex items-center gap-2'>
              <PhoneIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {college.spoc_mobile}
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
              Alternate Phone
            </Typography>
            <Box className='flex items-center gap-2'>
              <PhoneIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {college.spoc_alt_phone || 'N/A'}
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
              LinkedIn
            </Typography>
            <Box className='flex items-center gap-2'>
              <LinkedInIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#0096DA] hover:underline"
                component='a'
                href={college.spoc_linkedin}
                target='_blank'
                rel='noopener noreferrer'
              >
                {college.spoc_linkedin || 'N/A'}
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
              WhatsApp
            </Typography>
            <Box className='flex items-center gap-2'>
              <WhatsAppIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {college.spoc_whatsapp || 'N/A'}
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
        Engagement Information
      </Typography>
      <Grid container spacing={4} className='mb-6'>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Last Visited Date
            </Typography>
            <Box className='flex items-center gap-2'>
              <EventIcon className='text-[#5E6E78] w-5 h-5' />
              <Typography
                variant='body1'
                className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
              >
                {college.last_visited_date || 'N/A'}
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
              Last Engagement Type
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.last_engagement_type || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Last Feedback
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.last_feedback || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        {/* <Grid item xs={12}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Preferred Drive Months
            </Typography>
            <Box className='flex flex-wrap gap-2'>
              {college.preferred_drive_months.length > 0 ? (
                college.preferred_drive_months.map((month, index) => (
                  <Chip
                    key={index}
                    label={month}
                    size='small'
                    className="font-['Public_Sans',_Roboto,_sans-serif] text-[12px] bg-[#F2F3FF] text-[#23262F]"
                  />
                ))
              ) : (
                <Typography
                  variant='body1'
                  className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
                >
                  N/A
                </Typography>
              )}
            </Box>
          </Box>
        </Grid> */}
        <Grid item xs={12}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Remarks
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.remarks || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider className='my-6 border-[#eee]' />
      {/* Audit Information */}
      {/* <Typography
        variant='h6'
        className="font-['Public_Sans',_Roboto,_sans-serif] font-bold text-[16px] leading-[20px] text-[#23262F] mb-4"
      >
        Audit Information
      </Typography> */}
      {/* <Grid container spacing={4} className='mb-6'>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Created By
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.created_by || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Created At
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.created_at || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Updated By
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.updated_by || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className='flex flex-col gap-1'>
            <Typography
              variant='body2'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]"
            >
              Updated At
            </Typography>
            <Typography
              variant='body1'
              className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[16px] leading-[20px] text-[#23262F]"
            >
              {college.updated_at || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      </Grid> */}
      {/* Footer Actions */}
      <Box className='mt-8 flex justify-end'>
        <Button
          variant='outlined'
          className='border-[#0096DA] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]'
          onClick={() => router.back()}
          aria-label='Back to college list'
        >
          Back
        </Button>
      </Box>
    </Box>
  )
}

// Wrapper component to fetch college data dynamically
const CollegeDetailWrapper = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const dispatch = useAppDispatch()

  const { colleges, status, error } = useAppSelector((state: any) => state.collegeAndSpocReducer)

  useEffect(() => {
    if (id) {
      dispatch(
        fetchCollegeCoordinators({
          page: 1,
          limit: 1,
          collegeId: id as string
        })
      )
    }
  }, [dispatch, id])

  if (status === 'loading') {
    return (
      <Box className='flex justify-center items-center h-screen'>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (status === 'failed' || !colleges[0]) {
    return (
      <Box className='flex justify-center items-center h-screen'>
        <Typography>{error || 'College not found'}</Typography>
      </Box>
    )
  }

  return <CollegeDetails college={colleges[0]} />
}

export default CollegeDetailWrapper
