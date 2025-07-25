'use client'

import React, { useEffect } from 'react'

import { useParams } from 'next/navigation'

import { Box, Card, Typography, Divider, Chip, CircularProgress } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDesignationRoleById } from '@/redux/UserRoles/userRoleSlice'
import type { RootState } from '@/redux/store'

interface DesignationRole {
  id: string
  name: string
  description?: string
  groupRoles?: Array<{
    id: string
    name: string
    description?: string
    permissions?: Array<{
      id: string
      name: string
      description?: string
    }>
  }>
  inheritedPermissions?: Array<{
    id: string
    name: string
    description?: string
  }>
}

interface DesignationRoleState {
  selectedDesignationRoleData: DesignationRole | null
  isSelectedDesignationRoleLoading: boolean
  selectedDesignationRoleFailureMessage: string
  selectedDesignationRoleSuccess: boolean
  selectedDesignationRoleFailure: boolean
}

const DesignationRoleView = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const {
    selectedDesignationRoleData,
    isSelectedDesignationRoleLoading,
    selectedDesignationRoleFailureMessage,
    selectedDesignationRoleSuccess,
    selectedDesignationRoleFailure
  } = useAppSelector((state: RootState) => state.UserRoleReducer) as DesignationRoleState

  useEffect(() => {
    console.log('DesignationRoleView mounted with id:', id) // Debug: Log the ID

    if (id && typeof id === 'string') {
      console.log('Dispatching fetchDesignationRoleById with id:', id) // Debug: Log dispatch
      dispatch(fetchDesignationRoleById(id))
    } else {
      console.log('Invalid or missing id:', id) // Debug: Log invalid ID
    }
  }, [id, dispatch])

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const cleanName = (name: string): string => {
    return name?.replace(/^DES_/, '').replace(/\s+/g, '-') || 'N/A'
  }

  // Debug: Log Redux state
  console.log('Redux state:', {
    selectedDesignationRoleData,
    isSelectedDesignationRoleLoading,
    selectedDesignationRoleFailureMessage,
    selectedDesignationRoleSuccess,
    selectedDesignationRoleFailure
  })

  if (!id || typeof id !== 'string') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>Invalid or missing designation role ID</Typography>
      </Box>
    )
  }

  if (isSelectedDesignationRoleLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (selectedDesignationRoleFailure && selectedDesignationRoleFailureMessage) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>Error: {selectedDesignationRoleFailureMessage}</Typography>
      </Box>
    )
  }

  if (!selectedDesignationRoleData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No designation role data available</Typography>
      </Box>
    )
  }

  const designationRole = selectedDesignationRoleData

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: 3,
          borderRadius: '14px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          backgroundColor: '#ffffff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant='h5' fontWeight={600}>
            {designationRole.name ? toTitleCase(cleanName(designationRole.name)) : 'N/A'}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant='subtitle2' sx={{ color: '#718096', fontWeight: 500, mb: 1 }}>
            Description
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {designationRole.description || 'No description available'}
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle2' sx={{ color: '#718096', fontWeight: 500, mb: 1 }}>
            Group Roles
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {designationRole.groupRoles?.length > 0 ? (
              designationRole.groupRoles.map(role => (
                <Box key={role.id} sx={{ mb: 2, width: '100%' }}>
                  <Chip
                    label={toTitleCase(role.name)}
                    sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px', mb: 1 }}
                  />
                  <Typography variant='body2' sx={{ color: '#718096', mb: 1 }}>
                    {role.description || 'No description available'}
                  </Typography>
                  <Typography variant='subtitle2' sx={{ color: '#718096', fontWeight: 500, mb: 0.5 }}>
                    Permissions:
                  </Typography>
                  {role.permissions?.length > 0 ? (
                    role.permissions.map(permission => (
                      <Typography key={permission.id} variant='body2' sx={{ ml: 2, mb: 0.5 }}>
                        - {toTitleCase(permission.name.replace(/_/g, ' '))}:{' '}
                        {permission.description || 'No description'}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant='body2' sx={{ ml: 2 }}>
                      No permissions assigned
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant='body2'>No group roles assigned</Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle2' sx={{ color: '#718096', fontWeight: 500, mb: 1 }}>
            Inherited Permissions
          </Typography>
          {designationRole.inheritedPermissions?.length > 0 ? (
            designationRole.inheritedPermissions.map(permission => (
              <Typography key={permission.id} variant='body2' sx={{ mb: 0.5 }}>
                - {toTitleCase(permission.name.replace(/_/g, ' '))}: {permission.description || 'No description'}
              </Typography>
            ))
          ) : (
            <Typography variant='body2'>No inherited permissions</Typography>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default DesignationRoleView
