/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tooltip, Typography, TextField, InputAdornment, Autocomplete } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchCollegeDrives } from '@/redux/CampusManagement/campusDriveSlice'
import CampusDriveGridView from './CampusDriveCard'
import CampusDriveTableView from './CampusDriveTable'
import DynamicButton from '@/components/Button/dynamicButton'

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

const CampusDriveListingPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { collegeDrives, status, error, totalCount } = useAppSelector(state => state.campusDriveReducer)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')

  const [filters, setFilters] = useState({
    status: '',
    driveDate: ''
  })

  const [localPage, setLocalPage] = useState(1)
  const [localLimit, setLocalLimit] = useState(10)

  // Derive unique status options for filter
  const statusOptions = Array.from(new Set(collegeDrives.map(drive => drive.status))).sort()

  // Fetch drives on mount and when search, filters, or pagination change
  // useEffect(() => {
  //   const formatDriveDate = (date: string) => {
  //     if (!date) return undefined
  //     const [year, month, day] = date.split('-')

  //     return `${month}-${day}-${year.slice(2)}` // Convert YYYY-MM-DD to MM-DD-YY
  //   }

  //   dispatch(
  //     fetchCollegeDrives({
  //       page: localPage,
  //       limit: localLimit,
  //       search: search || undefined,
  //       driveStatus: filters.status || undefined,
  //       driveDate: formatDriveDate(filters.driveDate)
  //     })
  //   )
  // }, [dispatch, localPage, localLimit, search, filters.status, filters.driveDate])

  // Fetch drives on mount and when search, filters, or pagination change
  useEffect(() => {
    const formatDriveDate = (date: string) => {
      if (!date) return undefined
      const [year, month, day] = date.split('-')

      return `${month}-${day}-${year.slice(2)}` // Convert YYYY-MM-DD to MM-DD-YY
    }

    dispatch(
      fetchCollegeDrives({
        page: localPage, // Use one-based page for API
        limit: localLimit,
        search: search || undefined,
        driveStatus: filters.status || undefined,
        driveDate: formatDriveDate(filters.driveDate)
      })
    )
  }, [dispatch, localPage, localLimit, search, filters.status, filters.driveDate])

  // Filter drives based on search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearch(value)
    setLocalPage(1) // Reset to first page on search
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setLocalPage(1) // Reset to first page on filter change
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
              Campus Drive
            </Typography>
          </Box>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-between', mt: 2, zIndex: 1100 }}>
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
        <Box className='flex gap-2'>
          <Autocomplete
            options={statusOptions}
            value={filters.status}
            onChange={(event, newValue) => handleFilterChange('status', newValue || '')}
            renderInput={params => <TextField {...params} label='Drive Status' variant='outlined' size='small' />}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label='Drive Date'
            type='date'
            value={filters.driveDate}
            onChange={e => handleFilterChange('driveDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split('T')[0] // Set min date to today
            }}
            variant='outlined'
            size='small'
            sx={{ minWidth: 200 }}
            className="font-['Public_Sans',_Roboto,_sans-serif]"
          />
        </Box>
      </Box>

      <Box sx={{ justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        {status === 'loading' ? (
          <Typography>Loading...</Typography>
        ) : status === 'failed' ? (
          <Typography color='error'>{error || 'Failed to fetch campus drives'}</Typography>
        ) : collegeDrives.length === 0 ? (
          <Typography>No campus drives found</Typography>
        ) : viewMode === 'grid' ? (
          <CampusDriveGridView drives={collegeDrives} />
        ) : (
          <CampusDriveTableView
            drives={collegeDrives}
            totalCount={totalCount}
            page={localPage}
            limit={localLimit}
            setPage={setLocalPage}
            setLimit={setLocalLimit}
          />
        )}
      </Box>
    </Box>
  )
}

export default CampusDriveListingPage
