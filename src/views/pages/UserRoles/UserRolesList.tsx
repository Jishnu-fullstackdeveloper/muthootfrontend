'use client'

import React, { useEffect, useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { Typography, IconButton, InputAdornment, Box, Card, CardContent, Tooltip } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'
import DynamicTable from '@/components/Table/dynamicTable'

interface FetchParams {
  limit: number
  page: number
  search?: string
  permissionName?: string[]
}

const UserRolesAndPermisstionList = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userRoleData, isUserRoleLoading } = useAppSelector((state: any) => state.UserRoleReducer)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [tempPermissionFilters, setTempPermissionFilters] = useState({})
  const [appliedPermissionFilters, setAppliedPermissionFilters] = useState({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 500)

    return () => clearTimeout(timer)
  }, [searchText])

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

  const handleEdit = (role: any) => {
    const query = new URLSearchParams({
      id: role.id,
      name: role.name
    }).toString()

    router.push(`/user-role/edit/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const handleView = (role: any) => {
    const query = new URLSearchParams({ id: role.id, name: role.name }).toString()

    router.push(`/user-role/view/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('serialNo', {
        header: 'Sl No',
        cell: ({ row }) => <Typography>{(page - 1) * limit + row.index + 1}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Role Name',
        cell: ({ row }) => <Typography>{row.original.name.toUpperCase() || 'N/A'}</Typography>
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => {
          const description = row.original.description || 'N/A'
          const truncated = description.length > 30 ? description.slice(0, 30) + '  ...' : description

          return (
            <Tooltip title={description.length > 1 ? description : ''} arrow>
              <Typography>{truncated}</Typography>
            </Tooltip>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => {
          const roleName = row.original.name.toUpperCase()
          const isEditDisabled = roleName === 'DEFAULT-ROLE' || roleName === 'DEFAULT-ROLES-HRMS'

          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => handleEdit(row.original)}
                title='Edit'
                sx={{ fontSize: '20px' }}
                disabled={isEditDisabled}
              >
                <i className='tabler-edit' />
              </IconButton>
              <IconButton onClick={() => handleView(row.original)} title='View' sx={{ fontSize: '20px' }}>
                <i className='tabler-eye' />
              </IconButton>
            </Box>
          )
        }
      })
    ],
    [page, limit, columnHelper]
  )

  const filteredRoles = useMemo(() => {
    const activePermissions = Object.keys(appliedPermissionFilters).filter(key => appliedPermissionFilters[key])

    if (activePermissions.length === 0) return userRoleData?.data || []

    return (userRoleData?.data || []).filter(role =>
      activePermissions.every(permission => (role.permissions || []).includes(permission))
    )
  }, [userRoleData?.data, appliedPermissionFilters])

  useEffect(() => {
    if (userRoleData?.message) console.log(userRoleData?.message)
  }, [userRoleData?.message])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  return (
    <div>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <DynamicTextField
                label='Search Roles'
                variant='outlined'
                onChange={handleSearch}
                value={searchText}
                placeholder='Search roles...'
                size='small'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {searchText && (
                        <IconButton sx={{ color: '#d3d3d3' }} size='small' onClick={() => setSearchText('')} edge='end'>
                          <i className='tabler-x text-xl' />
                        </IconButton>
                      )}
                      <i className='tabler-search text-xxl' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {isUserRoleLoading ? (
        <Typography>Loading roles...</Typography>
      ) : (
        <Card>
          <DynamicTable
            tableName='User Roles List'
            columns={columns}
            data={filteredRoles}
            pagination={{ pageIndex: page - 1, pageSize: limit }}
            totalCount={userRoleData?.meta?.totalRecords}
            onPageChange={newPage => setPage(newPage + 1)}
            onRowsPerPageChange={newPageSize => setLimit(newPageSize)}
          />
        </Card>
      )}
    </div>
  )
}

export default UserRolesAndPermisstionList
