import React from 'react'

import { getCurrentPermissions, getPermissionRenderConfig } from '@/utils/functions'

interface WithPermissionProps {
  fallback?: React.ReactNode
  buttonDisable?: boolean
  individualPermission?: string
}

const withPermission = <P extends object>(WrappedComponent: React.ComponentType<any>, componentName?: string) => {
  // Get the dynamic permissions map from getPermissionRenderConfig
  const dynamicPermissionsMap =
    getPermissionRenderConfig()?.reduce(
      (acc, item) => {
        acc[item.key] = item.permissions

        return acc
      },
      {} as { [key: string]: string[] }
    ) || {}

  return (props: P & WithPermissionProps) => {
    const rolesAndPermissions = getCurrentPermissions()

    // Get the required permissions for the component from the dynamic permissions map
    const requiredPermissions = dynamicPermissionsMap[componentName] || []

    // Handle individual permissions if provided
    const individualPermissions = props.individualPermission
      ? props.individualPermission.split(',').map(perm => perm.trim())
      : []

    // Check if the user has the required permissions (both from permissionsMap and individual)
    const hasPermission =
      (requiredPermissions.every(permission =>
        rolesAndPermissions?.some(role => role.permissions.includes(permission))
      ) &&
        individualPermissions.length === 0) ||
      individualPermissions.every(permission =>
        rolesAndPermissions?.some(role => role.permissions.includes(permission))
      )

    if (!hasPermission) {
      return props.fallback || null // Return fallback UI or null if not provided
    }

    // Pass all props to the wrapped component, ensuring correct typing
    return <WrappedComponent {...props} />
  }
}

export default withPermission
