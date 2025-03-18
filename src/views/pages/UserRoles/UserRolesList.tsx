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
  Grid,
  Button,
  Drawer,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Pagination,
  Divider,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

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
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false)
  const [tempPermissionFilters, setTempPermissionFilters] = useState({})
  const [appliedPermissionFilters, setAppliedPermissionFilters] = useState({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const permissionsList = [
    'user_create',
    'user_read',
    'user_update',
    'user_delete',
    'role_create',
    'role_read',
    'role_update',
    'role_delete',
    'approval_create',
    'approval_read',
    'approval_update',
    'approval_delete',
    'jd_create',
    'jd_read',
    'jd_update',
    'jd_delete',
    'vacancy_create',
    'vacancy_read',
    'vacancy_update',
    'vacancy_delete',
    'recruitment_create',
    'recruitment_read',
    'recruitment_update',
    'recruitment_delete',
    'branch_read',
    'bucket_create',
    'bucket_read',
    'bucket_update',
    'bucket_delete',
    'approvalmatrix_create',
    'approvalmatrix_read',
    'approvalmatrix_update',
    'approvalmatrix_delete',
    'general_create',
    'general_read',
    'general_update',
    'general_delete'
  ]

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 500)

    return () => clearTimeout(timer)
  }, [searchText])

  // Fetch user roles
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

  // Filter roles
  const filteredRoles = useMemo(() => {
    const activePermissions = Object.keys(appliedPermissionFilters).filter(key => appliedPermissionFilters[key])

    if (activePermissions.length === 0) return userRoleData?.data || []

    return (userRoleData?.data || []).filter(role =>
      activePermissions.every(permission => (role.permissions || []).includes(permission))
    )
  }, [userRoleData?.data, appliedPermissionFilters])

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)

  // const handleAddUser = () => router.push('/user-role/add/add-role')

  const handleEdit = (role: any) => {
    const query = new URLSearchParams({
      id: role.id, name: role.name
    }).toString()

    router.push(`/user-role/edit/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const handleView = (role: any) => {
    const query = new URLSearchParams({ id: role.id, name: role.name }).toString()

    router.push(`/user-role/view/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const handleFilterOpen = () => {
    setTempPermissionFilters(appliedPermissionFilters)
    setOpenFilterDrawer(true)
  }

  const handleFilterClose = () => setOpenFilterDrawer(false)

  const handleFilterApply = () => {
    setAppliedPermissionFilters(tempPermissionFilters)
    handleFilterClose()
  }

  const handleFilterClear = () => {
    const clearedFilters = permissionsList.reduce((acc, perm) => ({ ...acc, [perm]: false }), {})

    setTempPermissionFilters(clearedFilters)
    setAppliedPermissionFilters(clearedFilters)
    handleFilterClose()
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setTempPermissionFilters(prev => ({ ...prev, [permission]: checked }))
  }

  const handleRemoveFilter = (permission: string) => {
    setAppliedPermissionFilters(prev => ({ ...prev, [permission]: false }))
    setTempPermissionFilters(prev => ({ ...prev, [permission]: false }))
  }

  const handlePageChange = (event: any, value: number) => setPage(value)
  const handleChangeLimit = (value: any) => setLimit(value)

  // Initialize filters
  useEffect(() => {
    const initialFilters = permissionsList.reduce((acc, perm) => ({ ...acc, [perm]: false }), {})

    setTempPermissionFilters(initialFilters)
    setAppliedPermissionFilters(initialFilters)
  }, [])

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
                      <i className='tabler-search text-xxl' />
                    </InputAdornment>
                  )
                }}
              />
              <Button variant='outlined' onClick={handleFilterOpen} startIcon={<i className='tabler-filter' />}>
                Filter
              </Button>
            </Box>
            {/* <Button variant='contained' onClick={handleAddUser} startIcon={<i className='tabler-plus' />}>
              Add Role
            </Button> */}
          </Box>
          {Object.keys(appliedPermissionFilters).some(key => appliedPermissionFilters[key]) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.keys(appliedPermissionFilters)
                .filter(key => appliedPermissionFilters[key])
                .map(permission => (
                  <Chip
                    key={permission}
                    label={permission}
                    onDelete={() => handleRemoveFilter(permission)}
                    size='small'
                    color='primary'
                  />
                ))}
              <Button size='small' color='error' onClick={handleFilterClear}>
                Clear All
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Drawer anchor='right' open={openFilterDrawer} onClose={handleFilterClose}>
        <Box sx={{ width: 300, p: 5 }}>
          <Typography variant='h5'>Filter by Permissions</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormGroup>
            {permissionsList.map(permission => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={tempPermissionFilters[permission] || false}
                    onChange={e => handlePermissionChange(permission, e.target.checked)}
                  />
                }
                label={permission}
              />
            ))}
          </FormGroup>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleFilterClear} color='error'>
              Clear
            </Button>
            <Button onClick={handleFilterApply} variant='contained'>
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>

      {isUserRoleLoading ? (
        <Typography>Loading roles...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((item: any) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    onClick={() => handleView(item)}
                    sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', border: '1px solid #ddd' }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {item.name.toUpperCase()}
                        </Typography>
                        <IconButton
                          onClick={(e: any) => {
                            e.stopPropagation()
                            handleEdit(item)
                          }}
                        >
                          <i className='tabler-edit' />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ width: '100%', textAlign: 'center', py: 4 }}>No roles found</Typography>
            )}
          </Grid>
          {userRoleData?.meta?.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6, gap: 2 }}>
              <FormControl size='small' sx={{ minWidth: 70 }}>
                <InputLabel>Count</InputLabel>
                <Select value={limit} onChange={e => handleChangeLimit(e.target.value)} label='Count'>
                  {[10, 25, 50, 100].map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Pagination
                color='primary'
                shape='rounded'
                showFirstButton
                showLastButton
                count={userRoleData.meta.totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}
    </div>
  )
}

export default UserRolesAndPermisstionList
