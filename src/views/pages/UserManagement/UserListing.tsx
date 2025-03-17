'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import {
  Box,
  IconButton,
  Button,
  Card,
  CardContent,
  Drawer,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  CircularProgress,
  TextField,
  Divider
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import { createColumnHelper } from '@tanstack/react-table'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserManagement, fetchEmployees, fetchUserRole } from '@/redux/UserManagment/userManagementSlice'

interface FilterState {
  active: boolean
  inactive: boolean
  adUser: boolean
  nonAdUser: boolean
  roles: string[]
}

const UserListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    active: false,
    inactive: false,
    adUser: false,
    nonAdUser: false,
    roles: []
  })

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userManagementData, isUserManagementLoading, employeeData } = useAppSelector(
    state => state.UserManagementReducer
  )
  const { userRoleData, isUserRoleLoading } = useAppSelector(state => state.UserRoleReducer)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const params: any = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }

    if (debouncedSearch) params.search = debouncedSearch

    
    const statusFilters = []
    if (filters.active) statusFilters.push('Active')
    if (filters.inactive) statusFilters.push('Inactive')
    if (statusFilters.length > 0) params.status = statusFilters.join(',')

    
    const sourceFilters = []
    if (filters.adUser) sourceFilters.push('AD')
    if (filters.nonAdUser) sourceFilters.push('Non-AD')
    if (sourceFilters.length > 0) params.source = sourceFilters.join(',')

    
    if (filters.roles.length > 0) params.roles = filters.roles.join(',')

    dispatch(fetchEmployees({}))
    dispatch(fetchUserManagement(params))
    dispatch(fetchUserRole({ limit: 1000 }))
  }, [debouncedSearch, filters, pagination, dispatch])

  const columnHelper = createColumnHelper<any>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('serialNo', {
        header: 'No',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
      }),
      columnHelper.accessor('employeeCode', {
        header: 'Employee Code',
        cell: ({ row }) => <Typography>{row.original.employeeCode || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row }) => <Typography>{row.original.firstName || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: ({ row }) => <Typography>{row.original.lastName || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('roles', {
        header: 'Role',
        cell: ({ row }) => (
          <Typography>
            {Array.isArray(row.original.roles) && row.original.roles.length > 0
              ? row.original.roles[0]
              : row.original.role || 'No Role'}
          </Typography>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography color={row.original.status?.toLowerCase() === 'active' ? 'success.main' : 'error.main'}>
            {row.original.status || 'N/A'}
          </Typography>
        ),
      }),
      // columnHelper.accessor('action', {
      //   header: 'Action',
      //   cell: ({ row }) => (
      //     <IconButton onClick={() => handleEdit(row.original.id, row.original)}>
      //       <i className="tabler-edit" />
      //     </IconButton>
      //   ),
      // }),
      columnHelper.accessor('source', {
        header: 'Source',
        cell: ({ row }) => <Typography>{row.original.source || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('mobileNumber', {
        header: 'Mobile Number',
        cell: ({ row }) => <Typography>{row.original.mobileNumber || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('band', {
        header: 'Band',
        cell: ({ row }) => <Typography>{row.original.band || 'N/A'}</Typography>,
      }),
      columnHelper.accessor('grade', {
        header: 'Grade',
        cell: ({ row }) => <Typography>{row.original.grade || 'N/A'}</Typography>,
      }),
    ],
    [columnHelper]
  )

  const enrichedUserData = useMemo(() => {
    const users = userManagementData || []
    const employees = employeeData || []

    return users.map(user => {
      const employee = employees.find(emp => emp.employeeCode === user.employeeCode)
      return {
        ...user,
        mobileNumber: employee?.mobileNumber || user.mobileNumber || 'N/A',
        band: employee?.employeeDetails?.band || 'N/A',
        grade: employee?.employeeDetails?.grade || 'N/A',
        roles: user.roles || (user.role ? [user.role] : []),
      }
    })
  }, [userManagementData, employeeData])
  const availableRoles = useMemo(() => userRoleData?.data?.map(role => role.name) || [], [userRoleData])
  const totalCount = userManagementData?.length || 0

  // const handleEdit = (id: string | number, rowData: any) => {
  //   const params = new URLSearchParams({
  //     employeeCode: rowData.employeeCode || '',
  //     firstName: rowData.firstName || '',
  //     lastName: rowData.lastName || '',
  //     email: rowData.email || '',
  //     role: rowData.roles?.[0] || rowData.role || '',
  //   }).toString()
  //   router.push(`/user-management/edit/${id}?${params}`)
  // }

  const handleFilterChange = (type: keyof FilterState | string, checked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      if (type === 'active' || type === 'inactive' || type === 'adUser' || type === 'nonAdUser') {
        newFilters[type] = checked
      } else {
        newFilters.roles = checked ? [...prev.roles, type] : prev.roles.filter(r => r !== type)
      }
      return newFilters
    })
  }

  const handleRemoveFilter = (type: keyof FilterState | string) => {
    handleFilterChange(type, false)
  }

  const handleClearFilters = () => {
    setFilters({ active: false, inactive: false, adUser: false, nonAdUser: false, roles: [] })
    setIsFilterOpen(false) 
  }

  const handleApplyFilters = () => {
    setIsFilterOpen(false) 
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.400' }} />,
                    endAdornment: searchTerm && (
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsFilterOpen(true)}
                  startIcon={<i className="tabler-filter" />}
                >
                  Filter
                </Button>
              </Box>
              {/* <Button
                variant="contained"
                onClick={() => router.push('/user-management/add/add-new-user')}
                startIcon={<i className="tabler-plus" />}
              >
                Add User
              </Button> */}
            </Box>
            {(filters.active || filters.inactive || filters.adUser || filters.nonAdUser || filters.roles.length > 0) && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {filters.active && (
                  <Chip label="Active Users" onDelete={() => handleRemoveFilter('active')} color="primary" />
                )}
                {filters.inactive && (
                  <Chip label="Inactive Users" onDelete={() => handleRemoveFilter('inactive')} color="primary" />
                )}
                {filters.adUser && (
                  <Chip label="AD Users" onDelete={() => handleRemoveFilter('adUser')} color="primary" />
                )}
                {filters.nonAdUser && (
                  <Chip label="Non-AD Users" onDelete={() => handleRemoveFilter('nonAdUser')} color="primary" />
                )}
                {filters.roles.map(role => (
                  <Chip key={role} label={role} onDelete={() => handleRemoveFilter(role)} color="primary" />
                ))}
                <Button size="small" color="error" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
        <Card>
          {isUserManagementLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DynamicTable
              columns={columns}
              data={enrichedUserData}
              pagination={pagination}
              totalCount={totalCount}
              onPageChange={newPage => setPagination(prev => ({ ...prev, pageIndex: newPage }))}
              onRowsPerPageChange={newPageSize => setPagination({ pageIndex: 0, pageSize: newPageSize })}
            />
          )}
        </Card>
      </Box>

      <Drawer anchor="right" open={isFilterOpen} onClose={() => setIsFilterOpen(false)} sx={{ '& .MuiDrawer-paper': { width: 300, p: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Filter Users</Typography>
          <IconButton onClick={() => setIsFilterOpen(false)}>
            <ClearIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <FormGroup>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Status
          </Typography>
          <FormControlLabel
            control={<Checkbox checked={filters.active} onChange={e => handleFilterChange('active', e.target.checked)} />}
            label="Active Users"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.inactive} onChange={e => handleFilterChange('inactive', e.target.checked)} />}
            label="Inactive Users"
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Source
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={<Checkbox checked={filters.adUser} onChange={e => handleFilterChange('adUser', e.target.checked)} />}
            label="AD Users"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.nonAdUser} onChange={e => handleFilterChange('nonAdUser', e.target.checked)} />}
            label="Non-AD Users"
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Roles
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isUserRoleLoading ? (
            <CircularProgress size={20} />
          ) : (
            availableRoles.map(role => (
              <FormControlLabel
                key={role}
                control={<Checkbox checked={filters.roles.includes(role)} onChange={e => handleFilterChange(role, e.target.checked)} />}
                label={role}
              />
            ))
          )}
        </FormGroup>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button fullWidth variant="outlined" color="error" onClick={handleClearFilters}>
            Clear
          </Button>
          <Button fullWidth variant="contained" onClick={handleApplyFilters}>
            Apply
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default UserListing
