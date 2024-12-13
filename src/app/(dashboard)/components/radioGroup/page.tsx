'use client'
import DynamicRadioGroup from '@/components/RadioGroup/dynamicRadioGroup'
import React from 'react'

function page() {
  const radioOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div>
      <DynamicRadioGroup label='Select your gender' radioOptions={radioOptions} />
    </div>
  )
}

export default page
