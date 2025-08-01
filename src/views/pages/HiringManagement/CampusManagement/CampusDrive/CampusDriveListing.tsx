'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, TextField, InputAdornment } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CampusDriveGridView from './CampusDriveCard'
import CampusDriveTableView from './CampusDriveTable'
import DynamicButton from '@/components/Button/dynamicButton'

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

const CampusDriveListingPage = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [visibleDrives, setVisibleDrives] = useState<CampusDrive[]>(campusDrivesData)

  // Filter drives based on search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearch(value)

    const filteredDrives = campusDrivesData.filter(
      drive =>
        drive.job_role.toLowerCase().includes(value.toLowerCase()) ||
        drive.college.toLowerCase().includes(value.toLowerCase()) ||
        drive.college_coordinator.toLowerCase().includes(value.toLowerCase())
    )

    setVisibleDrives(filteredDrives)
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
              Campus Drive
            </Typography>
          </Box>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-between', mt: 1, zIndex: 1100 }}>
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
              onClick={() => router.push(`/hiring-management/campus-management/campus-drive/add/new`)}
            >
              Add Campus Drive
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
        <CampusDriveGridView drives={visibleDrives} />
      ) : (
        <CampusDriveTableView drives={visibleDrives} />
      )}
    </Box>
  )
}

// Sample data for campus drives
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
  },
  {
    id: '2',
    job_role: 'Data Analyst',
    drive_date: '2025-09-10',
    expected_candidates: 30,
    status: 'Active',
    college: 'XYZ University',
    college_coordinator: 'Jane Smith',
    invite_status: 'Pending',
    response_status: 'Not Responded',
    spoc_notified_at: '2025-07-29T09:00:00Z',
    remarks: 'Awaiting confirmation from SPOC'
  },
  {
    id: '3',
    job_role: 'Product Manager',
    drive_date: '2025-10-05',
    expected_candidates: 20,
    status: 'Inactive',
    college: 'PQR Institute',
    college_coordinator: 'Alice Johnson',
    invite_status: 'Failed',
    response_status: 'Not Interested',
    spoc_notified_at: '2025-07-29T11:00:00Z',
    remarks: 'Rescheduling required'
  }
]

export default CampusDriveListingPage
