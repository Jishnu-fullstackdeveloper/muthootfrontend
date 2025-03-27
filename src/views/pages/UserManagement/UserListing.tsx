'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Grid,
  Chip,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Drawer,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import { createColumnHelper } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserManagement } from '@/redux/UserManagment/userManagementSlice'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

interface Role {
  id: string
  name: string
  description: string
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

interface FetchParams {
  limit: number
  page: number
  search?: string
  filters?: string[]
}

const UserListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    active: false,
    inactive: false,
    ad: false,
    nonAd: false,
    selectedRoles: [] as string[]
  })

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userManagementData, isUserManagementLoading } = useAppSelector(state => state.UserManagementReducer)
  const { userRoleData, isUserRoleLoading } = useAppSelector(state => state.UserRoleReducer)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const filterValues = [
      ...(filters.active ? ['Active'] : []),
      ...(filters.inactive ? ['Inactive'] : []),
      ...(filters.ad ? ['AD_USER'] : []),
      ...(filters.nonAd ? ['NON_AD_USER'] : []),
      ...filters.selectedRoles
    ]

    console.log('Applied Filters:', filterValues)

    const params: FetchParams = {
      limit,
      page,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(filterValues.length > 0 && { filters: filterValues })
    }

    console.log('Fetch Params:', params)

    dispatch(fetchUserManagement(params)).then(result => {
      console.log('Fetched User Management Data:', result)
    })

    dispatch(fetchUserRole({ limit: 1000, page: 1 }))
  }, [debouncedSearch, page, limit, filters, dispatch])

  const handleFilterChange = (filterName: keyof typeof filters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [filterName]: event.target.checked }))
    setPage(1) // Reset to first page on filter change
  }

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[]

    setFilters(prev => ({ ...prev, selectedRoles: value }))
    setPage(1) // Reset to first page on role change
  }

  const handleClearFilters = () => {
    setFilters({ active: false, inactive: false, ad: false, nonAd: false, selectedRoles: [] })
    setPage(1) // Reset to first page on clear
  }

  const handleRemoveFilter = (filterName: keyof typeof filters | string) => {
    if (filterName in filters) {
      setFilters(prev => ({ ...prev, [filterName]: false }))
    } else {
      setFilters(prev => ({
        ...prev,
        selectedRoles: prev.selectedRoles.filter(role => role !== filterName)
      }))
    }

    setPage(1) // Reset to first page on filter removal
  }

  const safeGetData = (source: any): any[] => (source?.data && Array.isArray(source.data) ? source.data : [])

  const enrichedUserData = useMemo(() => {
    const users = safeGetData(userManagementData) as User[]
    const roles = safeGetData(userRoleData) as Role[]

    const enriched = users.map(user => ({
      ...user,
      roles: (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : []).map(
        roleName => roles.find(r => r.name.toLowerCase() === (roleName as string).toLowerCase()) || { name: roleName }
      )
    }))

    console.log('Enriched User Data:', enriched)

    return enriched
  }, [userManagementData, userRoleData])

  const totalPages = useMemo(
    () => Math.ceil((userManagementData?.totalCount || 0) / limit),
    [userManagementData?.totalCount, limit]
  )

  const columnHelper = createColumnHelper<User>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('serialNo', { header: 'No', cell: ({ row }) => row.index + 1 }),
      columnHelper.accessor('employeeCode', {
        header: 'Employee Code',
        cell: ({ row }) => row.original.employeeCode || 'N/A'
      }),
      columnHelper.accessor('firstName', { header: 'First Name', cell: ({ row }) => row.original.firstName || 'N/A' }),
      columnHelper.accessor('middleName', {
        header: 'Middle Name',
        cell: ({ row }) => row.original.middleName 
      }),
      columnHelper.accessor('lastName', { header: 'Last Name', cell: ({ row }) => row.original.lastName || '-' }),

      columnHelper.accessor('roles', {
        header: 'Role',
        cell: ({ row }) =>
          Array.isArray(row.original.roles) && row.original.roles.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {row.original.roles.map((role, index) => (
                <li key={index}>
                  <Typography
                    variant='body2'
                    onClick={() => handleView(role)}
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: 'primary.main'
                    }}
                  >
                    {'name' in role ? role.name : role}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant='body2'>{row.original.role || 'No Role'}</Typography>
          )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography color={row.original.status?.toLowerCase() === 'active' ? 'success.main' : 'success.main'}>
            {row.original.status || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('source', { header: 'Source', cell: ({ row }) => row.original.source || 'N/A' }),
      columnHelper.accessor('email', { header: 'Email', cell: ({ row }) => row.original.email || 'N/A' }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: ({ row }) => row.original.designation || 'N/A'
      })
    ],
    [columnHelper]
  )

  const handleEdit = (id: string) => router.push(`/user-management/edit/${id}`)

  // const handleView = (role: Role | { name: string }) => {
  //   const roleName = 'name' in role ? role.name : role
  //   const matchedRole = safeGetData(userRoleData).find((r: Role) => r.name.toLowerCase() === roleName.toLowerCase())
  //   if (matchedRole) {
  //     const query = new URLSearchParams({
  //       name: matchedRole.name,
  //       permissions: JSON.stringify(matchedRole.permissions),
  //       description: matchedRole.description
  //     }).toString()
  //     router.push(`/user-role/view/${matchedRole.name.replace(/\s+/g, '-')}?${query}`)
  //   }
  // }

  const handleView = (role: any) => {
    const query = new URLSearchParams({ id: role.id, name: role.name }).toString()

    console.log(query, 'abcd...............')
    router.push(`/user-role/view/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const selectedFilters = [
    ...(filters.active ? [{ key: 'active', label: 'active' }] : []),
    ...(filters.inactive ? [{ key: 'inactive', label: 'inactive' }] : []),
    ...(filters.ad ? [{ key: 'ad', label: 'ad_user' }] : []),
    ...(filters.nonAd ? [{ key: 'nonAd', label: 'non_ad_user' }] : []),
    ...filters.selectedRoles.map(role => ({ key: role, label: role }))
  ]

  const availableRoles = safeGetData(userRoleData).map((role: Role) => role.name)

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size='small'
                placeholder='Search users...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
                  endAdornment: searchTerm && (
                    <IconButton size='small' onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  )
                }}
              />
              <Button variant='outlined' startIcon={<FilterListIcon />} onClick={() => setFilterOpen(true)}>
                Filter
              </Button>
            </Box>
            <Box>
              <IconButton onClick={() => setView('grid')} color={view === 'grid' ? 'primary' : 'default'}>
                <GridViewIcon />
              </IconButton>
              <IconButton onClick={() => setView('table')} color={view === 'table' ? 'primary' : 'default'}>
                <TableChartIcon />
              </IconButton>
            </Box>
          </Box>
          {selectedFilters.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedFilters.map(({ key, label }) => (
                <Chip key={key} label={label} onDelete={() => handleRemoveFilter(key)} size='small' color='primary' />
              ))}
              <Button onClick={handleClearFilters} size='small' color='error'>
                Clear ALL
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Drawer anchor='right' open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Box sx={{ width: 200, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6' gutterBottom>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <i className='tabler-x' style={{ fontSize: '23px' }} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
            {/* Status Section */}
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
              Status
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={filters.active} onChange={handleFilterChange('active')} />}
              label='Active'
            />
            <FormControlLabel
              control={<Checkbox checked={filters.inactive} onChange={handleFilterChange('inactive')} />}
              label='Inactive'
            />
            {/* Source Section */}
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
              Source
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={filters.ad} onChange={handleFilterChange('ad')} />}
              label='AD Users'
            />
            <FormControlLabel
              control={<Checkbox checked={filters.nonAd} onChange={handleFilterChange('nonAd')} />}
              label='Non-AD Users'
            />
          </Grid>
          {/* Clear Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant='outlined' color='error' onClick={handleClearFilters}>
              Clear
            </Button>
          </Box>
        </Box>
      </Drawer>

      {isUserManagementLoading || isUserRoleLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : enrichedUserData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No data available for the selected filters.</Typography>
        </Box>
      ) : view === 'grid' ? (
        <Grid container spacing={3}>
          {enrichedUserData.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={user.userId || index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
                      <IconButton onClick={() => handleEdit(user.userId)}>
                        <i className='tabler-edit' style={{ fontSize: '23px' }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                          Status:
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{
                            color: user.status?.toLowerCase() === 'active' ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {user.status || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                          Employee Code:
                        </Typography>
                        <Typography variant='body2'>{user.employeeCode || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                          User ID:
                        </Typography>
                        <Typography sx={{ whiteSpace: 'normal', overflowWrap: 'break-word', flex: 1 }}>
                          {user.userId || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                          Email:
                        </Typography>
                        <Typography variant='body2'>{user.email || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                          Designation:
                        </Typography>
                        <Typography variant='body2'>{user.designation || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
                          Roles:
                        </Typography>
                        <Box sx={{ flex: 1, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                          {Array.isArray(user.roles) && user.roles.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {user.roles.map((role, index) => (
                                <li key={index}>
                                  <Typography
                                    variant='body2'
                                    title='View Permissions'
                                    onClick={() => handleView(role)}
                                    sx={{
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      color: 'primary.main'
                                    }}
                                  >
                                    {'name' in role ? role.name : 'No Name'}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Typography variant='body2'>{user.role || 'No Role'}</Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <DynamicTable
            columns={columns}
            data={enrichedUserData}
            pagination={{ pageIndex: page - 1, pageSize: limit }}
            totalCount={userManagementData?.totalCount || 0}
            onPageChange={newPage => setPage(newPage + 1)}
            onRowsPerPageChange={newPageSize => {
              setLimit(newPageSize)
              setPage(1)
            }}
          />
        </Card>
      )}

      {totalPages > 1 && view !== 'table' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6, gap: 2 }}>
          <FormControl size='small' sx={{ minWidth: 70 }}>
            <InputLabel>Count</InputLabel>
            <Select
              value={limit}
              onChange={e => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
              label='Count'
            >
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
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </Box>
  )
}

export default UserListing
