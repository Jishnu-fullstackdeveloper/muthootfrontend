'use client'

import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  Tooltip,
  Button,
  IconButton
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchGroupRoleById } from '@/redux/UserRoles/userRoleSlice'
import type { RootState } from '@/redux/store'

import { ROUTES } from '@/utils/routes'

interface GroupRole {
  id: string
  name: string
  description?: string
  permissions?: Array<{
    id: string
    name: string
    description?: string
  }>
}

interface GroupRoleState {
  selectedGroupRoleData: GroupRole | null
  isSelectedGroupRoleLoading: boolean
  selectedGroupRoleFailureMessage: string
  selectedGroupRoleFailure: boolean
}

// const ROUTES = {
//   USER_MANAGEMENT: {
//     GROUP_ROLE_PERMISSION_EDIT: (id: string) => `/group-roles/edit?id=${id}`
//   }
// }

const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const cleanName = (name: string): string => {
  return name?.replace(/^DES_/, '').trim() || 'N/A'
}

const GroupRoleView = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const dispatch = useAppDispatch()
  const [showAllPermissions, setShowAllPermissions] = useState(false)

  const {
    selectedGroupRoleData,
    isSelectedGroupRoleLoading,
    selectedGroupRoleFailureMessage,
    selectedGroupRoleFailure
  } = useAppSelector((state: RootState) => state.UserRoleReducer) as GroupRoleState

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchGroupRoleById(id))
    }
  }, [id, dispatch])

  if (isSelectedGroupRoleLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (selectedGroupRoleFailure && selectedGroupRoleFailureMessage) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>Error: {selectedGroupRoleFailureMessage}</Typography>
      </Box>
    )
  }

  if (!selectedGroupRoleData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No designation role data available</Typography>
      </Box>
    )
  }

  const GroupRole = selectedGroupRoleData

  return (
    <Box>
      {/* Full-width Role Card */}
      <Card sx={{ p: 4, borderRadius: '14px', mb: 4, minHeight: '200px' }}>
        <Typography variant='h6' gutterBottom>
          Role Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid item xs={12}>
          <Box>
            <Typography variant='h4' sx={{ mt: 1, fontWeight: 'bold' }}>
              {toTitleCase(cleanName(GroupRole.name))}
            </Typography>
            <Typography variant='h6' color='text.secondary' sx={{ mt: 3 }}>
              {GroupRole.description || 'No description available'}
            </Typography>
          </Box>
        </Grid>
      </Card>

      {/* Role Permissions Card */}
      <Card sx={{ p: 4, borderRadius: '14px', minHeight: '150px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6'>Role Permissions</Typography>
         
          <IconButton onClick={() => router.push(ROUTES.USER_MANAGEMENT.GROUP_ROLE_PERMISSION_EDIT(GroupRole.id))}>
            <EditIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3, minHeight: '40px' }}>
          {GroupRole.permissions?.length > 0 ? (
            <>
              {(showAllPermissions ? GroupRole.permissions : GroupRole.permissions.slice(0, 4)).map(permission => (
                <Tooltip
                  key={permission.id}
                  title={permission.description || 'No description available'}
                  placement='top'
                  arrow
                >
                  <Chip
                    label={toTitleCase(cleanName(permission.name))}
                    sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                  />
                </Tooltip>
              ))}
              {GroupRole.permissions?.length > 4 && (
                <Button
                  variant='text'
                  onClick={() => setShowAllPermissions(!showAllPermissions)}
                  sx={{ color: '#00695C', fontSize: '14px', mt: 1 }}
                >
                  {showAllPermissions ? 'Show Less' : `+${GroupRole.permissions.length - 4}`}
                </Button>
              )}
            </>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              No role permissions
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default GroupRoleView
