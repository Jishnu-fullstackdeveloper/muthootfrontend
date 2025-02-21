'use client'
import React, { useState } from 'react'

import DynamicAutocomplete from '@/components/Autocomplete/dynamicAutocomplete'

const allStates = [
  { name: 'Andhra Pradesh' },
  { name: 'Arunachal Pradesh' },
  { name: 'Assam' },
  { name: 'Bihar' },
  { name: 'Chhattisgarh' },
  { name: 'Goa' },
  { name: 'Gujarat' },
  { name: 'Haryana' },
  { name: 'Himachal Pradesh' },
  { name: 'Jharkhand' },
  { name: 'Karnataka' },
  { name: 'Kerala' },
  { name: 'Madhya Pradesh' },
  { name: 'Maharashtra' }
]

const keralaDistricts = [
  { name: 'Thiruvananthapuram' },
  { name: 'Kollam' },
  { name: 'Pathanamthitta' },
  { name: 'Alappuzha' },
  { name: 'Kottayam' },
  { name: 'Idukki' },
  { name: 'Ernakulam' },
  { name: 'Thrissur' },
  { name: 'Palakkad' },
  { name: 'Malappuram' },
  { name: 'Kozhikode' },
  { name: 'Kannur' },
  { name: 'Kasaragod' }
]

const sampleDistricts = [{ name: 'District 1' }, { name: 'District 2' }, { name: 'District 3' }]

function Page() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [districts, setDistricts] = useState(sampleDistricts)

  const handleStateChange = (state: { name: string } | null) => {
    setSelectedState(state?.name || null)

    if (state?.name === 'Kerala') {
      setDistricts(keralaDistricts)
    } else {
      setDistricts(sampleDistricts)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <DynamicAutocomplete
        label='State'
        options={allStates}
        onOptionSelect={option => handleStateChange(option)}
        sx={{}}
      />
      <DynamicAutocomplete label='District' options={districts} sx={{}} />
    </div>
  )
}

export default Page
