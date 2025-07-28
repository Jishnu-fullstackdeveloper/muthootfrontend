'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  TextField,
  InputAdornment,
  Button,
  Drawer,
  Typography,
  Divider,
  Autocomplete,
  ListItemText
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchJobPostingCustomList,
  createBandPlatformMapping,
  updateBandPlatformMapping,
  fetchBandList,
  fetchJobRole,
  fetchEmployeeCategory,
  fetchPlatform
} from '@/redux/JobPosting/jobPostingCustomizationSlice'
import JobPostingCustomTable from './JobPostingCustomTable'

interface FlattenedJobPosting {
  id: string
  band: string
  jobRole: string
  employeeCategory: string
  platformName: string
  priority: number
  platformAge: number
}

const JobCustomizationPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { jobPostingCustomListData, fetchBandData, fetchJobRoleData, fetchEmployeeCategoryData, fetchPlatformData } =
    useAppSelector((state: any) => state.JobPostingCustomizationReducer)

  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    band: '',
    jobRole: '',
    employeeCategory: '',
    platformName: '',
    priority: '',
    platformAge: ''
  })

  useEffect(() => {
    dispatch(fetchJobPostingCustomList({ page: 1, limit: 10, search: searchQuery }))
    dispatch(fetchBandList({ page: 1, limit: 100 }))
    dispatch(fetchJobRole({ page: 1, limit: 100 }))
    dispatch(fetchEmployeeCategory({ page: 1, limit: 100 }))
    dispatch(fetchPlatform({ page: 1, limit: 100 }))
  }, [dispatch, searchQuery])

  // Remove the useEffect that automatically opens the Drawer on refresh
  // Instead, handle Drawer opening only via handleDrawerOpen

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDrawerOpen = (row?: FlattenedJobPosting) => {
    if (row) {
      // Edit mode: populate form with row data and update URL
      setIsEditMode(true)
      setSelectedId(row.id)
      setFormData({
        band: row.band,
        jobRole: row.jobRole,
        employeeCategory: row.employeeCategory,
        platformName: row.platformName,
        priority: row.priority.toString(),
        platformAge: row.platformAge.toString()
      })

      const query = new URLSearchParams({
        id: row.id,
        band: row.band,
        jobRole: row.jobRole,
        employeeCategory: row.employeeCategory,
        platformName: row.platformName,
        priority: row.priority.toString(),
        platformAge: row.platformAge.toString()
      }).toString()

      router.push(`?${query}`)
    } else {
      // Add mode: clear form and URL
      setIsEditMode(false)
      setSelectedId(null)
      setFormData({
        band: '',
        jobRole: '',
        employeeCategory: '',
        platformName: '',
        priority: '',
        platformAge: ''
      })
      router.push('')
    }

    setDrawerOpen(true) // Open Drawer only when explicitly triggered
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setIsEditMode(false)
    setSelectedId(null)
    setFormData({
      band: '',
      jobRole: '',
      employeeCategory: '',
      platformName: '',
      priority: '',
      platformAge: ''
    })
    router.push('') // Clear query parameters
  }

  const handleSubmit = async () => {
    const payload = {
      band: formData.band,
      jobRole: formData.jobRole,
      employeeCategory: formData.employeeCategory,
      platformDetails: [
        {
          platformName: formData.platformName,
          priority: parseInt(formData.priority) || 0,
          platformAge: parseInt(formData.platformAge) || 0
        }
      ]
    }

    try {
      if (isEditMode && selectedId) {
        await dispatch(updateBandPlatformMapping({ id: selectedId, ...payload })).unwrap()
      } else {
        await dispatch(createBandPlatformMapping(payload)).unwrap()
      }

      await dispatch(fetchJobPostingCustomList({ page: 1, limit: 10, search: searchQuery }))
      handleDrawerClose()
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }

  const handleNumberInput = (field: string, value: string) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <>
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-4 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap mt-2'>
            <TextField
              label='Search Customization'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ width: '400px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Button
            onClick={() => handleDrawerOpen()}
            variant='contained'
            sx={{ backgroundColor: '#0096DA', '&:hover': { backgroundColor: '#007BB8' } }}
          >
            Add
          </Button>
        </Box>
      </Card>

      <JobPostingCustomTable data={jobPostingCustomListData || []} onEdit={handleDrawerOpen} />

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 350 } } }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {isEditMode ? 'Edit' : 'Add'} Job Posting Customization
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'band', options: fetchBandData?.map((band: any) => band.name) || [] },
              { label: 'jobRole', options: fetchJobRoleData?.map((role: any) => role.name) || [] },
              { label: 'employeeCategory', options: fetchEmployeeCategoryData?.map((cat: any) => cat.name) || [] },
              { label: 'platformName', options: fetchPlatformData?.map((plat: any) => plat.name) || [] }
            ].map(({ label, options }) => (
              <Autocomplete
                key={label}
                options={options}
                value={formData[label] || ''}
                onChange={(event, newValue) => handleChange(label, newValue || '')}
                getOptionLabel={option => option}
                renderInput={params => (
                  <TextField {...params} variant='outlined' size='small' placeholder={`Select ${label}`} />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <ListItemText primary={<Typography variant='body2'>{option}</Typography>} />
                  </li>
                )}
                sx={{ width: '100%' }}
              />
            ))}

            <TextField
              label='Priority'
              type='number'
              size='small'
              value={formData.priority}
              onChange={e => handleNumberInput('priority', e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ width: '100%' }}
            />

            <TextField
              label='Platform Age'
              type='number'
              size='small'
              value={formData.platformAge}
              onChange={e => handleNumberInput('platformAge', e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ width: '100%' }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={handleDrawerClose} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleSubmit} color='primary' variant='contained'>
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default JobCustomizationPage
