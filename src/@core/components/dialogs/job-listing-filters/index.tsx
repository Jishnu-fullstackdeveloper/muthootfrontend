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
type JobListingFiltersProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onApplyFilters: (selectedFilters: Record<string, string[] | number[] | string>) => void
}

// Filter Data Example
const filterData = {
  jobType: ['Remote', 'On-site', 'Hybrid'],
  experience: ['Fresher', '1-3 years', '3+ years'],
  education: ['High School', "Bachelor's Degree", "Master's Degree", 'PhD'],
  skills: ['JavaScript', 'React', 'Python', 'SQL', 'Java', 'Project Management']
}

const JobListingCustomFilters = ({ open, setOpen, onApplyFilters }: JobListingFiltersProps) => {
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[] | number[] | string>>({
    location: [],
    jobType: [],
    experience: [],
    salaryRange: [0, 10000], // Default salary range
    education: [],
    skills: [],
    jobRole: '' // Single select
  })

  // Handle checkbox change
  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = (prev[category] as string[]) || []
      const updatedFilters = categoryFilters.includes(value)
        ? categoryFilters.filter(item => item !== value)
        : [...categoryFilters, value]
      return { ...prev, [category]: updatedFilters }
    })
  }

  // Handle slider change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      salaryRange: newValue as number[]
    }))
  }

  // Handle select change
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedFilters(prev => ({
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
    onApplyFilters(selectedFilters)
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
      <DialogTitle variant='h5'>Customize Job Filters</DialogTitle>
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
          <FormControl fullWidth>
            <InputLabel id='job-role-label'>Job Role</InputLabel>
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
        <Button variant='contained' color='primary' onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default JobListingCustomFilters
