import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { FormControl } from '@mui/material'
import { useEffect, useState } from 'react'
import { filterData } from '@/shared/filterData'

type JobListingFiltersProps = {
  open: boolean
  setOpen: (open: boolean) => void
  setSelectedFilters: (filters: Record<string, any>) => void
  selectedFilters: Record<string, any>
  onApplyFilters: (selectedFilters: Record<string, any>) => void // Ensure onApplyFilters is included in the props
}

const JobListingCustomFilters = ({
  open,
  setOpen,
  setSelectedFilters,
  selectedFilters,
  onApplyFilters
}: JobListingFiltersProps) => {
  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedFilters((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters) // Apply the filters and pass them to the parent
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
      <DialogTitle variant='h5'>Customize Filters</DialogTitle>
      <DialogContent>
        <div className='grid grid-cols-2 gap-4'>
          {filterData[0].fields.map(({ field, id, options }) => (
            <div key={id}>
              <Typography variant='subtitle1' className='font-medium mb-2'>
                {field}
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  labelId={`${id}-label`}
                  id={id}
                  value={selectedFilters[id] || ''}
                  onChange={handleSelectChange(id)}
                >
                  {options.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleApplyFilters} color='primary' variant='contained'>
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default JobListingCustomFilters
