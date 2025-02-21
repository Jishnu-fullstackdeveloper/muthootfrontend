'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import AddOrEditUser from '@/form/generatedForms/addNewUser' // Update this import path to match your project structure

const UserManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[2] // Will be 'add', 'edit', or 'view'
  const id = segments[3] // Will be the ID if present

  return <>{(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditUser mode={mode} id={id} />}</>
}

export default UserManagementIndex
