import React from 'react'
import { usePathname } from 'next/navigation'
import AddUserPermissionList from '@/form/generatedForms/addUserPermissionList'

const UserRoleindex = () => {
    const pathname = usePathname() // Gets the full pathname
    const segments = pathname.split('/') // Split by "/"
    const mode = segments[2] // Extract "add, edit, or view"
    const id = segments[3] // Extract the id if available
  
    return (
      <>
        {(mode === 'add' || (mode === 'edit' && id)) && <AddUserPermissionList mode={mode} id={id} />}
        {/* {mode === 'view' && <BucketView mode={mode} id={id} />} */}
      </>
    )
}

export default UserRoleindex



