'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

import { Box, Card, CardContent, Grid, Chip, IconButton, Typography, Button, CircularProgress } from '@mui/material'
import { grey } from '@mui/material/colors'

interface Role {
  id: string
  name: string
  permissions: { id: string; name: string; description: string }[]
}

interface User {
  userId: string
  firstName?: string
  lastName?: string
  middleName?: string
  email?: string
  employeeCode?: string
  status?: string
  source?: string
  roles?: string[] | Role[]
  role?: string
  designation?: string
}

interface UserGridProps {
  data: User[]
  loading: boolean
  onEdit: (empCode: string | undefined, id: string) => void
  page: number
  totalPages: number
  totalCount: number // Added to track total number of users
  onLoadMore: (newPage: number) => void // Modified to handle lazy loading
}

const UserGrid = ({ data, loading, onEdit, page, totalCount, onLoadMore }: UserGridProps) => {
  const [expandedRoles, setExpandedRoles] = useState<{ [key: string]: boolean }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <Box>
      <Grid container spacing={3}>
        {data.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={user.userId || index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant='h6'>
                    {user.firstName || 'N/A'} {user.middleName} {user.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={user.source?.toUpperCase() || 'N/A'}
                      size='small'
                      sx={{ backgroundColor: grey[300], color: 'black', fontWeight: 'bold', fontSize: '10px' }}
                    />
                    <IconButton onClick={() => onEdit(user.employeeCode, user.userId)}>
                      <i className='tabler-edit' style={{ fontSize: '23px' }} />
                    </IconButton>
                  </Box>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                      Status:{' '}
                      <Typography
                        component='span'
                        sx={{
                          color: user.status?.toLowerCase() === 'active' ? 'success.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {user.status || 'N/A'}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                      Employee Code: <Typography component='span'>{user.employeeCode || 'N/A'}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                      Email: <Typography component='span'>{user.email || 'N/A'}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                      Designation:{' '}
                      <Typography component='span'>
                        {user.designation ? toTitleCase(user.designation) : 'N/A'}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                      Roles:{' '}
                      {Array.isArray(user.roles) && user.roles.length > 0 ? (
                        <>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {user.roles.slice(0, expandedRoles[user.userId] ? undefined : 2).map((role, index) => (
                              <li key={index}>
                                <Typography variant='body2'>
                                  {'name' in role ? toTitleCase(role.name) : 'No Name'}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                          {user.roles.length > 2 && (
                            <Button variant='text' size='small' onClick={() => toggleShowRoles(user.userId)}>
                              {expandedRoles[user.userId] ? 'Show Less' : 'Show More'}
                            </Button>
                          )}
                        </>
                      ) : (
                        <Typography component='span'>{user.role ? toTitleCase(user.role) : 'No Role'}</Typography>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
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
