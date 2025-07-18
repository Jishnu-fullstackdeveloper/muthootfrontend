import React from 'react'

import { getCurrentPermissions } from '@/utils/functions'

interface WithPermissionProps {
  fallback?: React.ReactNode
  buttonDisable?: boolean
  individualPermission?: string
  selected?: any
  sx?: any
}

function withPermission<P>(WrappedComponent: React.ComponentType<P>): React.FC<P & WithPermissionProps> {
  return props => {
    const rolesAndPermissions = getCurrentPermissions()

    const individualPermissions = props.individualPermission
      ? props.individualPermission.split(',').map(perm => perm.trim())
      : []

    const hasPermission =
      individualPermissions.length > 0 &&
      individualPermissions.every(permission =>
        rolesAndPermissions?.some(role => role.permissions.includes(permission))
      )

    if (!hasPermission) {
      return props.fallback || null
    }

    const { individualPermission, fallback, buttonDisable, ...restProps } = props

    individualPermission
    fallback
    buttonDisable

    return <WrappedComponent {...(restProps as P)} />
  }
}

export default withPermission
