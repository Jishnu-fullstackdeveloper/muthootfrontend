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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  CircularProgress,
  TextField
} from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserManagement, fetchEmployees } from '@/redux/userManagementSlice'
import { fetchUserRole } from '@/redux/userRoleSlice'

const UserListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [openFilterModal, setOpenFilterModal] = useState(false)
  const [tempFilters, setTempFilters] = useState({
    active: false,
    inactive: false,
    roles: [] // Added roles array
  })
  const [appliedFilters, setAppliedFilters] = useState({
    active: false,
    inactive: false,
    roles: [] // Added roles array
  })

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userManagementData, isUserManagementLoading, employeeData } = useAppSelector(
    (state) => state.UserManagementReducer
  )
  const { 
    userRoleData, 
    isUserRoleLoading 
  } = useAppSelector((state) => state.UserRoleReducer)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize
    }
    if (debouncedSearch) params.search = debouncedSearch
    if (appliedFilters.active && !appliedFilters.inactive) params.status = 'Active'
    else if (!appliedFilters.active && appliedFilters.inactive) params.status = 'Inactive'
    if (appliedFilters.roles.length > 0) params.roles = appliedFilters.roles.join(',')
    
    dispatch(fetchEmployees({}))
    dispatch(fetchUserManagement(params))
    dispatch(fetchUserRole({}))
  }, [debouncedSearch, appliedFilters, pagination, dispatch])

  const columnHelper = createColumnHelper()

  const columns = useMemo(() => [
    columnHelper.accessor('serialNo', {
      header: 'No',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.index + 1}
        </Typography>
      )
    }),
    columnHelper.accessor('employeeCode', {
      header: 'Employee Code',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.employeeCode || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.firstName || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.lastName || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('roles', {
      header: 'Role',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {Array.isArray(row.original.roles) && row.original.roles.length > 0 
            ? row.original.roles[0] 
            : row.original.role || 'No Role'}
        </Typography>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Typography
          color={row.original.status?.toLowerCase().trim() === 'active' ? 'success.main' : 'error.main'}
          className='font-medium'
        >
          {row.original.status || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row.original.id, row.original)
            }}
          >
            <i className='tabler-edit' />
          </IconButton>
        </Box>
      )
    }),
    columnHelper.accessor('mobileNumber', {
      header: 'Mobile Number',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.mobileNumber || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.email || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('band', {
      header: 'Band',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.band || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('grade', {
      header: 'Grade',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.grade || 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('designation', {
      header: 'Designation',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.designation || 'N/A'}
        </Typography>
      )
    }),
  ], [columnHelper])

  const handleAddUser = () => router.push('/user-management/add/add-new-user')

  const handleEdit = (id, rowData) => {
    const queryParams = new URLSearchParams({
      employeeCode: rowData.employeeCode || '',
      firstName: rowData.firstName || '',
      lastName: rowData.lastName || '',
      email: rowData.email || '',
      role: Array.isArray(rowData.roles) && rowData.roles.length > 0 ? rowData.roles[0] : rowData.role || ''
    }).toString()
    
    router.push(`/user-management/edit/${id}?${queryParams}`)
  }

  const handleFilterOpen = () => {
    setTempFilters(appliedFilters)
    setOpenFilterModal(true)
  }

  const handleFilterClose = () => {
    setTempFilters(appliedFilters)
    setOpenFilterModal(false)
  }

  const handleFilterApply = () => {
    setAppliedFilters(tempFilters)
    handleFilterClose()
  }

  const handleFilterClear = () => {
    const clearedFilters = { active: false, inactive: false, roles: [] }
    setTempFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    handleFilterClose()
  }

  const handleRemoveFilter = (filterType) => {
    if (filterType === 'active' || filterType === 'inactive') {
      setAppliedFilters(prev => ({ ...prev, [filterType]: false }))
    } else {
      setAppliedFilters(prev => ({
        ...prev,
        roles: prev.roles.filter(role => role !== filterType)
      }))
    }
  }

  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  const handleClearSearch = () => setSearchTerm('')

  const handleFilterChange = (filterType, checked) => {
    if (filterType === 'active' || filterType === 'inactive') {
      setTempFilters(prev => ({ ...prev, [filterType]: checked }))
    } else {
      setTempFilters(prev => ({
        ...prev,
        roles: checked 
          ? [...prev.roles, filterType]
          : prev.roles.filter(role => role !== filterType)
      }))
    }
  }

  const enrichedUserData = useMemo(() => {
    const users = userManagementData?.data || []
    const employees = employeeData?.data || employeeData || []

    return users.map(user => {
      const matchingEmployee = employees.find(emp => emp.employeeCode === user.employeeCode)
      return {
        ...user,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: matchingEmployee?.mobileNumber || user.mobileNumber || 'N/A',
        employeeCode: user.employeeCode,
        roles: user.roles || (user.role ? [user.role] : []),
        band: matchingEmployee?.employeeDetails?.band || 'N/A',
        grade: matchingEmployee?.employeeDetails?.grade || 'N/A',
        designation: matchingEmployee?.employeeDetails?.designation || 'N/A',
      }
    })
  }, [userManagementData, employeeData])

  const totalCount = useMemo(() => {
    return userManagementData?.totalCount || 0
  }, [userManagementData])

  const availableRoles = useMemo(() => {
    return userRoleData?.data?.map(role => role.name) || []
  }, [userRoleData])

  return (
    <div>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box className='flex-1 min-w-[200px]'>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon className='mr-2 text-gray-400' />,
                    endAdornment: searchTerm && (
                      <IconButton size='small' onClick={handleClearSearch}>
                        <ClearIcon />
                      </IconButton>
                    )
                  }}
                />
              </Box>
              <Button
                variant='outlined'
                onClick={handleFilterOpen}
                startIcon={<i className='tabler-filter' />}
                size='medium'
              >
                Filter
              </Button>
            </Box>
            <Button variant='contained' onClick={handleAddUser} startIcon={<i className='tabler-plus' />} size='medium'>
              Add User
            </Button>
          </Box>

          {(appliedFilters.active || appliedFilters.inactive || appliedFilters.roles.length > 0) && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              {appliedFilters.active && (
                <Chip label='Active Users' onDelete={() => handleRemoveFilter('active')} size='small' color='primary' />
              )}
              {appliedFilters.inactive && (
                <Chip label='Inactive Users' onDelete={() => handleRemoveFilter('inactive')} size='small' color='primary' />
              )}
              {appliedFilters.roles.map(role => (
                <Chip
                  key={role}
                  label={role}
                  onDelete={() => handleRemoveFilter(role)}
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

      <Dialog open={openFilterModal} onClose={handleFilterClose}>
        <DialogTitle>Filter Users</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={tempFilters.active} onChange={e => handleFilterChange('active', e.target.checked)} />}
              label='Active Users'
            />
            <FormControlLabel
              control={<Checkbox checked={tempFilters.inactive} onChange={e => handleFilterChange('inactive', e.target.checked)} />}
              label='Inactive Users'
            />
            {isUserRoleLoading ? (
              <CircularProgress size={20} />
            ) : (
              availableRoles.map(role => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={tempFilters.roles.includes(role)}
                      onChange={e => handleFilterChange(role, e.target.checked)}
                    />
                  }
                  label={role}
                />
              ))
            )}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClear} color='error'>Clear Filters</Button>
          <Button onClick={handleFilterApply} variant='contained'>Apply</Button>
        </DialogActions>
      </Dialog>

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
            onPageChange={(newPage) => setPagination(prev => ({ ...prev, pageIndex: newPage }))}
            onRowsPerPageChange={(newPageSize) => setPagination({ pageIndex: 0, pageSize: newPageSize })}
          />
        )}
      </Card>
    </div>
  )
}

export default UserListing
