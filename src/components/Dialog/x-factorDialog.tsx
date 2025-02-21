import React, { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slider,
  Typography,
  FormHelperText
} from '@mui/material'

type XFactorDialogProps = {
  open: boolean
  onClose: () => void
  onSave: (xFactor: number) => void
  currentXFactor: number
}

const XFactorDialog: React.FC<XFactorDialogProps> = ({ open, onClose, onSave, currentXFactor }) => {
  const [xFactor, setXFactor] = useState<string>('') // Start with an empty value
  const [error, setError] = useState<string>('')
  const [warning, setWarning] = useState<string>('') // Separate state for warnings
  const [touched, setTouched] = useState<boolean>(false)

  useEffect(() => {
    setXFactor('') // Clear the value each time the dialog opens
    setTouched(false) // Reset touched state
    setError('') // Clear errors
    setWarning('') // Clear warnings
  }, [open])

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number

    setXFactor(value.toString())
    setError('')
    setWarning('')
    setTouched(true)
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setXFactor(value)
    setTouched(true)

    if (value === '') {
      setWarning('Value cannot be empty') // Show warning in yellow
      setError('') // Clear error
    } else if (parseInt(value, 10) === 0) {
      setError('Value cannot be zero') // Show error in red
      setWarning('') // Clear warning
    } else if (parseInt(value, 10) > 30) {
      setError('Value cannot be greater than 30') // Show error in red
      setWarning('') // Clear warning
    } else {
      setError('')
      setWarning('')
    }
  }

  const handleSave = () => {
    const numericValue = parseInt(xFactor, 10)

    if (numericValue >= 1 && numericValue <= 30) {
      onSave(numericValue)
      onClose()
    } else {
      setError('Please enter a valid value between 1 and 30')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Select Data Transform Days</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Select the number of past working days to include in the resignation report. The value should be between 1 and
          30.
        </Typography>
        <Slider
          value={xFactor ? Math.min(Math.max(parseInt(xFactor, 10), 1), 30) : 1}
          min={1}
          max={30}
          step={1}
          marks
          valueLabelDisplay='auto'
          onChange={handleSliderChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label='Number of Days'
          type='number'
          value={xFactor}
          onChange={handleTextFieldChange}
          inputProps={{ min: 1, max: 30 }}
          fullWidth
          autoComplete='off'
          error={!!error} // Show red border if there's an error
        />
        {warning && <FormHelperText style={{ color: 'orange' }}>{warning}</FormHelperText>} {/* Yellow warning */}
        {error && <FormHelperText error>{error}</FormHelperText>} {/* Red error */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary' variant='contained' disabled={!!error || warning !== ''}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default XFactorDialog
