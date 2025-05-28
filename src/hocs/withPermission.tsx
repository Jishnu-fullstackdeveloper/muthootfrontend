import React from 'react'

import { getCurrentPermissions } from '@/utils/functions'

interface WithPermissionProps {
  fallback?: React.ReactNode
  buttonDisable?: boolean
  individualPermission?: string
}

const withPermission = <P extends object>(WrappedComponent: React.ComponentType<any>) => {
  return (props: P & WithPermissionProps) => {
    const rolesAndPermissions = getCurrentPermissions()

    // Handle individual permissions if provided
    const individualPermissions = props.individualPermission
      ? props.individualPermission.split(',').map(perm => perm.trim())
      : []

    // Check if the user has all the required individual permissions
    // If no permissions are specified, do not render (return null or fallback)
    const hasPermission =
      individualPermissions.length > 0 &&
      individualPermissions.every(permission =>
        rolesAndPermissions?.some(role => role.permissions.includes(permission))
      )

    if (!hasPermission) {
      // console.log('withPermission HOC initialized', props.individualPermission)
      return props.fallback || null // Return fallback UI or null if not provided
    }

    // Pass all props to the wrapped component, ensuring correct typing
    return <WrappedComponent {...props} />
  }
}

export default withPermission
