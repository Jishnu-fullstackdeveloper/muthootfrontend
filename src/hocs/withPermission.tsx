import React from 'react'

import { getCurrentPermissions } from '@/utils/functions'
import { permissionsMap } from '@/configs/permissionsMap' // Import the permissions map

interface WithPermissionProps {
  fallback?: React.ReactNode
  buttonDisable?: boolean
  individualPermission?: string
}

const withPermission = (WrappedComponent: React.ComponentType<any>, componentName: string) => {
  return (props: WithPermissionProps) => {
    const rolesAndPermissions = getCurrentPermissions()

    // Get the required permissions for the component from permissionsMap
    const requiredPermissions = permissionsMap[componentName] || []

    // Handle individual permissions if provided
    const individualPermissions = props.individualPermission
      ? props.individualPermission.split(',').map(perm => perm.trim())
      : []

    // Check if the user has the required permissions (both from permissionsMap and individual)
    const hasPermission =
      requiredPermissions.every(permission =>
        rolesAndPermissions?.some(role => role.permissions.includes(permission))
      ) &&
      (individualPermissions.length === 0 ||
        individualPermissions.every(permission =>
          rolesAndPermissions?.some(role => role.permissions.includes(permission))
        ))

    if (!hasPermission) {
      return props.fallback || null // Return fallback UI or null if not provided
    }

    // Pass buttonDisable prop to the wrapped component if needed
    return <WrappedComponent {...props} buttonDisable={props.buttonDisable} />
  }
}

export default withPermission
