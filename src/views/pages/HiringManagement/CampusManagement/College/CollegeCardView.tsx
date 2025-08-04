'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface CollegeGridViewProps {
  colleges: {
    universityAffiliation: string
    collegeType: string
    collegeCode: string
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
  }[]
}

const CollegeGridView = ({ colleges }: CollegeGridViewProps) => {
  const router = useRouter()

  return (
    <Box className='py-2 mt-2'>
      <Box className='grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-2 gap-2'>
        {colleges.map(college => (
          <Box key={college.id} className='xs:12 sm:6 md:4'>
            <Box className="p-3 gap-[16px] w-full bg-white shadow-[0px_6.84894px_12.1759px_rgba(208,210,218,0.15)] rounded-[10px] font-['Public_Sans',_Roboto,_sans-serif] h-full">
              <Box className='flex flex-col gap-2 h-full'>
                <Box className='flex justify-between items-center p-[0_0_10px] gap-2 border-b border-[#eee]'>
                  <Box className='flex flex-row items-center p-0 gap-2 h-[48px]'>
                    <Box className='flex justify-center items-center w-[38px] h-[38px] bg-[#F2F3FF] rounded-full'>
                      <SchoolOutlinedIcon className='w-6 h-6' />
                    </Box>
                    <Box className=''>
                      <Typography className="font-['Public_Sans',_Roboto,_sans-serif] whitespace-nowrap font-bold text-[12px] leading-[19px] text-[#23262F]">
                        {college.collegeName}
                      </Typography>
                      <Typography variant='body1'>
                        <strong>{college.collegeCode}</strong>
                      </Typography>
                    </Box>
                  </Box>
                  <Box className='flex items-center'>
                    <Tooltip title='Edit College'>
                      <IconButton
                        onClick={() => {
                          const queryParams = new URLSearchParams()

                          Object.entries(college).forEach(([key, value]) => {
                            if (value !== null && value !== undefined) {
                              if (Array.isArray(value)) {
                                value.forEach(item => queryParams.append(key, item))
                              } else {
                                queryParams.set(key, String(value))
                              }
                            }
                          })
                          router.push(
                            `/hiring-management/campus-management/college/edit/${college.id}?${queryParams.toString()}`
                          )
                        }}
                        aria-label={`Edit ${college.name}`}
                        sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete College'>
                      <IconButton
                        onClick={() => console.log(`Delete college ${college.id}`)} // Placeholder for delete logic
                        aria-label={`Delete ${college.name}`}
                        sx={{ color: 'grey', '&:hover': { color: '#007BB8' } }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      College Type
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.collegeType}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      University Affilation
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.universityAffiliation}
                    </Typography>
                  </Box>
                </Box>
                <Box className='flex flex-row items-center p-0 gap-0 h-[48px]'>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      SPOC Name
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.spoc_name}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col items-start p-0 gap-2 w-[250px] h-[38px]'>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-normal text-[12px] leading-[14px] text-[#5E6E78]">
                      SPOC Designation
                    </Typography>
                    <Typography className="font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#23262F]">
                      {college.spoc_designation}
                    </Typography>
                  </Box>
                </Box>
                <button
                  className="flex justify-center items-center p-[5px_10px] bg-white cursor-pointer border border-[#0096DA] rounded-[8px] font-['Public_Sans',_Roboto,_sans-serif] font-medium text-[14px] leading-[16px] text-[#0096DA] hover:border-[#007BB8] hover:bg-[rgba(0,150,218,0.05)]"
                  onClick={() => {
                    router.push(`/hiring-management/campus-management/college/view/detail-?id=${college.id}`)
                  }}
                  aria-label={`View details for ${college.name}`}
                >
                  View Details
                </button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CollegeGridView
