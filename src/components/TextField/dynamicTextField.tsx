import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

interface FieldProps {
  id: string
  name?: string // Add the 'name' property here
  label?: string
  type?: string
  defaultValue?: string
  helperText?: string
  variant?: 'outlined' | 'filled' | 'standard'
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  multiline?: boolean
  error?: boolean
  value?: string | number
  rows?: number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  placeholder?: any
  className?: any
  style?: any
}

interface DynamicTextFieldProps extends FieldProps {}

export default function DynamicTextField({
  id,
  label,
  type = 'text',
  defaultValue,
  helperText,
  variant = 'outlined',
  required,
  disabled,
  readOnly,
  multiline,
  error,
  value,
  onChange,
  onFocus,
  rows,
  placeholder = '',
  className = '',
  style = {}
}: DynamicTextFieldProps) {
  return (
    <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
      <TextField
        style={style}
        key={id}
        id={id}
        label={label}
        type={type}
        defaultValue={defaultValue}
        helperText={helperText}
        variant={variant}
        required={required}
        disabled={disabled}
        multiline={multiline}
        error={error}
        value={value}
        rows={rows}
        onChange={onChange}
        onFocus={onFocus}
        InputProps={{
          readOnly: readOnly
        }}
        fullWidth
        placeholder
        className
      />
    </Box>
  )
}
