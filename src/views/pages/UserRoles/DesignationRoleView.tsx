'use client'

import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

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
  Autocomplete,
  TextField,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDesignationRoleById, fetchGroupRole, updateGroupRole } from '@/redux/UserRoles/userRoleSlice'
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

interface GroupRole {
  id: string
  name: string
}

interface DesignationRoleState {
  selectedDesignationRoleData: DesignationRole | null
  isSelectedDesignationRoleLoading: boolean
  selectedDesignationRoleFailureMessage: string
  selectedDesignationRoleSuccess: boolean
  selectedDesignationRoleFailure: boolean
  groupRoleData: GroupRole[]
  isGroupRoleLoading: boolean
  groupRoleFailure: boolean
  isGroupRoleUpdating: boolean
  groupRoleUpdateSuccess: boolean
  groupRoleUpdateFailure: boolean
  groupRoleUpdateFailureMessage: string
}

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

const DesignationRoleView = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const dispatch = useAppDispatch()
  const [showPermissions, setShowPermissions] = useState<string | null>(null)
  const [showAllPermissions, setShowAllPermissions] = useState<{ [key: string]: boolean }>({})
  const [showAllInheritedPermissions, setShowAllInheritedPermissions] = useState(false)
  const [isEditingGroupRoles, setIsEditingGroupRoles] = useState(false)
  const [selectedGroupRoles, setSelectedGroupRoles] = useState<string[]>([])

  const {
    selectedDesignationRoleData,
    isSelectedDesignationRoleLoading,
    selectedDesignationRoleFailureMessage,
    selectedDesignationRoleFailure,
    groupRoleData,
    isGroupRoleLoading,
    groupRoleFailure,
    isGroupRoleUpdating,
    groupRoleUpdateSuccess,
    groupRoleUpdateFailure,
    groupRoleUpdateFailureMessage
  } = useAppSelector((state: RootState) => state.UserRoleReducer) as DesignationRoleState

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchDesignationRoleById(id))
      dispatch(fetchGroupRole())
    }
  }, [id, dispatch])

  useEffect(() => {
    if (selectedDesignationRoleData?.groupRoles) {
      setSelectedGroupRoles(selectedDesignationRoleData.groupRoles.map(role => role.id))
    }
  }, [selectedDesignationRoleData])

  useEffect(() => {
    if (groupRoleUpdateSuccess) {
      setIsEditingGroupRoles(false)

      if (id) {
        dispatch(fetchDesignationRoleById(id))
      }
    }
  }, [groupRoleUpdateSuccess, dispatch, id])

  const handleSaveGroupRoles = () => {
    if (!id || !selectedDesignationRoleData) {
      dispatch({
        type: 'userManagement/updateGroupRole/rejected',
        payload: { message: 'Designation role not found. Please check the role ID.', statusCode: 400 }
      })

      return
    }

    if (selectedGroupRoles.length === 0) {
      dispatch({
        type: 'userManagement/updateGroupRole/rejected',
        payload: { message: 'Please select at least one group role.', statusCode: 400 }
      })

      return
    }

    const groupRoleNames = selectedGroupRoles
      .map(id => groupRoleData.find(role => role.id === id)?.name)
      .filter((name): name is string => !!name)

    dispatch(
      updateGroupRole({
        id,
        params: {
          designationRole: selectedDesignationRoleData.name,
          newGroupRoles: groupRoleNames
        }
      })
    )
  }

  const handleRemoveGroupRole = (roleId: string) => {
    setSelectedGroupRoles(prev => prev.filter(id => id !== roleId))
  }

  if (isSelectedDesignationRoleLoading || isGroupRoleLoading) {
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

  if (groupRoleFailure) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>Error: Failed to load group roles</Typography>
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
    <Box sx={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      <Card
        sx={{ p: 4, borderRadius: '14px', mb: 4, backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Typography variant='h6' gutterBottom>
          Role Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant='h5' sx={{ mt: 1, fontWeight: 'bold' }}>
                {toTitleCase(cleanName(designationRole.name))}
              </Typography>
              <Typography variant='h6' color='text.secondary' sx={{ mt: 3 }}>
                {designationRole.description || 'No description available'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card
        sx={{ p: 4, borderRadius: '14px', mb: 4, backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' gutterBottom>
            Group Roles
          </Typography>
          <IconButton onClick={() => setIsEditingGroupRoles(!isEditingGroupRoles)} sx={{ color: '#377DFF' }}>
            <EditIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {isEditingGroupRoles ? (
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              multiple
              options={groupRoleData}
              getOptionLabel={option => toTitleCase(cleanName(option.name))}
              value={groupRoleData.filter(role => selectedGroupRoles.includes(role.id))}
              onChange={(event, newValue) => {
                setSelectedGroupRoles(newValue.map(role => role.id))
              }}
              renderInput={params => (
                <TextField {...params} variant='outlined' label='Select Group Roles' placeholder='Type to search' />
              )}
              renderTags={(value: GroupRole[], getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option.id}
                    label={toTitleCase(cleanName(option.name))}
                    onDelete={() => handleRemoveGroupRole(option.id)}
                    deleteIcon={<CloseIcon />}
                    {...getTagProps({ index })}
                    sx={{ background: '#E3F2FD', color: '#1976D2', fontSize: '14px' }}
                  />
                ))
              }
              sx={{ mb: 2 }}
            />
            <Button
              variant='contained'
              onClick={handleSaveGroupRoles}
              disabled={isGroupRoleUpdating || !selectedDesignationRoleData}
              sx={{ backgroundColor: '#377DFF', '&:hover': { backgroundColor: '#2f6ad9' } }}
            >
              {isGroupRoleUpdating ? 'Savings..': 'Save' }
            </Button>
            {groupRoleUpdateFailure && (
              <Typography color='error' sx={{ mt: 2 }}>
                {groupRoleUpdateFailureMessage || 'Failed to update group roles. Please try again.'}
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, mb: 2, overflowX: 'auto' }}>
              {designationRole.groupRoles?.length > 0 ? (
                designationRole.groupRoles.map(role => (
                  <Chip
                    key={role.id}
                    label={toTitleCase(cleanName(role.name))}
                    onClick={() => setShowPermissions(prev => (prev === role.id ? null : role.id))}
                    sx={{
                      background: '#377DFF33',
                      color: '#0096DA',
                      fontSize: '14px',
                      cursor: 'pointer',
                      '&:hover': {
                        background: '#377DFF',
                        color: '#fff'
                      }
                    }}
                  />
                ))
              ) : (
                <Typography>No group roles assigned</Typography>
              )}
            </Box>
            {showPermissions && (
              <Box sx={{ mt: 6 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  Permissions for{' '}
                  {toTitleCase(cleanName(designationRole.groupRoles?.find(r => r.id === showPermissions)?.name || ''))}
                </Typography>
                {designationRole.groupRoles?.find(r => r.id === showPermissions)?.permissions?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {(showAllPermissions[showPermissions]
                      ? designationRole.groupRoles?.find(r => r.id === showPermissions)?.permissions
                      : designationRole.groupRoles?.find(r => r.id === showPermissions)?.permissions?.slice(0, 10)
                    )?.map(permission => (
                      <Tooltip
                        key={permission.id}
                        title={permission.description || 'No description available'}
                        placement='top'
                        arrow
                      >
                        <Chip
                          label={toTitleCase(cleanName(permission.name))}
                          sx={{ background: '#BBDEFB', color: '#00695C', fontSize: '14px' }}
                        />
                      </Tooltip>
                    ))}
                    {designationRole.groupRoles?.find(r => r.id === showPermissions)?.permissions?.length > 10 && (
                      <Button
                        variant='text'
                        onClick={() =>
                          setShowAllPermissions(prev => ({ ...prev, [showPermissions]: !prev[showPermissions] }))
                        }
                        sx={{ color: '#00695C', fontSize: '14px', mt: 1 }}
                      >
                        {showAllPermissions[showPermissions]
                          ? 'Show Less'
                          : `Show More (${designationRole.groupRoles?.find(r => r.id === showPermissions)?.permissions?.length - 10})`}
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Typography sx={{ mt: 1 }}>No permissions assigned</Typography>
                )}
              </Box>
            )}
          </>
        )}
      </Card>

      <Card sx={{ p: 4, borderRadius: '14px', backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant='h6' gutterBottom>
          Role Permissions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
          {designationRole.inheritedPermissions?.length > 0 ? (
            <>
              {(showAllInheritedPermissions
                ? designationRole.inheritedPermissions
                : designationRole.inheritedPermissions.slice(0, 10)
              ).map(permission => (
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
              {designationRole.inheritedPermissions?.length > 10 && (
                <Button
                  variant='text'
                  onClick={() => setShowAllInheritedPermissions(!showAllInheritedPermissions)}
                  sx={{ color: '#00695C', fontSize: '14px', mt: 1 }}
                >
                  {showAllInheritedPermissions
                    ? 'Show Less'
                    : `Show More (${designationRole.inheritedPermissions.length - 10})`}
                </Button>
              )}
            </>
          ) : (
            <Typography>No role permissions</Typography>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default DesignationRoleView
