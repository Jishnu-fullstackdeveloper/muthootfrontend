'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import AddOrEditUser from '@/form/generatedForms/addNewUser' 

const UserManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[2] 
  const id = segments[3] 

  return <>{(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditUser mode={mode} id={id} />}</>
}

export default UserManagementIndex
