'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, TextField, InputAdornment } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CollegeGridView from './CollegeCardView'
import CollegeTableView from './CollegeTableView'
import DynamicButton from '@/components/Button/dynamicButton'

interface College {
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

const CollegeListingPage = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [visibleColleges, setVisibleColleges] = useState<College[]>(collegesData)

  // Filter colleges based on search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearch(value)

    const filteredColleges = collegesData.filter(
      college =>
        college.name.toLowerCase().includes(value.toLowerCase()) ||
        college.college_code.toLowerCase().includes(value.toLowerCase()) ||
        college.location.toLowerCase().includes(value.toLowerCase())
    )

    setVisibleColleges(filteredColleges)
  }

  return (
    <Box>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
              College Data List
            </Typography>
          </Box>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-between', mt: 3, zIndex: 1100 }}>
            <TextField
              label='Search'
              variant='outlined'
              size='small'
              value={search}
              onChange={handleSearch}
              sx={{ width: '300px', mt: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
            <DynamicButton
              variant='contained'
              color='primary'
              onClick={() => router.push(`/hiring-management/campus-management/college/add/new`)}
            >
              Add College
            </DynamicButton>
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

      {viewMode === 'grid' ? (
        <CollegeGridView colleges={visibleColleges} />
      ) : (
        <CollegeTableView colleges={visibleColleges} />
      )}
    </Box>
  )
}

// Sample data as an array of objects
const collegesData: College[] = [
  {
    id: '1',
    name: 'ABC College',
    college_code: 'COL001',
    university_affiliation: 'University of Example',
    college_type: 'Private',
    location: 'City Center',
    district: 'District A',
    pin_code: '123456',
    full_address: '123 Main St, City Center, District A',
    website_url: 'https://www.abccollege.edu',
    spoc_name: 'John Doe',
    spoc_designation: 'Placement Coordinator',
    spoc_email: 'john.doe@abccollege.edu',
    spoc_alt_email: 'jdoe@abccollege.edu',
    spoc_mobile: '+91-9876543210',
    spoc_alt_phone: '+91-9876543211',
    spoc_linkedin: 'https://linkedin.com/in/johndoe',
    spoc_whatsapp: '+91-9876543212',
    last_visited_date: '2025-07-01',
    last_engagement_type: 'Campus Visit',
    last_feedback: 'Positive response',
    preferred_drive_months: ['August', 'September'],
    remarks: 'Good infrastructure',
    created_by: 'admin1',
    created_at: '2025-06-15T10:00:00Z',
    updated_by: 'admin2',
    updated_at: '2025-07-28T15:30:00Z',
    status: 'Active'
  },
  {
    id: '2',
    name: 'XYZ University',
    college_code: 'COL002',
    university_affiliation: 'XYZ University',
    college_type: 'Public',
    location: 'Downtown',
    district: 'District B',
    pin_code: '654321',
    full_address: '456 Oak Ave, Downtown, District B',
    website_url: 'https://www.xyzuniversity.edu',
    spoc_name: 'Jane Smith',
    spoc_designation: 'Career Counselor',
    spoc_email: 'jane.smith@xyzuniversity.edu',
    spoc_alt_email: 'jsmith@xyzuniversity.edu',
    spoc_mobile: '+91-8765432109',
    spoc_alt_phone: '+91-8765432110',
    spoc_linkedin: 'https://linkedin.com/in/janesmith',
    spoc_whatsapp: '+91-8765432111',
    last_visited_date: '2025-07-10',
    last_engagement_type: 'Virtual Meet',
    last_feedback: 'Needs follow-up',
    preferred_drive_months: ['October', 'November'],
    remarks: 'Large student base',
    created_by: 'admin3',
    created_at: '2025-06-20T12:00:00Z',
    updated_by: 'admin4',
    updated_at: '2025-07-29T09:00:00Z',
    status: 'Active'
  },
  {
    id: '3',
    name: 'PQR Institute',
    college_code: 'COL003',
    university_affiliation: 'Institute of Technology',
    college_type: 'Government',
    location: 'Suburb',
    district: 'District C',
    pin_code: '789012',
    full_address: '789 Pine Rd, Suburb, District C',
    website_url: 'https://www.pqrinstitute.edu',
    spoc_name: 'Alice Johnson',
    spoc_designation: 'Training Head',
    spoc_email: 'alice.johnson@pqrinstitute.edu',
    spoc_alt_email: 'ajohnson@pqrinstitute.edu',
    spoc_mobile: '+91-7654321098',
    spoc_alt_phone: '+91-7654321099',
    spoc_linkedin: 'https://linkedin.com/in/alicejohnson',
    spoc_whatsapp: '+91-7654321100',
    last_visited_date: '2025-07-05',
    last_engagement_type: 'Workshop',
    last_feedback: 'Very cooperative',
    preferred_drive_months: ['December', 'January'],
    remarks: 'Excellent faculty',
    created_by: 'admin5',
    created_at: '2025-06-25T14:00:00Z',
    updated_by: 'admin6',
    updated_at: '2025-07-29T11:00:00Z',
    status: 'Active'
  }
]

export default CollegeListingPage
