'use client'
import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, TextField, InputAdornment, Autocomplete } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { ToastContainer } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import 'react-toastify/dist/ReactToastify.css'
import { fetchCollegeCoordinators } from '@/redux/CampusManagement/collegeAndSpocSlice'
import CollegeGridView from './CollegeCardView'
import CollegeTableView from './CollegeTableView'
import DynamicButton from '@/components/Button/dynamicButton'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const dispatch = useAppDispatch()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [filters, setFilters] = useState({
    engagementType: '',
    status: '',
    isPrimary: '',
    collegeId: ''
  })

  const { colleges, totalCount, status } = useAppSelector((state: any) => state.collegeAndSpocReducer)

  useEffect(() => {
    // Initial fetch with no filters to load all data
    dispatch(
      fetchCollegeCoordinators({
        page,
        limit,
        search
      })
    )
  }, [dispatch, page, limit, search])

  // Apply filters only when changed or reset when both are cleared
  useEffect(() => {
    if (filters.engagementType || filters.status) {
      dispatch(
        fetchCollegeCoordinators({
          page,
          limit,
          search,
          engagementType: filters.engagementType || undefined,
          status: filters.status || undefined,
          isPrimary: filters.isPrimary,
          collegeId: filters.collegeId
        })
      )
    } else if (!filters.engagementType && !filters.status) {
      // Reset to fetch all data when both filters are cleared
      dispatch(
        fetchCollegeCoordinators({
          page,
          limit,
          search,
          isPrimary: '',
          collegeId: ''
        })
      )
    }
  }, [dispatch, page, limit, search, filters.engagementType, filters.status])

  // Filter colleges based on search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearch(value)
    setPage(1) // Reset to first page on search
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page on filter change
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
            <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 2 }}>
              College & SPOC
            </Typography>
          </Box>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-between', mt: 1, zIndex: 1100 }}>
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

      {/* New Autocomplete Filters */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          bgcolor: '#FFFFFF',
          borderRadius: 1
        }}
      >
        <TextField
          label='Search'
          variant='outlined'
          size='small'
          value={search}
          onChange={handleSearch}
          sx={{ width: '300px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <i className='tabler-search text-xxl' />
              </InputAdornment>
            )
          }}
        />
        <Box className='flex gap-2 '>
          <Autocomplete
            options={['Webinar', 'Drive', 'Talk', 'None']}
            value={filters.engagementType}
            onChange={(event, newValue) => handleFilterChange('engagementType', newValue || '')}
            renderInput={params => <TextField {...params} label='Engagement Type' variant='outlined' size='small' />}
            sx={{ minWidth: 200 }}
          />
          <Autocomplete
            options={['Active', 'Inactive', 'Blocked']}
            value={filters.status}
            onChange={(event, newValue) => handleFilterChange('status', newValue || '')}
            renderInput={params => <TextField {...params} label='Status' variant='outlined' size='small' />}
            sx={{ minWidth: 200 }}
          />
        </Box>
      </Box>

      <Box sx={{ justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        {status === 'loading' ? (
          <Typography>Loading...</Typography>
        ) : status === 'failed' ? (
          <Typography>No Data Found</Typography>
        ) : viewMode === 'grid' ? (
          <CollegeGridView colleges={colleges} />
        ) : (
          <CollegeTableView
            colleges={colleges}
            totalCount={totalCount}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Box>
    </Box>
  )
}

export default CollegeListingPage
