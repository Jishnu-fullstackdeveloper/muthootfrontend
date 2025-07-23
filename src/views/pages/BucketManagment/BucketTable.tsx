'use client'

import { useEffect } from 'react'

import { useParams } from 'next/navigation'

import { useRouter } from 'next/navigation'

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
  Button,
  IconButton
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

  // const handleEdit = (userId: string) => {
  //   router.push(`/user-management/edit?id=${userId}`)
  // }

  return (
    <Box>
      <Grid
        container
        spacing={5}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        }}
      >
        {/* Profile Card */}
        <Grid item>
          <Card sx={{ p: 9, textAlign: 'center', borderRadius: '14px', width: '311px', height: '271px' }}>
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
        <Grid item>
          <Card sx={{ p: 4, borderRadius: '14px', width: '415px', height: '271px' }}>
            <Typography variant='h6' gutterBottom>
              Employee Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '20px' }}>
              {/* Employee Code */}
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '14px', width: '130px' }}>Employee Code:</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{user.employeeCode || 'N/A'}</Typography>
              </Box>
              <Divider />
              {/* Designation */}
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '14px', width: '130px' }}>Designation:</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{user.designation || 'N/A'}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {/* Role */}
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '14px', width: '130px' }}>Role:</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>
                  {user.designationRole?.name ? cleanName(user.designationRole.name, 'des_') : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Group Roles */}
        <Grid item>
          <Card sx={{ p: 4, borderRadius: '14px', width: '373px', height: '271px' }}>
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

      {/* Rest of permissions UI */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 4, borderRadius: '14px' }}>
          <Grid container spacing={3}>
            {/* Direct Permissions */}
            <Grid item xs={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography sx={{ fontWeight: 600 }}>Direct Permissions</Typography>
                    {/* <Button
                      variant='contained'
                      size='small'
                      onClick={() => handleEdit(id as string)}
                      sx={{ backgroundColor: '#377DFF', color: '#fff' }}
                    >
                      Edit
                    </Button> */}

                     <IconButton  onClick={() => router.push(ROUTES.USER_MANAGEMENT.USER_EDIT(user.userId))}>
                                        <i className='tabler-edit' style={{ fontSize: '23px' }} />
                                      </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {user.directPermissions?.length > 0 ? (
                      user.directPermissions.map((permission, idx) => (
                        <Chip
                          key={idx}
                          label={toTitleCase(cleanName(permission.name, ''))}
                          sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                        />
                      ))
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
                    {uniqueInheritedPermissions.length > 0 ? (
                      uniqueInheritedPermissions.map((permission, idx) => (
                        <Chip
                          key={idx}
                          label={toTitleCase(cleanName(permission.name, ''))}
                          sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                        />
                      ))
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
