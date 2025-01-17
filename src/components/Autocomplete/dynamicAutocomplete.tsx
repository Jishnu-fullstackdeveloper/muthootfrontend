import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'

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

// Styled Listbox for custom scrollbar
const StyledListbox = styled('ul')(({ theme }) => ({
  maxHeight: '150px', // Limit dropdown height
  overflowY: 'auto', // Enable vertical scrolling
  padding: 0, // Reset padding
  margin: 0, // Reset margin
  scrollbarWidth: 'thin', // Firefox scrollbar width
  '&::-webkit-scrollbar': {
    width: '8px' // Scrollbar width
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400], // Scrollbar thumb color
    borderRadius: theme.shape.borderRadius // Rounded corners
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.grey[500] // Thumb hover color
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[200] // Track color
  }
}))

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
      ListboxProps={{
        ...ListboxProps,
        component: StyledListbox // Use the styled Listbox
      }}
    />
  )
}

export default DynamicAutocomplete
