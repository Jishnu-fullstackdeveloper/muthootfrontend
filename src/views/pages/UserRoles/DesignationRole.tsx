'use client'

import React, { useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Grid, Chip, Button, Typography, Divider, CircularProgress } from '@mui/material'

import { fetchDesignationRole } from '@/redux/UserRoles/userRoleSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ROUTES } from '@/utils/routes'

// Define the type for designation role (aligned with JSON data)
interface DesignationRole {
  id: string
  name: string
  description?: string
  inheritedPermissions?: Array<{ id: string; name: string; description: string }>
}

interface DesignationRoleProps {
  searchText: string
}

const DesignationRole: React.FC<DesignationRoleProps> = ({ searchText = '' }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { designationRoleData, isDesignationRoleLoading, designationRoleFailure } = useAppSelector(
    state => state.UserRoleReducer
  )

  console.log(designationRoleData, 'designationRoleData')
  const page = 1
  const limit = 10

  // Format text to title case
  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Clean role name by removing 'DES_' prefix
  const cleanName = (name: string): string => {
    return name?.replace(/^DES_/, '').replace(/\s+/g, '-') || 'N/A'
  }

  // Filter roles based on searchText
  const filteredRoles = useMemo(() => {
    if (!searchText) return designationRoleData
    const lowerSearch = searchText.toLowerCase()

    return designationRoleData.filter(
      role =>
        cleanName(role.name).toLowerCase().includes(lowerSearch) ||
        (role.description?.toLowerCase().includes(lowerSearch) ?? false)
    )
  }, [searchText, designationRoleData])

  // Fetch designation roles on mount or when page/limit changes
  useEffect(() => {
    dispatch(fetchDesignationRole({ page, limit }))
  }, [dispatch, page, limit])

  return (
    <Box>
      {isDesignationRoleLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {designationRoleFailure && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color='error'>Failed to load designation roles</Typography>
        </Box>
      )}
      {!isDesignationRoleLoading && !designationRoleFailure && filteredRoles.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No designation roles found.</Typography>
        </Box>
      )}
      {!isDesignationRoleLoading && !designationRoleFailure && filteredRoles.length > 0 && (
        <Grid container spacing={3}>
          {filteredRoles.map(role => (
            <Grid item xs={12} sm={6} md={6} key={role.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '14px',
                  padding: 3,
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                  <Typography variant='h6'>{toTitleCase(cleanName(role.name))}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant='outlined'
                      size='small'
                      disabled={isDesignationRoleLoading}
                      onClick={() => router.push(`/user-management/designation-role/edit/${role.id}`)}
                      sx={{
                        borderRadius: '8px',
                        border: '1px solid #0096DA',
                        color: '#0096DA',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#D0E4F7',
                          borderColor: '#007BBD'
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
                <Divider />
                <Grid container sx={{ pl: 1, pt: 2 }}>
                  <Grid item xs={12}>
                    <Typography
                      color='text.secondary'
                      sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                    >
                      Description
                      <Typography component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {role.description || 'N/A'}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 2 }}>
                    <Typography
                      color='text.secondary'
                      sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                    >
                      Permissions
                      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
                        {role.inheritedPermissions?.length ? (
                          [...new Set(role.inheritedPermissions.map(p => p.name))].map((permission, idx) => (
                            <Chip
                              key={idx}
                              label={toTitleCase(permission.replace(/_/g, ' '))}
                              size='small'
                              sx={{
                                background: '#377DFF33',
                                color: '#0096DA',
                                fontSize: '12px'
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant='body2'>N/A</Typography>
                        )}
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant='contained'
                        size='small'
                        disabled={isDesignationRoleLoading}
                        onClick={() => {
                          router.push(ROUTES.USER_MANAGEMENT.DESIGNATION_VIEW(role.id))
                        }}
                        sx={{
                          width: 130,
                          height: 36,
                          borderRadius: '8px',
                          border: '1px solid #0096DA',
                          backgroundColor: '#FFFFFF',
                          color: '#0096DA',
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#D0E4F7',
                            borderColor: '#007BBD'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* TODO: Implement pagination controls */}
    </Box>
  )
}

export default DesignationRole
