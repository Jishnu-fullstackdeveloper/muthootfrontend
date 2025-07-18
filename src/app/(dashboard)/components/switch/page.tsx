'use client'

import React from 'react'

import DynamicSwitch from '@/components/Switch/dynamicSwitch'

const Page: React.FC = () => {
  return (
    <div>
      <DynamicSwitch label='Label' defaultChecked={true} />
      <DynamicSwitch label='Required' required={true} />
      <DynamicSwitch label='Disabled' disabled={true} />
    </div>
  )
}

export default Page
