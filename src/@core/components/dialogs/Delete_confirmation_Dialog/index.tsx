'use client'

// MUI Imports
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'

// Type Definitions
type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (id?: string | number) => void // Updated to accept an optional `id`
  title?: string
  description?: string
  id?: string | number // Optional `id` to pass when confirming
}

const ConfirmModal = ({ open, onClose, onConfirm, title, description, id }: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm(id) // Pass the `id` if provided
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: '400px',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2
          }}
        >
          <i
            className='tabler-exclamation-circle'
            style={{
              fontSize: '100px',
              color: 'red'
            }}
          ></i>
        </Box>

        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant='h5' gutterBottom>
            {title || 'Are you sure?'}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            {description || "Do you really want to delete this data? This process can't be undone."}
          </Typography>
        </Box>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={onClose}
            sx={{
              padding: 1.5,
              marginX: 2,
              backgroundColor: '#757575',
              color: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#ffcccc',
                color: 'darkred'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm} // Use the local `handleConfirm` function
            sx={{
              padding: 1.5,
              marginX: 2,
              backgroundColor: '#e53935',
              color: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#ffcccc',
                color: 'darkred'
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  )
}

export default ConfirmModal
