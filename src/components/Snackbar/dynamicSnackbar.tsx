import * as React from 'react'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { SnackbarOrigin } from '@mui/material/Snackbar';
import Snackbar from '@mui/material/Snackbar'

interface State extends SnackbarOrigin {
  open: boolean
}

interface DynamicSnackbarProps {
  message: string
  buttonData: { label: string; position: SnackbarOrigin }[]
}

export default function DynamicSnackbar({ message, buttonData }: DynamicSnackbarProps) {
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  })

  const { vertical, horizontal, open } = state

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, open: true })
  }

  const handleClose = () => {
    setState(prevState => ({ ...prevState, open: false }))
  }

  const buttons = buttonData.map((button, index) => (
    <Grid item xs={6} key={index}>
      <Button onClick={handleClick(button.position)}>{button.label}</Button>
    </Grid>
  ))

  return (
    <Box sx={{ width: 500 }}>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        {buttons}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={message}
        key={`${vertical}-${horizontal}`}
      />
    </Box>
  )
}
