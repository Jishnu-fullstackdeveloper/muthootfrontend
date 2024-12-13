import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

interface RadioOption {
  value: string
  label: string
}

interface DynamicRadioGroupProps {
  label: string
  radioOptions: RadioOption[]
}

const DynamicRadioGroup: React.FC<DynamicRadioGroupProps> = ({ label, radioOptions }) => {
  return (
    <FormControl>
      <FormLabel id='demo-radio-buttons-group-label'>{label}</FormLabel>
      <RadioGroup
        aria-labelledby='demo-row-radio-buttons-group-label'
        defaultValue={radioOptions[0]?.value}
        name='row-radio-buttons-group'
      >
        {radioOptions.map(option => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default DynamicRadioGroup
