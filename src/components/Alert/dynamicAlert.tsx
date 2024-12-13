import React from 'react'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

interface DynamicAlertProps {
  severity?: 'success' | 'info' | 'warning' | 'error'
  message?: string
  variant?: 'filled'
  icon?: React.ReactNode
}

export default function DynamicAlert({ severity, message, variant, icon }: DynamicAlertProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={severity} variant={variant} icon={icon || undefined}>
        {message}
      </Alert>
    </Stack>
  )
}
