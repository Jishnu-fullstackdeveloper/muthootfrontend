'use client'

import React, { useMemo, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, Grid, Chip, Button, Typography, Divider, CircularProgress, Tooltip } from '@mui/material'

import { createColumnHelper } from '@tanstack/react-table'

import { fetchGroupRole } from '@/redux/UserRoles/userRoleSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ROUTES } from '@/utils/routes'
import DynamicTable from '@/components/Table/dynamicTable'

interface GroupRole {
  id: string
  name: string
  description?: string
  permissions?: Array<{ id: string; name: string; description: string }>
}

interface GroupRoleProps {
  searchText: string
  view: 'table' | 'grid'
}

const columnHelper = createColumnHelper<GroupRole>()

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

const GroupRole: React.FC<GroupRoleProps> = ({ searchText = '', view }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showAllPermissions] = useState<{ [key: string]: boolean }>({})
  const [showFullDescription] = useState<{ [key: string]: boolean }>({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { groupRoleData, isGroupRoleLoading, groupRoleFailure } = useAppSelector(state => state.UserRoleReducer)

  // Placeholder for totalCount; replace with actual totalCount from API/store
  const totalCount = groupRoleData.length

  const filteredRoles = useMemo(() => {
    if (!searchText) return groupRoleData
    const lowerSearch = searchText.toLowerCase()

    return groupRoleData.filter(
      role =>
        cleanName(role.name).toLowerCase().includes(lowerSearch) ||
        (role.description?.toLowerCase().includes(lowerSearch) ?? false)
    )
  }, [searchText, groupRoleData])

  useEffect(() => {
    dispatch(fetchGroupRole({ page, limit }))
  }, [dispatch, page, limit])

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Group Name',
        cell: ({ row }) => toTitleCase(cleanName(row.original.name))
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => truncateText(row.original.description || 'No description available', 50)
      }),
      columnHelper.accessor('permissions', {
        header: 'Permissions',
        cell: ({ row }) => {
          const permissions = row.original.permissions?.map(p => p.name) || []
          const showMore = permissions.length > 3

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {permissions.length > 0 ? (
                <>
                  {getFirstThreePermissions(permissions).map((permission, idx) => (
                    <Tooltip
                      key={idx}
                      title={
                        row.original.permissions?.find(p => p.name === permission)?.description ||
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
            <Button
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
            </Button>
            <Button
              variant='contained'
              size='small'
              onClick={() => router.push(ROUTES.USER_MANAGEMENT.GROUP_VIEW(row.original.id))}
              sx={{
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
        )
      })
    ],
    [router]
  )

  return (
    <Box sx={{ p: 3 }}>
      {isGroupRoleLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {groupRoleFailure && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color='error'>Failed to load group roles</Typography>
        </Box>
      )}
      {!isGroupRoleLoading && !groupRoleFailure && filteredRoles.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No group roles found.</Typography>
        </Box>
      )}
      {!isGroupRoleLoading && !groupRoleFailure && filteredRoles.length > 0 && (
        <>
          {view === 'table' ? (
            <DynamicTable
              tableName='Group Roles'
              columns={columns}
              data={filteredRoles}
              pagination={{ pageIndex: page - 1, pageSize: limit }}
              totalCount={totalCount}
              onPageChange={newPage => {
                setPage(newPage + 1)
              }}
              onRowsPerPageChange={newPageSize => {
                setLimit(newPageSize)
              }}
              sorting={undefined}
              onSortingChange={undefined}
              initialState={undefined}
            />
          ) : (
            <Grid container spacing={3}>
              {filteredRoles.map(role => {
                const permissionNames = role.permissions?.map(p => p.name) || []
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
                          <Grid item>
                            <Button
                              variant='outlined'
                              size='small'
                              disabled={isGroupRoleLoading}
                              onClick={() => router.push(ROUTES.USER_MANAGEMENT.GROUP_ROLE_PERMISSION_EDIT(role.id))}
                              sx={{
                                borderRadius: '8px',
                                border: '1px solid #0096DA',
                                color: '#0096DA',
                                textTransform: 'none',
                                '&:hover': {
                                  backgroundColor: '#D0F7E7',
                                  borderColor: '#007BBD'
                                }
                              }}
                            >
                              Edit
                            </Button>
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 2, minHeight: '60px' }}>
                          <Typography variant='h6' color='text.secondary'>
                            {showFullDescription[role.id]
                              ? role.description || 'No description available'
                              : truncateText(role.description || 'No description available', 100)}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 4, minHeight: '40px' }}>
                          <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                            Role Permissions
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px', mt: 4 }}>
                            {role.permissions?.length ? (
                              <>
                                {(showAllPermissions[role.id]
                                  ? permissionNames
                                  : getFirstThreePermissions(permissionNames)
                                ).map((permission, idx) => (
                                  <Tooltip
                                    key={idx}
                                    title={
                                      role.permissions?.find(p => p.name === permission)?.description ||
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
                                    {showAllPermissions[role.id] ? 'Show Less' : `+${permissionNames.length - 3}`}
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
                          disabled={isGroupRoleLoading}
                          onClick={() => router.push(ROUTES.USER_MANAGEMENT.GROUP_VIEW(role.id))}
                          sx={{
                            width: '100%',
                            height: 36,
                            borderRadius: '8px',
                            border: '1px solid #0096DA',
                            backgroundColor: '#FFFFFF',
                            color: '#0096DA',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: '#D0F7E7',
                              borderColor: '#007BBD'
                            }
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
          )}
        </>
      )}
    </Box>
  )
}

export default GroupRole
