'use client'

import React, { useState } from 'react'

import { InputLabel, MenuItem } from '@mui/material'

import DynamicSelect from '@/components/Select/dynamicSelect'

function Page() {
  const [selectedValue, setSelectedValue] = useState<string | number>('')

  const options = [
    { value: 10, label: 'Ten' },
    { value: 20, label: 'Twenty' },
    { value: 30, label: 'Thirty' }
  ]

  const handleSelectChange = (value: string | number) => {
    console.log('Selected value:', value)
    setSelectedValue(value)
  }

  return (
    <div>
      <InputLabel>Select Age</InputLabel>
      <DynamicSelect
        id='age-select'
        name='age'
        label='Age'
        value={selectedValue}
        onChange={e => handleSelectChange(e.target.value)}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </DynamicSelect>
    </div>
  )
}

export default Page
