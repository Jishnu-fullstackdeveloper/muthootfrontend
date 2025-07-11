'use client'
import React, { useState } from 'react'

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

import JobPostingCustomTable from './JobPostingCustomTable'

const bandOptions = ['Band 1', 'Band 2', 'Band 3']
const jobRole = ['HR', 'Manager', 'Sales Executive']
const employeeCategory = ['ABC']
const platformName = ['LinkedIn', 'Naukri']

const JobCustomizationPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    band: [],
    jobRole: [],
    employeeCategory: [],
    platformName: [],
    priority: '',
    platformAge: ''
  })

  const [customList, setCustomList] = useState<any[]>([])

  const handleChange = (field: string, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDrawerOpen = (data: any = null, index: number | null = null) => {
    if (data) {
      setFormData({
        band: data.band?.split(', ').filter(Boolean) || [],
        jobRole: data.jobRole?.split(', ').filter(Boolean) || [],
        employeeCategory: data.employeeCategory?.split(', ').filter(Boolean) || [],
        platformName: data.platformName?.split(', ').filter(Boolean) || [],
        priority: data.priority,
        platformAge: data.platformAge
      })
      setEditingIndex(index)
    } else {
      setFormData({
        band: [],
        jobRole: [],
        employeeCategory: [],
        platformName: [],
        priority: '',
        platformAge: ''
      })
      setEditingIndex(null)
    }

    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setEditingIndex(null)
  }

  const handleSubmit = () => {
    const newEntry = {
      band: formData.band.join(', '),
      jobRole: formData.jobRole.join(', '),
      employeeCategory: formData.employeeCategory.join(', '),
      platformName: formData.platformName.join(', '),
      priority: formData.priority,
      platformAge: formData.platformAge
    }

    if (editingIndex !== null) {
      const updatedList = [...customList]

      updatedList[editingIndex] = newEntry
      setCustomList(updatedList)
    } else {
      setCustomList(prev => [...prev, newEntry])
    }

    setFormData({
      band: [],
      jobRole: [],
      employeeCategory: [],
      platformName: [],
      priority: '',
      platformAge: ''
    })
    setEditingIndex(null)
    handleDrawerClose()
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
          <Button onClick={() => handleDrawerOpen()}>Add</Button>
        </Box>
      </Card>

      {/* Table with onEdit handler */}
      <JobPostingCustomTable data={customList} onEdit={(data, index) => handleDrawerOpen(data, index)} />

      {/* Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 350 } } }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {editingIndex !== null ? 'Edit' : 'Add'} Interview Customization
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Multi-select fields */}
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

            {/* Number Inputs */}
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
              {editingIndex !== null ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default JobCustomizationPage
