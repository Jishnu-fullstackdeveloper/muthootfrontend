import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

interface dynamicAutocompleteProps {
  label: string
  options: { name: string }[]
  onOptionSelect?: (option: { name: string } | null) => void
}

export default function dynamicAutocomplete({ label, options, onOptionSelect }: dynamicAutocompleteProps) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option: { name: string }) => option.name}
      onChange={(_, value) => onOptionSelect?.(value)}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label={label} />}
    />
  )
}
