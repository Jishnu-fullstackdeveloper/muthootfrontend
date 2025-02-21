import * as React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface DynamicDialogProps {
  open: boolean
  handleClickOpen: () => void
  handleClose: () => void
  dialogTitle: string
  dialogDescription: string
  dialogActions: React.ReactNode
}

export default function DynamicDialog({
  open,
  handleClickOpen,
  handleClose,
  dialogTitle,
  dialogDescription,
  dialogActions
}: DynamicDialogProps) {
  return (
    <React.Fragment>
      <Button variant='outlined' onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{dialogDescription}</DialogContentText>
        </DialogContent>
        <DialogActions>{dialogActions}</DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
