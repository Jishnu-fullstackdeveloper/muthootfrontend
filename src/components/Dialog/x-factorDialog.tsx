import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Slider, Typography } from '@mui/material'

type XFactorDialogProps = {
  open: boolean
  onClose: () => void
  onSave: (xFactor: number) => void
  currentXFactor: number
}

const XFactorDialog: React.FC<XFactorDialogProps> = ({ open, onClose, onSave, currentXFactor }) => {
  const [xFactor, setXFactor] = useState(currentXFactor)

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setXFactor(newValue as number)
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    // Check if the value is a valid number and does not start with 0
    if (value && parseInt(value, 10) > 0 && !value.startsWith('0')) {
      setXFactor(parseInt(value, 10))
    }
  }

  const handleSave = () => {
    onSave(xFactor)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Select X-Factor Value</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Select the number of past working days to include in the resignation report. The value should be between 1 and
          30.
        </Typography>

        <Slider
          value={xFactor}
          min={1}
          max={30}
          step={1}
          marks
          valueLabelDisplay='auto'
          onChange={handleSliderChange}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label='X-Factor Value'
          type='number'
          value={xFactor}
          onChange={handleTextFieldChange}
          inputProps={{ min: 1, max: 30 }}
          fullWidth
          autoComplete='off'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary' variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default XFactorDialog
