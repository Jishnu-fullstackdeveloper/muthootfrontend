'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Tooltip } from '@mui/material'

// Type Imports
import { toast } from 'react-toastify'

// Component Imports
import 'react-toastify/dist/ReactToastify.css'
import custom_theme_settings from '@/utils/custom_theme_settings.json'

type delete_props = {
  open: boolean
  tooltipText: string
  HeadingText: string
  setOpen: (open: boolean) => void
  setAcceptAllConfirmed: React.Dispatch<React.SetStateAction<boolean>>
}

const ConfirmAcceptAllDialog = ({ open, setOpen, setAcceptAllConfirmed, tooltipText, HeadingText }: delete_props) => {
  return (
    <>
      <Dialog

        // fullWidth
        maxWidth='md'
        scroll='body'
        open={open}
        onClose={() => setOpen(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        {/* <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton> */}

        <DialogTitle className='flex gap-1 flex-col text-left'>
          <div className='flex gap-1 items-center'>
            <Typography variant='h5'> {HeadingText ? HeadingText : 'Accept All Requests'}</Typography>

            <Tooltip title={tooltipText} placement='right-start'>
              <i className='tabler-info-circle text-md'></i>
            </Tooltip>
          </div>

          <Typography variant='body1' className='flex flex-col text-left' pr={10}>
            Are you sure you want accept all requests?
            <br />
          </Typography>
        </DialogTitle>

        <DialogActions className=' pbs-0 flex justify-end' sx={{ p: 3 }}>
          <Button
            variant='outlined'

            // style={{ background: '#ff4c51' }}
            onClick={() => setOpen(false)}
            type='submit'
            className='capitalize'
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={() => setAcceptAllConfirmed(true)} className='capitalize'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmAcceptAllDialog
