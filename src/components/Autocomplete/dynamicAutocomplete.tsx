import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

interface dynamicAutocompleteProps {
  label: string
  options: { name: any }[]
  value: any
  onOptionSelect?: (option: { name: string } | null) => void
  sx: any
  PopperComponent?: any
  ListboxProps?: any
  renderInput?: any
}

const DynamicAutocomplete = ({
  label,
  options,
  onOptionSelect,
  sx,
  PopperComponent = '',
  ListboxProps = ''
}: dynamicAutocompleteProps) => {
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option: { name: string }) => option.name}
      onChange={(_, value) => onOptionSelect?.(value)}
      sx={sx}
      renderInput={params => <TextField {...params} label={label} />}
      PopperComponent={PopperComponent}
    />
  )
}

export default DynamicAutocomplete
