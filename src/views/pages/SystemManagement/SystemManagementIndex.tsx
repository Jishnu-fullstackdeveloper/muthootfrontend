'use client'
import React from 'react'

import { usePathname } from 'next/navigation'
import XFactor from './XFactor'

// import AddOrEditUser from '@/form/generatedForms/addNewUser' // Update this import path to match your project structure

const SystemManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[2] // Will be 'add', 'edit', or 'view'
  const settings = segments[3] // Will be the ID if present

  return <>
  
  {(mode === 'add' || (mode === 'edit' && settings))}
  {mode === 'view' && <XFactor />}
  </>
}

export default SystemManagementIndex


