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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

const MODULES = [
  'user',
  'userroles',
  'approvalmanagement',
  'jd',
  'vacancy',
  'recruitment',
  'branch',
  'bucket',
  'approvalmatrix',
  'generalsettings',
  'home'
]

const PERMISSION_ORDER = ['read', 'create', 'update', 'delete', 'upload', 'approval']

const APPLICABLE_PERMISSIONS = {
  user: ['read', 'create', 'update', 'delete'],
  userroles: ['read', 'create', 'update', 'delete'],
  approvalmanagement: ['read', 'create', 'update', 'delete'],
  jd: ['read', 'create', 'update', 'delete', 'upload', 'approval'],
  vacancy: ['read', 'create', 'update', 'delete'],
  recruitment: ['read', 'create', 'update', 'delete', 'approval'],
  branch: ['read'],
  bucket: ['read', 'create', 'update', 'delete'],
  approvalmatrix: ['read', 'create', 'update', 'delete'],
  generalsettings: ['read', 'create', 'update', 'delete'],
  home: ['read']
}

const ViewUserRole = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userRoleData, isUserRoleLoading } = useAppSelector(state => state.UserRoleReducer)
  const roleId = searchParams.get('id')
  const [localRole, setLocalRole] = useState(null)

  useEffect(() => {
    if (roleId) {
      const existingRole = userRoleData?.data?.find(role => role.id === roleId)

      if (existingRole) {
        setLocalRole(existingRole)
      } else {
        dispatch(fetchUserRole({ id: roleId })).then(response => {
          setLocalRole(response.payload)
        })
      }
    }
  }, [dispatch, roleId, userRoleData])

  const matchedRole = localRole
  const roleName = matchedRole?.name || searchParams.get('name') || 'N/A'
  const roleDescription = matchedRole?.description || searchParams.get('description') || 'N/A'
  const permissions = matchedRole?.permissions || JSON.parse(searchParams.get('permissions') || '[]')

  // Group and sort permissions
  const groupedPermissions = {}

  permissions.forEach(perm => {
    const [moduleName ] = perm.name.split('_')

    if (MODULES.includes(moduleName)) {
      groupedPermissions[moduleName] = groupedPermissions[moduleName] || []
      groupedPermissions[moduleName].push({ name: perm.name, description: perm.description })
    }
  })

  Object.keys(groupedPermissions).forEach(module => {
    groupedPermissions[module].sort((a, b) => {
      const aIndex = PERMISSION_ORDER.indexOf(a.name.split('_')[1])
      const bIndex = PERMISSION_ORDER.indexOf(b.name.split('_')[1])

      return aIndex - bIndex
    })
  })

  const handleEdit = () => {
    const query = new URLSearchParams({
      id: roleId,
      name: roleName,
      description: roleDescription,
      permissions: JSON.stringify(permissions)
    }).toString()

    router.push(`/user-role/edit/${roleName.replace(/\s+/g, '-')}?${query}`)
  }

  const formatModuleName = module =>
    ({
      user: 'User Management',
      userroles: 'User Roles',
      approvalmanagement: 'Approval Management',
      jd: 'JD Management',
      vacancy: 'Vacancy Management',
      recruitment: 'Recruitment Management',
      branch: 'Branch Management',
      bucket: 'Bucket Management',
      approvalmatrix: 'Approval Matrix',
      generalsettings: 'General Settings',
      home: 'Home Dashboard'
    })[module] || module

  const getPermissionDescription = (module, perm) => {
    const permission = permissions.find(p => p.name === `${module}_${perm}`)

    return permission?.description || 'No description available'
  }

  if (isUserRoleLoading) return <Typography>Loading...</Typography>
  if (!matchedRole && !searchParams.get('name')) return <Typography>No role data found for ID: {roleId}</Typography>

  return (
    <Box>
      <Card sx={{ boxShadow: 3, p: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h3' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              {roleName.toUpperCase()}
            </Typography>
            <IconButton onClick={handleEdit}>
              <i className='tabler-edit' />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 2 }}>
            Permissions:
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Module</TableCell>
                  {PERMISSION_ORDER.map(perm => (
                    <TableCell key={perm} sx={{ fontWeight: 'bold', fontSize: '15px' }} align='center'>
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(groupedPermissions).map(module => (
                  <TableRow key={module}>
                    <TableCell sx={{ fontSize: '15px' }}>{formatModuleName(module)}</TableCell>
                    {PERMISSION_ORDER.map(perm => {
                      const hasPermission = groupedPermissions[module].some(p => p.name === `${module}_${perm}`)
                      const isApplicable = APPLICABLE_PERMISSIONS[module].includes(perm)
                      const description = hasPermission ? getPermissionDescription(module, perm) : ''

                      return (
                        <TableCell key={`${module}_${perm}`} align='center'>
                          {hasPermission ? (
                            <Tooltip title={description}>
                              <Typography color='green'>✅</Typography>
                            </Tooltip>
                          ) : isApplicable ? (
                            <Tooltip title='No permission'>
                              <Typography color='red'>❌</Typography>
                            </Tooltip>
                          ) : (
                            <Typography color='gray'>-</Typography>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{ mt: 4 }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                Description:
              </Typography>
              <Typography sx={{ backgroundColor: '#f5f5f5', p: 5, borderRadius: 1 }} variant='h6'>
                {roleDescription}
              </Typography>
            </Box>
          </TableContainer>
        </CardContent>
        <Box sx={{ mt: 3, ml: 5, mb: 10 }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default ViewUserRole
