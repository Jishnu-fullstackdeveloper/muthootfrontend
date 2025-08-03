'use client'

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Grid, Chip, Button, Typography, Divider, CircularProgress, Tooltip } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ROUTES } from '@/utils/routes'
import DynamicTable from '@/components/Table/dynamicTable'
import { fetchDesignationRole } from '@/redux/UserRoles/userRoleSlice'

interface DesignationRole {
  id: string
  name: string
  description?: string
  inheritedPermissions?: Array<{ id: string; name: string; description: string }>
}

interface DesignationRoleProps {
  searchText: string
  view: 'table' | 'grid'
}

interface Pagination {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
}

const columnHelper = createColumnHelper<DesignationRole>()

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

const getFirstThreePermissions = (permissions: string[]): string[] => {
  return permissions.slice(0, 3)
}

const truncateText = (text: string, length: number): string => {
  return text?.length > length ? text.slice(0, length) + '...' : text || 'No description available'
}

const DesignationRole: React.FC<DesignationRoleProps> = ({ searchText = '', view }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const { designationRoleData, isDesignationRoleLoading, designationRoleFailure, pagination } = useAppSelector(
    state => state.UserRoleReducer
  )

  // Use pagination data from Redux state (from API response)
  const { totalCount = 0, totalPages = 1, limit = 10 } = (pagination as Pagination) || {}

  const filteredRoles = useMemo(() => {
    if (!searchText) return designationRoleData
    const lowerSearch = searchText.toLowerCase()

    return designationRoleData.filter(
      role =>
        cleanName(role.name).toLowerCase().includes(lowerSearch) ||
        (role.description?.toLowerCase().includes(lowerSearch) ?? false)
    )
  }, [searchText, designationRoleData])

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchDesignationRole({ page: 1, limit }))
      .unwrap()
      .catch(err => setFetchError(err.message || 'Failed to fetch designation roles'))
  }, [dispatch, limit])

  // Debounced load more function
  const loadMore = useCallback(() => {
    if (isFetchingMore || page >= totalPages) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsFetchingMore(true)
      setFetchError(null)

      try {
        await dispatch(fetchDesignationRole({ page: page + 1, limit })).unwrap()
        setPage(prev => prev + 1)
      } catch (error: any) {
        setFetchError(error.message || 'Failed to fetch more roles')
      } finally {
        setIsFetchingMore(false)
      }
    }, 300) // 300ms debounce
  }, [dispatch, page, limit, totalPages, isFetchingMore])

  // Set up IntersectionObserver for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingMore && page < totalPages) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentLoadMoreRef = loadMoreRef.current

    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef)
    }

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef)
      }
    }
  }, [loadMore, isFetchingMore, page, totalPages])

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Role Name',
        cell: ({ row }) => toTitleCase(cleanName(row.original.name))
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => truncateText(row.original.description || 'No description available', 50)
      }),
      columnHelper.accessor('inheritedPermissions', {
        header: 'Permissions',
        cell: ({ row }) => {
          const permissions = row.original.inheritedPermissions?.map(p => p.name) || []
          const showMore = permissions.length > 3

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {permissions.length > 0 ? (
                <>
                  {getFirstThreePermissions(permissions).map((permission, idx) => (
                    <Tooltip
                      key={idx}
                      title={
                        row.original.inheritedPermissions?.find(p => p.name === permission)?.description ||
                        'No description available'
                      }
                      placement='top'
                      arrow
                    >
                      <Chip
                        label={toTitleCase(permission.replace(/_/g, ' '))}
                        sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '10px' }}
                      />
                    </Tooltip>
                  ))}
                  {showMore && (
                    <Button
                      variant='text'
                      sx={{ color: '#00695C', fontSize: '10px', minWidth: 'unset', padding: '4px' }}
                    >
                      +{permissions.length - 3}
                    </Button>
                  )}
                </>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  No permissions
                </Typography>
              )}
            </Box>
          )
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* <Button
              variant='outlined'
              size='small'
              onClick={() => router.push(ROUTES.USER_MANAGEMENT.GROUP_ROLE_PERMISSION_EDIT(row.original.id))}
              sx={{
                borderRadius: '8px',
                border: '1px solid #0096DA',
                color: '#0096DA',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#D0F7E7', borderColor: '#007BBD' }
              }}
            >
              Edit
            </Button> */}
            <Box onClick={() => router.push(ROUTES.USER_MANAGEMENT.DESIGNATION_VIEW(row.original.id))}>
              <VisibilityIcon />
            </Box>
          </Box>
        )
      })
    ],
    [router]
  )

  return (
    <Box sx={{ p: 3 }}>
      {isDesignationRoleLoading && page === 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {designationRoleFailure && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color='error'>{'Failed to load designation roles'}</Typography>
        </Box>
      )}
      {fetchError && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color='error'>{fetchError}</Typography>
        </Box>
      )}
      {!isDesignationRoleLoading && !designationRoleFailure && filteredRoles.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No designation roles found.</Typography>
        </Box>
      )}
      {!isDesignationRoleLoading && !designationRoleFailure && filteredRoles.length > 0 && (
        <>
          {view === 'table' ? (
            <Box>
              <DynamicTable
                tableName='Designation Roles'
                columns={columns}
                data={filteredRoles}
                pagination={{ pageIndex: page - 1, pageSize: limit }}
                totalCount={totalCount}
                onPageChange={newPage => {
                  setPage(newPage + 1)
                }}
                onRowsPerPageChange={newPageSize => {
                  setPage(1) // Reset to first page
                  dispatch(fetchDesignationRole({ page: 1, limit: newPageSize }))
                }}
                sorting={undefined}
                onSortingChange={undefined}
                initialState={undefined}
              />
              <div ref={loadMoreRef} style={{ height: '20px' }} />
              {isFetchingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {page >= totalPages && filteredRoles.length > 0 && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography>No more roles to load.</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Grid container spacing={3}>
                {filteredRoles.map(role => {
                  const permissionNames = role.inheritedPermissions?.map(p => p.name) || []
                  const showMore = permissionNames.length > 3

                  return (
                    <Grid item xs={12} sm={6} md={4} key={role.id}>
                      <Card
                        sx={{
                          p: 4,
                          borderRadius: '14px',
                          minHeight: '350px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box>
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs>
                              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                {toTitleCase(cleanName(role.name))}
                              </Typography>
                            </Grid>
                            {/* <Grid item>
                              <Button
                                variant='outlined'
                                size='small'
                                disabled={isDesignationRoleLoading}
                                onClick={() => router.push(ROUTES.USER_MANAGEMENT.GROUP_ROLE_PERMISSION_EDIT(role.id))}
                                sx={{
                                  borderRadius: '8px',
                                  border: '1px solid #0096DA',
                                  color: '#0096DA',
                                  textTransform: 'none',
                                  '&:hover': { backgroundColor: '#D0F7E7', borderColor: '#007BBD' }
                                }}
                              >
                                Edit
                              </Button>
                            </Grid> */}
                          </Grid>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ mb: 2, minHeight: '60px' }}>
                            <Typography variant='h6' color='text.secondary'>
                              {truncateText(role.description || 'No description available', 100)}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 4, minHeight: '40px' }}>
                            <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                              Role Permissions
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px', mt: 4 }}>
                              {role.inheritedPermissions?.length ? (
                                <>
                                  {getFirstThreePermissions(permissionNames).map((permission, idx) => (
                                    <Tooltip
                                      key={idx}
                                      title={
                                        role.inheritedPermissions?.find(p => p.name === permission)?.description ||
                                        'No description available'
                                      }
                                      placement='top'
                                      arrow
                                    >
                                      <Chip
                                        label={toTitleCase(permission.replace(/_/g, ' '))}
                                        sx={{ background: '#E0F7FA', color: '#00695C', fontSize: '14px' }}
                                      />
                                    </Tooltip>
                                  ))}
                                  {showMore && (
                                    <Button variant='text' sx={{ color: '#00695C', fontSize: '14px' }}>
                                      +{permissionNames.length - 3}
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <Typography variant='body2' color='text.secondary'>
                                  No role permissions
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                          <Button
                            variant='contained'
                            size='small'
                            disabled={isDesignationRoleLoading}
                            onClick={() => router.push(ROUTES.USER_MANAGEMENT.DESIGNATION_VIEW(role.id))}
                            sx={{
                              width: '100%',
                              height: 36,
                              borderRadius: '8px',
                              border: '1px solid #0096DA',
                              backgroundColor: '#FFFFFF',
                              color: '#0096DA',
                              textTransform: 'none',
                              boxShadow: 'none',
                              '&:hover': { backgroundColor: '#D0F7E7', borderColor: '#007BBD' }
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
              <div ref={loadMoreRef} style={{ height: '20px' }} />
              {isFetchingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {page >= totalPages && filteredRoles.length > 0 && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography color='textSecondary'>No more roles to load</Typography>
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default DesignationRole
