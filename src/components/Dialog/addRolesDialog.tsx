import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import DynamicTextField from '../TextField/dynamicTextField'
import DynamicSelect from '../Select/dynamicSelect'
import DynamicButton from '../Button/dynamicButton'

type CustomRoleProps = {
  open: boolean
  setOpen: (open: boolean) => void
  setSelectedRole: (filters: Record<string, any>) => void
  selectedFilters: Record<string, any>
  onApplyRoles: (selectedFilters: Record<string, any>) => void
  onAddRole: (newRole: Record<string, any>) => void // New prop
}

const CustomRoles = ({ open, setOpen, setSelectedRole, selectedFilters, onApplyRoles, onAddRole }: CustomRoleProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dropdownValue: ''
  })

  const handleFormSubmit = () => {
    setSelectedRole(formData) // Update the selected role in the parent
    setOpen(false) // Close the dialog
  }

  
return (
    <Dialog
      maxWidth='sm'
      scroll='body'
      open={open}
      onClose={() => setOpen(false)}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', width: '600px', padding: '16px' } }}
    >
      <DialogTitle variant='h5'>Add Roles</DialogTitle>
      <DialogContent>
        <form>
          <div className='grid grid-cols-1 gap-4'>
            <DynamicTextField
              label='Name'
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder='Enter name'
              variant='outlined'
            />

            <DynamicSelect
              value={formData.dropdownValue}
              onChange={e => setFormData(prev => ({ ...prev, dropdownValue: e.target.value }))}
              displayEmpty
            >
              <MenuItem value=''>Select a Role</MenuItem>
              <MenuItem value='Manager'>Manager</MenuItem>
              <MenuItem value='role2'>Role 2</MenuItem>
              <MenuItem value='role3'>Role 3</MenuItem>
            </DynamicSelect>

            <DynamicTextField
              label='Description'
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder='Enter description'
              variant='outlined'
            />
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <DynamicButton onClick={() => setOpen(false)}>Cancel</DynamicButton>
        <DynamicButton variant='contained' onClick={handleFormSubmit}>
          Submit Form
        </DynamicButton>
      </DialogActions>
    </Dialog>
  )
}

export default CustomRoles
