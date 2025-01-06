import * as React from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

interface DynamicCheckboxProps {
  id?: string
  name?: string
  label?: string
  checked?: boolean
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: () => void
}

const DynamicCheckbox: React.FC<DynamicCheckboxProps> = ({
  id,
  name,
  label,
  checked,
  required,
  disabled,
  icon,
  onChange,
  onFocus
}) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            name={name}
            checked={checked}
            disabled={disabled}
            icon={icon}
            onChange={onChange}
            onFocus={onFocus}
          />
        }
        label={label}
        required={required}
      />
    </FormGroup>
  )
}

export default DynamicCheckbox
