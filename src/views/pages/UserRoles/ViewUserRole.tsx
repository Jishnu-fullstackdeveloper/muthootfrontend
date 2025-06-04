'use client'

import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getUserRoleDetails, fetchDesignation } from '@/redux/UserRoles/userRoleSlice'

const ACTION_ORDER = ['read', 'create', 'update', 'delete', 'upload', 'approval']

const ViewUserRole = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Selectors for loading states and role data
  const { isUserRoleLoading, isDesignationLoading } = useAppSelector(state => state.UserRoleReducer)

  const roleId = searchParams.get('id')
  const [localRole, setLocalRole] = useState(null)
  const [hasFetched, setHasFetched] = useState(false) // Track if fetch has been attempted

  // Fetch designations on mount
  useEffect(() => {
    dispatch(fetchDesignation({}))
  }, [dispatch])

  // Fetch user role data when roleId changes
  useEffect(() => {
    if (!roleId) {
      setLocalRole(null)
      setHasFetched(true) // Mark as fetched to avoid infinite loading
      return
    }

    // Fetch role using getUserRoleDetails
    dispatch(getUserRoleDetails({ id: roleId }))
      .unwrap()
      .then(response => {
        setLocalRole(response?.data || null)
        setHasFetched(true)
      })
      .catch(() => {
        setLocalRole(null)
        setHasFetched(true)
      })
  }, [dispatch, roleId])

  const handleEditDesignation = () => {
    const query = new URLSearchParams({
      id: roleId,
      name: localRole?.name || '',
      editType: 'designation'
    }).toString()

    router.push(`/user-management/role/edit/${localRole?.name.replace(/\s+/g, '-') || 'role'}?${query}`)
  }

  const handleEditGroupRole = groupRole => {
    const query = new URLSearchParams({
      id: roleId,
      name: localRole?.name || '',
      groupRoleId: groupRole.id,
      editType: 'groupRole',
      groupRoleName: groupRole.name.replace(/^grp_/, '').trim() || 'Default Group Role'
    }).toString()

    router.push(`/user-management/role/edit/${localRole?.name.replace(/\s+/g, '-') || 'role'}?${query}`)
  }

  // Show loading state until fetch is complete
  if (isUserRoleLoading || isDesignationLoading || !hasFetched) {
    return <Typography>Loading...</Typography>
  }

  // Show error if no role data is found after fetching
  if (!localRole) {
    return <Typography>No role data found for ID: {roleId}</Typography>
  }

  const roleName = localRole?.name || 'N/A'
  const roleDescription = localRole?.description || 'N/A'
  const groupRoles = localRole?.groupRoles || []
  const designationPermissions = localRole?.permissions || []

  // Group designation permissions
  const designationGroupedPermissions = {}

  designationPermissions.forEach(perm => {
    const parts = perm.split('_')

    if (parts.length < 3) return
    const permissionModule = parts[1]
    const feature = parts.slice(2, -1).join('_') || 'general'
    const action = parts[parts.length - 1]

    if (!designationGroupedPermissions[permissionModule]) {
      designationGroupedPermissions[permissionModule] = {}
    }

    if (!designationGroupedPermissions[permissionModule][feature]) {
      designationGroupedPermissions[permissionModule][feature] = {
        name: feature,
        actions: [],
        description: `${feature} permissions`
      }
    }

    if (!designationGroupedPermissions[permissionModule][feature].actions.includes(action)) {
      designationGroupedPermissions[permissionModule][feature].actions.push(action)
    }
  })

  // Group permissions for each group role
  const groupRolePermissions = groupRoles.map(groupRole => {
    const groupPerms = {}

    groupRole.permissions.forEach(perm => {
      const parts = perm.split('_')

      if (parts.length < 3) return
      const permissionModule = parts[1]
      const feature = parts.slice(2, -1).join('_') || 'general'
      const action = parts[parts.length - 1]

      if (!groupPerms[permissionModule]) {
        groupPerms[permissionModule] = {}
      }

      if (!groupPerms[permissionModule][feature]) {
        groupPerms[permissionModule][feature] = {
          name: feature,
          actions: [],
          description: `${feature} permissions`
        }
      }

      if (!groupPerms[permissionModule][feature].actions.includes(action)) {
        groupPerms[permissionModule][feature].actions.push(action)
      }
    })

    return { ...groupRole, groupedPermissions: groupPerms }
  })

  const formatModuleName = module => {
    const moduleFormatMap = {
      system: 'System Management',
      user: 'User Management',
      hiring: 'Hiring Management',
      jd: 'JD Management',
      approvals: 'Approvals',
      general: 'General Settings',
      home: 'Home Dashboard',
      branch: 'Branch Management'
    }

    return moduleFormatMap[module.toLowerCase()] || module
  }

  const getPermissionDescription = (module, feature, action, permissions) => {
    const permString = `prv_${module}_${feature}_${action}`

    return permissions.includes(permString) ? `${feature} ${action} permission` : 'No description available'
  }

  const isEditDisabled = ['DEFAULT-ROLE', 'DEFAULT-ROLES-HRMS', 'SUPER ADMIN'].includes(roleName.toUpperCase())

  const cleanName = (name, prefix, isGroupRole = false) => {
    if (!name) return ''

    // Remove the prefix (des_ or grp_)
    let cleaned = name.replace(new RegExp(`^${prefix}`), '').trim()

    // Remove underscores and replace with spaces
    cleaned = cleaned.replace(/_/g, ' ')

    if (isGroupRole) {
      // For group roles, capitalize the first word
      cleaned = cleaned
        .split(' ')
        .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(' ')
    } else {
      // For designation, capitalize the entire string
      cleaned = cleaned.toUpperCase()
    }

    return cleaned
  }

  return (
    <Box>
      <Card sx={{ boxShadow: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              {cleanName(localRole?.name, 'des_')}
            </Typography>
            <Typography variant='body1' sx={{ mt: 1 }}>
              {cleanName(roleDescription, 'des_')}
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {Object.keys(designationGroupedPermissions).length > 0 ? (
            <Accordion sx={{ mb: 2 }} defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant='subtitle1'>
                    <strong>Designation Permissions</strong>
                  </Typography>
                  <IconButton
                    onClick={e => {
                      e.stopPropagation()
                      handleEditDesignation()
                    }}
                    title='Edit Designation Permissions'
                    sx={{ fontSize: '20px' }}
                    disabled={isEditDisabled}
                  >
                    <i className='tabler-edit' />
                  </IconButton>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Module</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Feature</TableCell>
                        {ACTION_ORDER.map(action => (
                          <TableCell key={action} sx={{ fontWeight: 'bold', fontSize: '15px' }} align='center'>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(designationGroupedPermissions).map(module =>
                        Object.keys(designationGroupedPermissions[module]).map((feature, index) => (
                          <TableRow key={`${module}_${feature}`}>
                            {index === 0 && (
                              <TableCell
                                sx={{ fontSize: '15px' }}
                                rowSpan={Object.keys(designationGroupedPermissions[module]).length}
                              >
                                {formatModuleName(module)}
                              </TableCell>
                            )}
                            <TableCell sx={{ fontSize: '15px' }}>{feature === 'general' ? module : feature}</TableCell>
                            {ACTION_ORDER.map(action => {
                              const hasPermission =
                                designationGroupedPermissions[module][feature].actions.includes(action)

                              return (
                                <TableCell key={`${module}_${feature}_${action}`} align='center'>
                                  {hasPermission ? (
                                    <Tooltip
                                      title={getPermissionDescription(module, feature, action, designationPermissions)}
                                    >
                                      <Typography color='green'>✅</Typography>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title='No permission'>
                                      <Typography color='red'>❌</Typography>
                                    </Tooltip>
                                  )}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Typography>No designation permissions assigned.</Typography>
          )}
          <Divider sx={{ mb: 4 }} />
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Group Roles and Permissions:
          </Typography>
          {groupRolePermissions.length > 0 ? (
            groupRolePermissions.map(groupRole => (
              <Accordion key={groupRole.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant='subtitle1'>{cleanName(groupRole.name, 'grp_', true)}</Typography>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation()
                        handleEditGroupRole(groupRole)
                      }}
                      title='Edit Group Role'
                      sx={{ fontSize: '20px' }}
                      disabled={isEditDisabled}
                    >
                      <i className='tabler-edit' />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Module</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Feature</TableCell>
                          {ACTION_ORDER.map(action => (
                            <TableCell key={action} sx={{ fontWeight: 'bold', fontSize: '15px' }} align='center'>
                              {action.charAt(0).toUpperCase() + action.slice(1)}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(groupRole.groupedPermissions).map(module =>
                          Object.keys(groupRole.groupedPermissions[module]).map((feature, index) => (
                            <TableRow key={`${groupRole.id}_${module}_${feature}`}>
                              {index === 0 && (
                                <TableCell
                                  sx={{ fontSize: '15px' }}
                                  rowSpan={Object.keys(groupRole.groupedPermissions[module]).length}
                                >
                                  {formatModuleName(module)}
                                </TableCell>
                              )}
                              <TableCell sx={{ fontSize: '15px' }}>
                                {feature === 'general' ? module : feature}
                              </TableCell>
                              {ACTION_ORDER.map(action => {
                                const hasPermission =
                                  groupRole.groupedPermissions[module][feature].actions.includes(action)

                                return (
                                  <TableCell key={`${module}_${feature}_${action}`} align='center'>
                                    {hasPermission ? (
                                      <Tooltip
                                        title={getPermissionDescription(module, feature, action, groupRole.permissions)}
                                      >
                                        <Typography color='green'>✅</Typography>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title='No permission'>
                                        <Typography color='red'>❌</Typography>
                                      </Tooltip>
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography>No group roles assigned.</Typography>
          )}
        </CardContent>
        <Box sx={{ mt: 3, ml: 5, mb: 2 }}>
          <Button variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default ViewUserRole
