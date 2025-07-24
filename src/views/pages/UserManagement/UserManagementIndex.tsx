'use client'
import React from 'react'

import { usePathname } from 'next/navigation'

import AddOrEditUser from '@/form/generatedForms/addNewUser'
import UserDetails from './UserDetails'

const UserManagementIndex = () => {
  const pathname = usePathname()

  const segments = pathname.split('/')
  const mode = segments[3]
  const id = segments[4]

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditUser  />}
      {mode === 'view' && <UserDetails />}
    </>
  )
}

export default UserManagementIndex
