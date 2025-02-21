import React from 'react'

import { getCurrentPermissions } from '@/utils/functions'
import permissionsMap from '@/configs/permissionsMap' // Import the permissions map

interface WithPermissionProps {
  fallback?: React.ReactNode
}

const withPermission = (WrappedComponent: React.ComponentType<any>, componentName: string) => {
  return (props: WithPermissionProps) => {
    const rolesAndPermissions = getCurrentPermissions()

    // Get the required permissions for the component
    const requiredPermissions = permissionsMap[componentName] || []

    // Check if the user has the required permissions
    const hasPermission = requiredPermissions.every(permission => {
      return rolesAndPermissions?.some(role => role.permissions.includes(permission))
    })

    if (!hasPermission) {
      return props.fallback // Fallback UI
    }

    return <WrappedComponent {...props} />
  }
}

export default withPermission
