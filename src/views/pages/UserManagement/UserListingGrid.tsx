'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

// import { useDispatch } from 'react-redux'
import { Box, Card, Grid, Chip, IconButton, Typography, CircularProgress, Divider, Button } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

// import { fetchUserById } from '@/redux/UserManagment/userManagementSlice'
import { ROUTES } from '@/utils/routes'

interface User {
  userId: string
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  source?: string
  employeeCode?: string
  status?: string
  designation?: string
  designationRole?: { name: string }
  groupRoles?: { name: string; description: string }[]
}

interface UserGridProps {
  data: User[]
  loading: boolean
  onEdit: (empCode: string | undefined, id: string) => void
  page: number
  totalCount: number
  onLoadMore: (newPage: number) => void
}

const UserGrid = ({ data, loading, onEdit, page, totalCount, onLoadMore }: UserGridProps) => {
  const [expandedRoles, setExpandedRoles] = useState<{ [key: string]: boolean }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()


  // const dispatch = useDispatch()

  const toggleShowRoles = (userId: string) => {
    setExpandedRoles(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const toTitleCase = (str: string) =>
    str
      .toString()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const loadMoreUsers = useCallback(() => {
    if (loading || data.length >= totalCount) return
    const nextPage = page + 1

    onLoadMore(nextPage)
  }, [loading, data.length, totalCount, page, onLoadMore])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreUsers()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreUsers])

  const cleanName = (name: string, prefix: string) => {
    if (!name) return ''

    return name.replace(new RegExp(`^${prefix}`), '').trim()
  }

  // const handleViewDetails = async (userId: string) => {
  //   try {
  //     await dispatch(fetchUserById(userId)).unwrap()

  //     // router.push(`/user-details/${userId}`)

  //     router.push(ROUTES.USER_MANAGEMENT.USER_VIEW(id))
  //   } catch (error) {
  //     console.error('Failed to fetch user:', error)
  //   }
  // }

  return (
    <Box>
      <Grid container spacing={3}>
        {data.map((user, index) => (
          <Grid item xs={12} sm={6} md={6} key={user.userId || index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '14px', padding: 5 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonOutlineOutlinedIcon />
                  <Box sx={{ marginLeft: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h6'>
                      {user.firstName || 'N/A'} {user.middleName || ''} {user.lastName || ''}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {user.email || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={user.source?.toUpperCase() || 'N/A'}
                    size='small'
                    sx={{
                      backgroundColor: '#F2F3FF',
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      border: '1px solid #EEEEEE',
                      borderRadius: '6px',
                      padding: 3
                    }}
                  />
                  <IconButton onClick={() => onEdit(user.employeeCode, user.userId)}>
                    <i className='tabler-edit' style={{ fontSize: '23px' }} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
              <Grid container sx={{ paddingLeft: '10px', paddingTop: '16px' }}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        color='text.secondary'
                        sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                      >
                        Status
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background:
                                user.status?.toLowerCase() === 'active'
                                  ? 'var(--Green, #00B798)'
                                  : 'var(--Red, #FF0000)',
                              opacity: 1,
                              transform: 'rotate(0deg)'
                            }}
                          />
                          <Typography
                            component='span'
                            sx={{
                              color: user.status?.toLowerCase() === 'active' ? 'success.main' : 'error.main',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}
                          >
                            {user.status || 'N/A'}
                          </Typography>
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        color='text.secondary'
                        sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                      >
                        Employee Code
                        <Typography component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {user.employeeCode || 'N/A'}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ paddingTop: '16px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        color='text.secondary'
                        sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                      >
                        Designation
                        <Typography component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {user.designation ? toTitleCase(user.designation) : 'N/A'}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        color='text.secondary'
                        sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                      >
                        Designation Role
                        <Typography component='span' sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {user.designationRole?.name
                            ? toTitleCase(cleanName(user.designationRole.name, 'des_'))
                            : 'N/A'}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ paddingTop: '16px' }}>
                  <Grid container spacing={2} alignItems='flex-end'>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        color='text.secondary'
                        sx={{ display: 'flex', gap: 1, flexDirection: 'column', fontSize: '12px' }}
                      >
                        Group Roles
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
                          {user.groupRoles?.length > 0 ? (
                            <>
                              {expandedRoles[user.userId]
                                ? user.groupRoles.map((role: { name: string; description: string }, idx: number) => (
                                    <Box
                                      key={idx}
                                      sx={{
                                        background: '#377DFF33',
                                        color: '#0096DA',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                      }}
                                    >
                                      <Typography variant='body2' sx={{ color: '#0096DA', fontSize: '14px' }}>
                                        {role.name}
                                      </Typography>
                                    </Box>
                                  ))
                                : user.groupRoles
                                    .slice(0, 2)
                                    .map((role: { name: string; description: string }, idx: number) => (
                                      <Box
                                        key={idx}
                                        sx={{
                                          background: '#377DFF33',
                                          color: '#0096DA',
                                          px: 1.5,
                                          py: 0.5,
                                          borderRadius: '4px',
                                          fontSize: '12px'
                                        }}
                                      >
                                        <Typography variant='body2' sx={{ color: '#0096DA', fontSize: '14px' }}>
                                          {role.name}
                                        </Typography>
                                      </Box>
                                    ))}
                              {user.groupRoles.length > 2 && !expandedRoles[user.userId] && (
                                <Box
                                  sx={{
                                    background: '#377DFF33',
                                    color: '#0096DA',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => toggleShowRoles(user.userId)}
                                >
                                  <Typography variant='body2' sx={{ color: '#0096DA' }}>
                                    +{user.groupRoles.length - 2} more
                                  </Typography>
                                </Box>
                              )}
                            </>
                          ) : (
                            <Typography variant='body2'>N/A</Typography>
                          )}
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={() => router.push(ROUTES.USER_MANAGEMENT.USER_VIEW(user.userId))}
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {data.length < totalCount && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>{loading ? 'Loading more...' : 'Scroll to load more'}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default UserGrid
