'use client'

import React, { useState, useEffect } from 'react'

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
  updateBandPlatformMapping
} from '@/redux/JobPosting/jobPostingCustomizationSlice'

import JobPostingCustomTable from './JobPostingCustomTable'

const bandOptions = ['Band 1', 'Band 2', 'Band 3']
const jobRole = ['HR', 'Manager', 'Sales Executive']
const employeeCategory = ['ABC']
const platformName = ['LinkedIn', 'Naukri']

const JobCustomizationPage = () => {
  const dispatch = useAppDispatch()

  const {
    jobPostingCustomListData,
    isJobPostingCustomListLoading,
    jobPostingCustomListFailure,
    jobPostingCustomListFailureMessage
  } = useAppSelector((state: any) => state.JobPostingCustomizationReducer)

  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    band: [],
    jobRole: [],
    employeeCategory: [],
    platformName: [],
    priority: '',
    platformAge: ''
  })

  useEffect(() => {
    dispatch(fetchJobPostingCustomList({ page: 1, limit: 10, search: searchQuery }))
  }, [dispatch, searchQuery])

  const handleChange = (field: string, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDrawerOpen = (id?: string) => {
    if (id) {
      setIsEditMode(true)
      setSelectedId(id)

      // Fetch specific data for edit if needed (using fetchBandPlatformMappingById)
      // For now, assume data is available in jobPostingCustomListData
      const item = jobPostingCustomListData?.find((item: any) => item.id === id)

      if (item) {
        setFormData({
          band: item.band.split(', ') || [],
          jobRole: item.jobRole.split(', ') || [],
          employeeCategory: item.employeeCategory.split(', ') || [],
          platformName: item.platformName.split(', ') || [],
          priority: item.priority || '',
          platformAge: item.platformAge || ''
        })
      }
    } else {
      setIsEditMode(false)
      setSelectedId(null)
      setFormData({
        band: [],
        jobRole: [],
        employeeCategory: [],
        platformName: [],
        priority: '',
        platformAge: ''
      })
    }

    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setIsEditMode(false)
    setSelectedId(null)
  }

  const handleSubmit = () => {
    const payload = {
      band: formData.band.join(', '),
      jobRole: formData.jobRole.join(', '),
      employeeCategory: formData.employeeCategory.join(', '),
      platformDetails: formData.platformName.map((name, index) => ({
        platformName: name,
        priority: parseInt(formData.priority) || 0,
        platformAge: parseInt(formData.platformAge) || 0
      }))
    }

    if (isEditMode && selectedId) {
      dispatch(updateBandPlatformMapping({ id: selectedId, ...payload }))
    } else {
      dispatch(createBandPlatformMapping(payload))
    }

    handleDrawerClose()
  }

  console.log('Job Posting Custom List Data:', jobPostingCustomListData)

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

      {/* Table */}
      <JobPostingCustomTable data={jobPostingCustomListData || []} onEdit={handleDrawerOpen} />

      {/* Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 350 } } }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {isEditMode ? 'Edit' : 'Add'} Interview Customization
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'band', options: bandOptions },
              { label: 'jobRole', options: jobRole },
              { label: 'employeeCategory', options: employeeCategory },
              { label: 'platformName', options: platformName }
            ].map(({ label, options }) => (
              <Autocomplete
                key={label}
                multiple
                options={['Select All', ...options]}
                value={formData[label] || []}
                onChange={(event, newValue) => {
                  const filtered = newValue.filter(v => v !== 'Select All')

                  if (newValue.includes('Select All')) {
                    handleChange(label, options.every(opt => formData[label]?.includes(opt)) ? [] : [...options])
                  } else {
                    handleChange(label, filtered)
                  }
                }}
                getOptionLabel={option => option}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant='outlined'
                    size='small'
                    placeholder={formData[label]?.length === 0 ? `Select ${label}` : formData[label]?.join(', ')}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <ListItemText
                      primary={
                        <Typography variant='body2'>
                          {option === 'Select All' ? option : `${selected ? '✔ ' : ''}${option}`}
                        </Typography>
                      }
                    />
                  </li>
                )}
                renderTags={() => null}
                sx={{ width: '100%' }}
              />
            ))}

            <TextField
              label='Priority'
              type='number'
              size='small'
              value={formData.priority}
              onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              sx={{ width: '100%' }}
            />

            <TextField
              label='Platform Age'
              type='number'
              size='small'
              value={formData.platformAge}
              onChange={e => setFormData(prev => ({ ...prev, platformAge: e.target.value }))}
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
