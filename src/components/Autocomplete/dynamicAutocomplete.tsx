import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

interface dynamicAutocompleteProps {
  label: string
  options: { name: any }[]
  value: any
  onOptionSelect?: (option: { name: string } | null) => void
  sx: any
}

const DynamicAutocomplete = ({ label, options, onOptionSelect, sx }: dynamicAutocompleteProps) => {
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option: { name: string }) => option.name}
      onChange={(_, value) => onOptionSelect?.(value)}
      sx={sx}
      renderInput={params => <TextField {...params} label={label} />}
    />
  )
}

export default DynamicAutocomplete
