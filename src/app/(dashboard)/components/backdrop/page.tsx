'use client'
import React, { useState } from 'react'
import { Button } from '@mui/material'
import DynamicBackdrop from '@/components/Backdrop/dynamicBackdrop'

function Page() {
  const [backdropMessage, setBackdropMessage] = useState('Loading, please wait...')

  return (
    <div>
      <DynamicBackdrop message={backdropMessage} />
    </div>
  )
}

export default Page
