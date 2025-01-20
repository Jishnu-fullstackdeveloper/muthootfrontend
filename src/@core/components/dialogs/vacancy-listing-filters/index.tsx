// Vacancy Management Filters Page

'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Slider from '@mui/material/Slider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Box, InputLabel, FormControl } from '@mui/material'

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
    <Dialog
      maxWidth='sm'
      scroll='body'
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', width: '600px', padding: '16px' } }}
    >
      <DialogTitle variant='h5'>Customize Vacancy Filters</DialogTitle>
      <DialogContent>
        {Object.entries(filterData).map(([category, options]) => (
          <Box key={category} className='mb-4'>
            <Typography variant='subtitle1' className='font-medium mb-2'>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
            <FormGroup>
              {options.map(option => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(selectedFilters[category] as string[])?.includes(option) || false}
                      onChange={() => handleCheckboxChange(category, option)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </Box>
        ))}

        <Box className='mb-4'>
          <Typography variant='subtitle1' className='font-medium mb-2'>
            Salary Range Per Month (in thousands)
          </Typography>
          <Slider
            value={selectedFilters.salaryRange as number[]}
            onChange={handleSliderChange}
            valueLabelDisplay='auto'
            min={0}
            max={100000}
            step={5000}
          />
        </Box>

        <Box className='mb-4'>
          <Typography variant='subtitle1' className='font-medium mb-2'>
            Job Role
          </Typography>
          <FormControl fullWidth>
            <Select
              labelId='job-role-label'
              id='job-role'
              value={selectedFilters.jobRole}
              onChange={handleSelectChange}
            >
              <MenuItem value=''>Select Job Role</MenuItem>
              <MenuItem value='Software Engineer'>Software Engineer</MenuItem>
              <MenuItem value='Data Analyst'>Data Analyst</MenuItem>
              <MenuItem value='Project Manager'>Project Manager</MenuItem>
              <MenuItem value='Marketing Specialist'>Marketing Specialist</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Box>
          <Button variant='outlined' color='secondary' onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button variant='contained' color='primary' onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default VacancyManagementFilters
