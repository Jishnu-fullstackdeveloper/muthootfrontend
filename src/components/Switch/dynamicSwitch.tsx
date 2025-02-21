import * as React from 'react'

import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

interface DynamicSwitchProps {
  label: string
  defaultChecked?: boolean
  required?: boolean
  disabled?: boolean
}

export default function DynamicSwitch({ label, defaultChecked, required, disabled }: DynamicSwitchProps) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch defaultChecked={defaultChecked} required={required} disabled={disabled} />}
        label={label}
      />
    </FormGroup>
  )
}
