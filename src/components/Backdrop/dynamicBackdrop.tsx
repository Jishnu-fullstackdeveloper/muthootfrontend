import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'

interface DynamicBackdropProps {
  message?: string
}

const DynamicBackdrop: React.FC<DynamicBackdropProps> = ({ message }) => {
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <div>
      <Button onClick={handleOpen}>Show backdrop</Button>
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={open} onClick={handleClose}>
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color='inherit' />
          {message && <p>{message}</p>}
        </div>
      </Backdrop>
    </div>
  )
}

export default DynamicBackdrop
