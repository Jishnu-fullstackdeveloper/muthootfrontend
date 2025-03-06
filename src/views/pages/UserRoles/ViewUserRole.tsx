'use client'

import React from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

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

// Define which permissions are applicable to each module
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
  home:['read']
}

const ViewUserRole = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const roleName = searchParams.get('name') || 'N/A'
  const roleDescription = searchParams.get('description') || 'N/A'
  const permissions = JSON.parse(searchParams.get('permissions') || '[]')

  // Group and sort permissions by module
  const groupedPermissions = {}

  permissions.forEach(perm => {
    const parts = perm.name.split('_')
    const moduleName = parts[0]

    if (MODULES.includes(moduleName)) {
      if (!groupedPermissions[moduleName]) {
        groupedPermissions[moduleName] = []
      }

      groupedPermissions[moduleName].push(perm)
    }
  })

  Object.keys(groupedPermissions).forEach(module => {
    groupedPermissions[module].sort((a, b) => {
      const aAction = a.name.split('_')[1] || ''
      const bAction = b.name.split('_')[1] || ''
      const aIndex = PERMISSION_ORDER.indexOf(aAction)
      const bIndex = PERMISSION_ORDER.indexOf(bAction)

      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1

      return aIndex - bIndex
    })
  })

  // Handle Edit button click
  const handleEdit = () => {
    const query = new URLSearchParams({
      name: roleName,
      description: roleDescription || '',
      permissions: JSON.stringify(permissions || [])
    }).toString()

    const formattedRoleName = roleName.replace(/\s+/g, '-')

    router.push(`/user-role/edit/${formattedRoleName}?${query}`)
  }

  // Function to format module names for display
  const formatModuleName = module => {
    switch (module) {
      case 'user':
        return 'User Management'
      case 'userroles':
        return 'User Roles'
      case 'approvalmanagement':
        return 'Approval Management'
      case 'jd':
        return 'JD Management'
      case 'vacancy':
        return 'Vacancy Management'
      case 'recruitment':
        return 'Recruitment Management'
      case 'branch':
        return 'Branch Management'
      case 'bucket':
        return 'Bucket Management'
      case 'approvalmatrix':
        return 'Approval Matrix'
      case 'generalsettings':
        return 'General Settings'
      case 'home':
        return 'Home Dashboard'
      default:
        return module
    }
  }

  // Function to get the description for a specific permission
  const getPermissionDescription = (module, perm) => {
    const permission = permissions.find(p => p.name === `${module}_${perm}`)

    return permission ? permission.description : 'No description available'
  }

  return (
    <Box>
      <Card sx={{ boxShadow: 3, padding: 3 }}>
        <CardContent>
          {/* Role Name with Edit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h3' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              {roleName.toLocaleUpperCase()}
            </Typography>
            <IconButton
              onClick={handleEdit}
              sx={{
                padding: 1,
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <i className='tabler-edit' />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Permissions Section as a Table */}
          <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 2 }}>
            Permissions:
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='permissions table'>
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
                    {/* Module Name */}
                    <TableCell sx={{ fontSize: '15px' }}>{formatModuleName(module)}</TableCell>
                    {/* Permissions (Read, Create, Update, Delete, Upload, Approval) */}
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
                            <Tooltip title='no permission'>
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
          </TableContainer>

          {/* Description Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              Description:
            </Typography>
            <Typography sx={{ backgroundColor: '#f5f5f5', padding: 5, borderRadius: 1 }} variant='h6'>
              {roleDescription}
            </Typography>
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <Box sx={{ marginTop: 3, marginLeft: 5, marginBottom: 10, display: 'flex', gap: 2 }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default ViewUserRole
