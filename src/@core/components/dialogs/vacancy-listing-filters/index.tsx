// Vacancy Management Filters Page

'use client'

// React Imports
// import { useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import CloseIcon from '@mui/icons-material/Close'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton'

// import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Slider from '@mui/material/Slider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Box, FormControl } from '@mui/material' //InputLabel

// Type Imports
type VacancyFiltersProps = {
  open: boolean
  setOpen: (open: boolean) => void
  setSelectedFilters: any
  selectedFilters: any
  setAppliedFilters: any
  handleResetFilters: any
}

// Filter Data Example
const filterData = {
  location: ['Remote', 'On-site', 'Hybrid'],
  department: ['IT', 'HR', 'Marketing', 'Finance'],
  employmentType: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  experience: ['Fresher', '1-3 years', '3+ years'],
  skills: ['JavaScript', 'Python', 'SQL', 'React', 'Leadership']
}

const VacancyManagementFilters = ({
  open,
  setOpen,
  setSelectedFilters,
  selectedFilters,
  setAppliedFilters,
  handleResetFilters
}: VacancyFiltersProps) => {
  // Handle checkbox change
  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedFilters((prev: { [x: string]: string[] }) => {
      const categoryFilters = (prev[category] as string[]) || []

      const updatedFilters = categoryFilters.includes(value)
        ? categoryFilters.filter(item => item !== value)
        : [...categoryFilters, value]

      return { ...prev, [category]: updatedFilters }
    })
  }

  // Handle slider change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSelectedFilters((prev: any) => ({
      ...prev,
      salaryRange: newValue as number[]
    }))
  }

  // Handle select change
  const handleSelectChange = (event: any) => {
    setSelectedFilters((prev: any) => ({
      ...prev,
      jobRole: event.target.value as string
    }))
  }

  // Handle dialog close
  const handleClose = () => {
    setOpen(false)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    setAppliedFilters(selectedFilters)
    setOpen(false)
  }

  return (
    <Drawer
      anchor='left'
      open={open}
      onClose={handleClose}
      variant='temporary' // Changed to temporary to handle outside clicks
      BackdropProps={{
        invisible: true, // Show backdrop for click handling
        sx: { backgroundColor: 'transparent' } // Make backdrop transparent
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: '260px',
          backgroundColor: 'background.paper',
          marginTop: '64px',
          height: 'calc(100% - 64px)',
          overflow: 'auto',
          borderRight: 'none',
          boxShadow: 'none',
          zIndex: 1200 // Increased zIndex to appear above vertical menu
        },
        zIndex: 1200 // Increased drawer zIndex
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant='h6'>Filters</Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Category Filters */}
          {Object.entries(filterData).map(([category, options]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant='subtitle2' sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                {category}
              </Typography>
              <FormGroup>
                {options.map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        size='small'
                        checked={(selectedFilters[category] as string[])?.includes(option) || false}
                        onChange={() => handleCheckboxChange(category, option)}
                      />
                    }
                    label={<Typography variant='body2'>{option}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}

          {/* Salary Range */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='subtitle2' sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 600 }}>
              Salary Range
            </Typography>
            <Slider
              value={selectedFilters.salaryRange as number[]}
              onChange={handleSliderChange}
              valueLabelDisplay='auto'
              min={0}
              max={100000}
              step={5000}
              sx={{ width: '90%', ml: 1 }}
            />
          </Box>

          {/* Job Role */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='subtitle2' sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 600 }}>
              Job Role
            </Typography>
            <FormControl fullWidth size='small'>
              <Select
                labelId='job-role-label'
                id='job-role'
                value={selectedFilters.jobRole}
                onChange={handleSelectChange}
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value=''>Select Role</MenuItem>
                <MenuItem value='Software Engineer'>Software Engineer</MenuItem>
                <MenuItem value='Data Analyst'>Data Analyst</MenuItem>
                <MenuItem value='Project Manager'>Project Manager</MenuItem>
                <MenuItem value='Marketing Specialist'>Marketing Specialist</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <IconButton onClick={handleClose} size='small' color='secondary' title='Cancel'>
              <CloseIcon />
            </IconButton>
            <IconButton onClick={handleResetFilters} size='small' color='secondary' title='Reset Filters'>
              <RestartAltIcon />
            </IconButton>
            <IconButton
              onClick={handleApplyFilters}
              size='small'
              color='primary'
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              title='Apply Filters'
            >
              <CheckIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default VacancyManagementFilters
