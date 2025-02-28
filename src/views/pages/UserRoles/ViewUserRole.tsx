'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import router, { useRouter } from 'next/router'
import {
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const MODULES = ['user', 'recruitment', 'role', 'vacancy', 'branch',' approvalmatrix ','bucket', 'jd', 'general'] // Hardcoded module names

// Define the desired order of permission actions
const PERMISSION_ORDER = ['read', 'create', 'update', 'delete']

const ViewUserRole = () => {
  const searchParams = useSearchParams()

  const roleName = searchParams.get('name') || 'N/A'
  const roleDescription = searchParams.get('description') || 'N/A'
  const permissions = JSON.parse(searchParams.get('permissions') || '[]')

  // Group and sort permissions by module
  const groupedPermissions: { [key: string]: any[] } = {}

  permissions.forEach((perm: any) => {
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

  return (
    <Box>
      <Card sx={{ boxShadow: 3, padding: 3 }}>
        <CardContent>
          <Typography variant='h3' sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            {roleName.toLocaleUpperCase()}
          </Typography>

          <Divider sx={{ mb: 4 }} />
          <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
            Permissions :
          </Typography>
          <Box sx={{ marginBottom: 3, padding: 2, borderRadius: 2 }}>
            {/* Display grouped and sorted permissions */}
            {Object.keys(groupedPermissions).map(module => (
              <Box key={module} sx={{ marginBottom: 3, padding: 2, borderRadius: 2 }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {module} Management
                </Typography>
                <List sx={{ display: 'flex', flexDirection: 'row' }}>
                  {groupedPermissions[module].map(perm => (
                    <ListItem key={perm.id} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={<Checkbox checked={true} disabled />}
                        label={
                          <Typography sx={{ color: '#000', fontWeight: '500' }}>
                            {perm.name.replace('_', ' ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
          <Box >
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              Description :
            </Typography>
            <Typography sx={{ backgroundColor: '#f5f5f5', padding: 5, borderRadius: 1 }} variant='h6'>{roleDescription}</Typography>
          </Box>
        </CardContent>

        <Box sx={{ marginTop: 3, marginLeft: 5, marginBottom: 10 }}>
          <Button startIcon={<ArrowBack />} variant='outlined' onClick={() => (router ? router.back() : null)}>
            Go Back
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default ViewUserRole
