'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import AddOrEditUserRole from '@/form/generatedForms/addUserRole'

import DesignationRoleView from './DesignationRoleView'
import GroupRoleView from './GroupRoleView'

const UserRolesIndex = () => {
  const pathname = usePathname()

  const segments = pathname.split('/')
  const mode = segments[3]
  const id = segments[4]

  return (
    <>
      {(mode === 'add' || (mode === 'edit' && id)) && <AddOrEditUserRole mode={mode} id={id} />}
      {mode === 'DesinationDetails' && <DesignationRoleView />}
      {mode === 'GroupRoleDetails' && <GroupRoleView />}
     
    </>
  )
}

export default UserRolesIndex
