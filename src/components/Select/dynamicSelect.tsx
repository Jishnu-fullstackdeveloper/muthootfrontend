import React from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'

interface DynamicSelectProps {
  id?: string
  name?: string
  label?: string
  value: any
  onChange: (e: SelectChangeEvent) => void
  error?: boolean
  helperText?: string
  children?: React.ReactNode
  required?: boolean
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  displayEmpty?: boolean
}

export default function DynamicSelect({
  id,
  name,
  value, // Default value to avoid undefined during SSR
  onChange,
  onFocus,
  error,
  helperText,
  children,
  displayEmpty = false,
}: DynamicSelectProps) {
  return (
    <Box sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
      <FormControl fullWidth error={error}>
        <Select
          labelId={`${id}-label`}
          id={id}
          name={name}
          value={value} // Ensure value is never undefined
          onChange={onChange}
          onFocus={onFocus}
          fullWidth
          displayEmpty={displayEmpty}
        >
          {children}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  )
}
