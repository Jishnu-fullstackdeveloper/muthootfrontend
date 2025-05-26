'use client'

import React, { useEffect, useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import {
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Card,
  CardContent,
  Tooltip,
  Button,
  CircularProgress
} from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'
import DynamicTable from '@/components/Table/dynamicTable'

// Define interfaces for type safety
interface Role {
  id: string
  name: string
  description?: string
  permissions?: string[]
}

interface FetchParams {
  limit: number
  page: number
  search?: string
  permissionName?: string[]
}

interface UserRoleState {
  userRoleData: {
    data: Role[]
    pagination?: { totalItems: number }
    message?: string
  }
  isUserRoleLoading: boolean
  error?: string
}

const UserRolesAndPermissionList: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { userRoleData, isUserRoleLoading, error } = useAppSelector(
    (state: any) => state.UserRoleReducer as UserRoleState
  )

  const [searchText, setSearchText] = useState<string>('')
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('')
  const [appliedPermissionFilters, setAppliedPermissionFilters] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 500)

    return () => clearTimeout(timer)
  }, [searchText])

  // Fetch user roles when parameters change
  useEffect(() => {
    const params: FetchParams = {
      limit,
      page,
      ...(debouncedSearchText && { search: debouncedSearchText })
    }

    const activePermissions = Object.keys(appliedPermissionFilters).filter(key => appliedPermissionFilters[key])

    if (activePermissions.length > 0) {
      params.permissionName = activePermissions
    }

    dispatch(fetchUserRole(params))
  }, [debouncedSearchText, appliedPermissionFilters, page, limit, dispatch])

  // Log API messages or errors
  useEffect(() => {
    if (userRoleData?.message) {
      console.log('API Message:', userRoleData.message)
    }

    if (error) {
      console.error('Error fetching roles:', error)
    }
  }, [userRoleData?.message, error])

  // Clean role names by removing prefixes and formatting
  const cleanName = (name: string, prefix: 'DES_' | 'grp_'): string => {
    const regex = new RegExp(`^${prefix}`, 'i')

    return name.replace(regex, '').replace(/\s+/g, '-')
  }

  // Handle navigation to edit role page
  const handleEdit = (role: Role): void => {
    const cleanedName = cleanName(role.name, 'DES_')

    const query = new URLSearchParams({
      id: role.id,
      name: role.name
    }).toString()

    router.push(`/user-management/role/edit/${cleanedName}?${query}`)
  }

  // Handle navigation to view role page
  const handleView = (role: Role): void => {
    const cleanedName = cleanName(role.name, 'DES_')

    const query = new URLSearchParams({
      id: role.id,
      name: role.name
    }).toString()

    router.push(`/user-management/role/view/${cleanedName}?${query}`)
  }

  // Handle navigation to add role page
  const handleAdd = (): void => {
    router.push('/user-management/role/add/new')
  }

  // Define table columns
  const columnHelper = createColumnHelper<Role>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('serialNo', {
        header: 'Sl No',
        cell: ({ row }) => <Typography variant='body2'>{(page - 1) * limit + row.index + 1}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Role Name',
        cell: ({ row }) => (
          <Typography variant='body2'>{cleanName(row.original.name, 'DES_').toUpperCase() || 'N/A'}</Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => {
          const description = row.original.description ? row.original.description.replace(/\des_/, '') : 'N/A'

          const truncated = description.length > 30 ? `${description.slice(0, 30)}...` : description

          return (
            <Tooltip title={description.length > 1 ? description : ''} arrow>
              <Typography variant='body2'>{truncated}</Typography>
            </Tooltip>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Placeholder for Edit button (disabled in original code) */}
            {/* <IconButton
              onClick={() => handleEdit(row.original)}
              aria-label="Edit role"
              disabled={isEditDisabled}
              sx={{ color: 'text.secondary' }}
            >
              <i className="tabler-edit" style={{ fontSize: '20px' }} />
            </IconButton> */}
            <IconButton
              onClick={() => handleView(row.original)}
              aria-label='View role'
              sx={{ color: 'text.secondary' }}
            >
              <i className='tabler-eye' style={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        )
      })
    ],
    [page, limit, columnHelper]
  )

  // Filter roles based on permissions
  const filteredRoles = useMemo(() => {
    const activePermissions = Object.keys(appliedPermissionFilters).filter(key => appliedPermissionFilters[key])

    if (activePermissions.length === 0) return userRoleData?.data || []

    return (userRoleData?.data || []).filter(role =>
      activePermissions.every(permission => (role.permissions || []).includes(permission))
    )
  }, [userRoleData?.data, appliedPermissionFilters])

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
  }

  return (
    <Box>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <DynamicTextField
              label='Search Roles'
              variant='outlined'
              onChange={handleSearch}
              value={searchText}
              placeholder='Search roles...'
              size='small'
              sx={{ minWidth: { xs: '100%', sm: 300 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {searchText && (
                      <IconButton
                        aria-label='Clear search'
                        size='small'
                        onClick={() => setSearchText('')}
                        edge='end'
                        sx={{ color: 'text.secondary' }}
                      >
                        <i className='tabler-x' style={{ fontSize: '1rem' }} />
                      </IconButton>
                    )}
                    <i className='tabler-search' style={{ fontSize: '1.25rem' }} />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleAdd}
              startIcon={<i className='tabler-plus' />}
              sx={{ borderRadius: 1 }}
            >
              Add Role
            </Button>
          </Box>
        </CardContent>
      </Card>

      {isUserRoleLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label='Loading roles' />
        </Box>
      ) : error ? (
        <Typography color='error' align='center'>
          Failed to load roles: {error}
        </Typography>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <DynamicTable
            tableName='User Roles List'
            columns={columns}
            data={filteredRoles}
            pagination={{
              pageIndex: page - 1,
              pageSize: limit
            }}
            totalCount={userRoleData?.pagination?.totalItems || 0}
            onPageChange={newPage => setPage(newPage + 1)}
            onRowsPerPageChange={newPageSize => setLimit(newPageSize)}
          />
        </Card>
      )}
    </Box>
  )
}

export default UserRolesAndPermissionList
