import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material'

import ModeEditIcon from '@mui/icons-material/ModeEdit'

import DynamicTabs from '@/components/Tab/dynamicTab'

import DynamicButton from '@/components/Button/dynamicButton'
import DynamicTextField from '@/components/TextField/dynamicTextField'

interface UserDetailsDialogProps {
  open: boolean
  onClose: () => void
  selectedRow: Record<string, any> | null
  headerMapping: Record<string, string>
  formatDate: (date: string | Date) => string
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onClose,
  selectedRow,
  headerMapping,
  formatDate
}) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    name: 'John Doe',
    userId: '12345',
    description: 'Admin privileges for managing users',
    privileges: ['Read', 'Write', 'Execute']
  })

  const allPrivileges = ['Read', 'Write', 'Execute', 'Delete']

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePrivilegeChange = (privilege: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      privileges: checked ? [...prev.privileges, privilege] : prev.privileges.filter(p => p !== privilege)
    }))
  }

  const handleSave = () => {
    setIsEditMode(false)
  }

  const tab2Content = (
    <div style={{ height: '300px', overflowY: 'auto' }}>
      {!isEditMode && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px'
          }}
        >
          <DynamicButton
            icon={<ModeEditIcon />}
            position='start'
            variant='outlined'
            color='secondary'
            onClick={() => setIsEditMode(true)}
            sx={{ width: '100px', height: '30px' }}
          >
            Edit
          </DynamicButton>
        </div>
      )}

      {isEditMode ? (
        <form
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography style={{ fontWeight: 'bold' }}>Name:</Typography>
            <DynamicTextField
              type='text'
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography style={{ fontWeight: 'bold' }}>User ID:</Typography>
            <DynamicTextField
              type='text'
              value={formData.userId}
              onChange={e => handleInputChange('userId', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <Typography style={{ fontWeight: 'bold' }}>Description:</Typography>
            <DynamicTextField
              type='text'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
            />
          </div>
          {/* Privileges field */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <Typography style={{ fontWeight: 'bold', marginBottom: '8px' }}>Privileges:</Typography>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allPrivileges.map(privilege => (
                <FormControlLabel
                  key={privilege}
                  control={
                    <Checkbox
                      checked={formData.privileges.includes(privilege)}
                      onChange={e => handlePrivilegeChange(privilege, e.target.checked)}
                    />
                  }
                  label={privilege}
                />
              ))}
            </div>
          </div>
        </form>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p>
              <strong>User ID:</strong> {formData.userId}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <p>
              <strong>Privileges:</strong> {formData.privileges.join(', ')}
            </p>
          </div>
        </div>
      )}

      {isEditMode && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '16px',
            gap: '8px'
          }}
        >
          <DynamicButton
            variant='outlined'
            size='small'
            color='secondary'
            onClick={() => setIsEditMode(false)}

            // sx={{ width: '100px', height: '30px' }}
          >
            Cancel
          </DynamicButton>
          <DynamicButton
            variant='contained'
            color='primary'
            size='small'
            onClick={handleSave}

            // sx={{ width: '100px', height: '30px' }}
          >
            Save
          </DynamicButton>
        </div>
      )}
    </div>
  )

  const tabs = [
    {
      id: 1,
      label: 'Basic Details',
      content: selectedRow ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            height: '300px',
            overflowY: 'auto'
          }}
        >
          {Object.entries(selectedRow)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) => {
              let formattedValue: string | null = null

              if (
                (key.includes('date') || key.toLowerCase().includes('at')) &&
                (typeof value === 'string' || value instanceof Date)
              ) {
                formattedValue = formatDate(value)
              } else {
                formattedValue = value ? value.toString() : 'N/A'
              }

              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{headerMapping[key] || key}</div>
                  <div>{formattedValue}</div>
                </div>
              )
            })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No details available</p>
      )
    },
    {
      id: 2,
      label: 'Details',
      content: tab2Content
    }
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>{selectedRow ? <DynamicTabs tabs={tabs} /> : <p>Loading...</p>}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDetailsDialog
