import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { SxProps, Theme } from '@mui/material/styles'
import { InputProps as MuiInputProps } from '@mui/material/Input'

interface FieldProps {
  id?: string
  name?: string
  label?: string
  type?: string
  defaultValue?: string
  helperText?: string
  variant?: 'outlined' | 'filled' | 'standard'
  required?: boolean
  size?: 'small' | 'medium'
  disabled?: boolean
  readOnly?: boolean
  multiline?: boolean
  error?: boolean
  value?: string | number
  rows?: number
  placeholder?: string
  sx?: SxProps<Theme>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  InputProps?: MuiInputProps // Add InputProps here
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
  placeholder,
  sx,
  size,
  InputProps // Destructure InputProps
}: DynamicTextFieldProps) {
  return (
    <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
      <TextField
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
        size={size}
        rows={rows}
        sx={sx}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        InputProps={InputProps} // Pass InputProps here
        fullWidth
      />
    </Box>
  )
}
