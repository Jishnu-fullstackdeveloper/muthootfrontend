'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Grid,
  Chip,
  Divider,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserById, resetAddUserStatus } from '@/redux/UserManagment/userManagementSlice'
import type { RootState } from '@/redux/store'
import { ROUTES } from '@/utils/routes'

interface UserManagementState {
  selectedUserData: any[]
  isUserLoading: boolean
  userFailureMessage: string
}

const toTitleCase = (str: string) =>
  str
    .toString()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const cleanName = (name: string, prefix: string) => {
  if (!name) return ''

  return name.replace(new RegExp(`^${prefix}`), '').trim()
}

const UserDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showAllDirectPermissions, setShowAllDirectPermissions] = useState(false)
  const [showAllInheritedPermissions, setShowAllInheritedPermissions] = useState(false)

  const userManagement = useAppSelector((state: RootState) => state.UserManagementReducer) as UserManagementState

  const { selectedUserData, isUserLoading, userFailureMessage } = userManagement || {
    selectedUserData: [],
    isUserLoading: false,
    userFailureMessage: ''
  }

  const user = selectedUserData as any | null

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchUserById(id))
    }

    return () => {
      dispatch(resetAddUserStatus())
    }
  }, [id, dispatch])

  if (isUserLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (userFailureMessage) {
    return <Typography color='error'>Error: {userFailureMessage}</Typography>
  }

  if (!user) {
    return <Typography>No user data found</Typography>
  }

  const uniqueInheritedPermissions = Array.from(
    new Map(user.inheritedPermissions?.map(p => [p.name, p]) || []).values()
  )

  const displayedDirectPermissions = showAllDirectPermissions
    ? user.directPermissions || []
    : (user.directPermissions || []).slice(0, 10)

  const displayedInheritedPermissions = showAllInheritedPermissions
    ? uniqueInheritedPermissions
    : uniqueInheritedPermissions.slice(0, 10)

  return (
    <Box>
      <Grid container spacing={2} flexWrap='wrap'>
        {/* Profile Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: '14px', height: '100%' }}>
            <Avatar
              alt={user.firstName}
              src={user.profileImage || ''}
              sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
            />
            <Typography variant='h6'>
              {user.firstName || ''} {user.middleName || ''} {user.lastName || ''}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {user.email || 'N/A'}
            </Typography>
            <Chip
              label={user.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive'}
              sx={{
                mt: 2,
                background: user.status?.toLowerCase() === 'active' ? '#D1FAE5' : '#FEE2E2',
                color: user.status?.toLowerCase() === 'active' ? '#065F46' : '#991B1B',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Grid>

        {/* Employee Details */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 4, borderRadius: '14px', height: '100%' }}>
            <Typography variant='h6' gutterBottom>
              Employee Details
            </Typography>
            <Box sx={{ pt: 4, pb: 4 }}>
              {[
                { label: 'Employee Code', value: user.employeeCode || 'N/A' },
                { label: 'Designation', value: user.designation || 'N/A' },
                {
                  label: 'Role',
                  value: user.designationRole?.name ? cleanName(user.designationRole.name, 'des_') : 'N/A'
                }
              ].map((item, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '10px', sm: '13px' },
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.label}:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '12px', sm: '13px' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < 2 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Group Roles */}
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{ p: 4, borderRadius: '14px', height: '100%' }}>
            <Typography variant='h6' gutterBottom>
              Group Roles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {user.groupRoles?.length > 0 ? (
                user.groupRoles.map((role, idx) => (
                  <Chip
                    key={idx}
                    label={toTitleCase(cleanName(role.name, ''))}
                    sx={{ background: '#377DFF33', color: '#0096DA', fontSize: '14px' }}
                  />
                ))
              ) : (
                <Typography>N/A</Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Permissions Section */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 4, borderRadius: '14px' }}>
          <Grid container spacing={3}>
            {/* Direct Permissions */}
            <Grid item xs={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography sx={{ fontWeight: 600 }}>Direct Permissions</Typography>
                    <IconButton onClick={() => router.push(ROUTES.USER_MANAGEMENT.USER_EDIT(user.userId))}>
                      <i className='tabler-edit' style={{ fontSize: '23px' }} />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {displayedDirectPermissions.length > 0 ? (
                      <>
                        {displayedDirectPermissions.map((permission, idx) => (
                          <Chip
                            key={idx}
                            label={toTitleCase(cleanName(permission.name, ''))}
                            sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                          />
                        ))}
                        {user.directPermissions?.length > 10 && (
                          <Button
                            variant='text'
                            onClick={() => setShowAllDirectPermissions(!showAllDirectPermissions)}
                            sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px', mt: 1 }}
                          >
                            {showAllDirectPermissions ? '- Show Less' : `+${user.directPermissions.length - 10}`}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Typography>N/A</Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Inherited Permissions */}
            <Grid item xs={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 600 }}>Inherited Permissions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {displayedInheritedPermissions.length > 0 ? (
                      <>
                        {displayedInheritedPermissions.map((permission, idx) => (
                          <Chip
                            key={idx}
                            label={toTitleCase(cleanName((permission as any).name, ''))}
                            sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                          />
                        ))}
                        {uniqueInheritedPermissions.length > 10 && (
                          <Button
                            variant='text'
                            onClick={() => setShowAllInheritedPermissions(!showAllInheritedPermissions)}
                            sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px', mt: 1 }}
                          >
                            {showAllInheritedPermissions ? '- Show Less' : `+${uniqueInheritedPermissions.length - 10}`}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Typography>N/A</Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  )
}

export default UserDetails
