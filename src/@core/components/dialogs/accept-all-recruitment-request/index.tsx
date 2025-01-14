'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Tooltip, Box } from '@mui/material'

// Type Imports
import { toast } from 'react-toastify'

// Component Imports
import 'react-toastify/dist/ReactToastify.css'

type WarningDialogProps = {
  open: boolean
  tooltipText: string
  headingText: string
  descriptionText: string
  warningCount: number
  confirmButtonText: string
  cancelButtonText: string
  onConfirm: () => void
  onCancel: () => void
}

const WarningDialog = ({
  open,
  tooltipText,
  headingText,
  descriptionText,
  warningCount,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel
}: WarningDialogProps) => {
  return (
    <Dialog
      maxWidth='sm'
      open={true}
      onClose={onCancel}
      sx={{
        '& .MuiDialog-paper': { overflow: 'visible' },
        '& .MuiTypography-root': { color: warningCount > 5 ? '#ff4c51' : '#ff9800' }
      }}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='h5'>{headingText}</Typography>
          <Tooltip title={tooltipText}>
            <i className='tabler-info-circle text-md'></i>
          </Tooltip>
        </Box>
      </DialogTitle>

      <Typography variant='body1' sx={{ padding: '0 24px' }}>
        {descriptionText}
        <br />
        <strong>Warnings: {warningCount}</strong>
      </Typography>

      <DialogActions sx={{ p: 3 }}>
        <Button variant='outlined' onClick={onConfirm} className='capitalize'>
          {confirmButtonText}
        </Button>

        <Button
          variant='contained'
          style={{ background: warningCount > 5 ? '#ff4c51' : '#ff9800' }}
          onClick={onCancel}
          className='capitalize'
        >
          {cancelButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WarningDialog
