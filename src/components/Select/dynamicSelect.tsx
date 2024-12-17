import * as React from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'

interface DynamicSelectProps {
  id?: string
  name?: string
  label?: string
  value: string | number
  onChange: (e: SelectChangeEvent) => void
  error?: boolean
  helperText?: string
  children?: React.ReactNode
  required?: boolean
  onFocus?: React.FocusEventHandler<HTMLInputElement>
}

export default function DynamicSelect({
  id,
  name,
  label,
  value,
  onChange,
  onFocus,
  error,
  helperText,
  children
}: DynamicSelectProps) {
  return (
    <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
      <FormControl fullWidth error={error}>
        <Select
          labelId={`${id}-label`}
          id={id}
          error={error}
          name={name}
          value={String(value)}
          onChange={onChange}
          onFocus={onFocus}
          fullWidth
        >
          {children}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  )
}
