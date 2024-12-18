import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import DynamicTextField from '../TextField/dynamicTextField'
import DynamicSelect from '../Select/dynamicSelect'
import DynamicButton from '../Button/dynamicButton'

type CustomRoleProps = {
  open: boolean
  setOpen: (open: boolean) => void
  setSelectedRole: (filters: Record<string, any>) => void
  selectedFilters: Record<string, any>
  onApplyRoles: (selectedFilters: Record<string, any>) => void
}

const CustomRoles = ({ open, setOpen, setSelectedRole, selectedFilters, onApplyRoles }: CustomRoleProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dropdownValue: ''
  })

  const dropdownOptions = [
    { label: 'Role 1', value: 'role1' },
    { label: 'Role 2', value: 'role2' },
    { label: 'Role 3', value: 'role3' }
  ]

  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedRole((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFormInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, dropdownValue: event.target.value }))
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleApplyFilters = () => {
    onApplyRoles(selectedFilters)
    setOpen(false)
  }

  const handleFormSubmit = () => {
    console.log('Form Data Submitted:', formData)
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
      <DialogTitle variant='h5'>Add Roles</DialogTitle>
      <DialogContent>
        <form>
          <div className='grid grid-cols-1 gap-4'>
            <DynamicTextField
              label='Name'
              value={formData.name}
              onChange={handleFormInputChange('name')}
              placeholder='Enter name'
              variant='outlined'
            />
            <DynamicTextField
              label='Description'
              value={formData.description}
              onChange={handleFormInputChange('description')}
              placeholder='Enter description'
              variant='outlined'
            />
            <DynamicSelect value={formData.dropdownValue} onChange={handleDropdownChange} displayEmpty>
              <MenuItem value=''>Select a Role</MenuItem>
              {dropdownOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </DynamicSelect>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <DynamicButton onClick={handleClose}>Cancel</DynamicButton>
        <DynamicButton variant='contained' onClick={handleFormSubmit}>
          Submit Form
        </DynamicButton>
      </DialogActions>
    </Dialog>
  )
}

export default CustomRoles
