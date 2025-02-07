'use client'
import AddOrEditUser from '@/form/generatedForms/addNewUser' // Update this import path to match your project structure
import { usePathname } from 'next/navigation'
import React from 'react'


const UserManagementIndex = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const mode = segments[2] // Will be 'add', 'edit', or 'view'
  const id = segments[3] // Will be the ID if present

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditUser mode={mode} id={id} />}

    </>
  )
}

export default UserManagementIndex
