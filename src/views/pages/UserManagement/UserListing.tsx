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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  CircularProgress,
  TextField,
  
} from '@mui/material'

import type { ColumnDef } from '@tanstack/react-table'

import { createColumnHelper } from '@tanstack/react-table'

import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

import DynamicTable from '@/components/Table/dynamicTable'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserManagement } from '@/redux/userManagementSlice'

const UserListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [openFilterModal, setOpenFilterModal] = useState(false)

  const [tempFilters, setTempFilters] = useState({
    active: false,
    inactive: false
  })

  const [appliedFilters, setAppliedFilters] = useState({
    active: false,
    inactive: false
  })

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userManagementData, isUserManagementLoading } = useAppSelector((state: any) => state.UserManagementReducer)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  let totalPages = 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const params: any = {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize
    }

    if (debouncedSearch) {
      params.search = debouncedSearch
    }

    if (appliedFilters.active && !appliedFilters.inactive) {
      params.status = 'Active'
    } else if (!appliedFilters.active && appliedFilters.inactive) {
      params.status = 'Inactive'
    }

    dispatch(fetchUserManagement(params))
  }, [debouncedSearch, appliedFilters, paginationModel])

  useEffect(() => {
    if (userManagementData?.totalCount) {
      totalPages = Math.ceil(userManagementData.totalCount / paginationModel.pageSize)
    }
  }, [userManagementData])

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('serialNo', {
        header: 'No',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.index + 1}
          </Typography>
        )
      }),
      columnHelper.accessor('userId', {
        header: 'User ID',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.userId}
          </Typography>
        )
      }),
      columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.firstName}
          </Typography>
        )
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.lastName}
          </Typography>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.email}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography
            color={row.original.status.toLowerCase().trim() === 'active' ? 'success.main' : 'error.main'}
            className='font-medium'
          >
            {row.original.status}
          </Typography>
        )
      }),

      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={(e: any) => {
                e.stopPropagation()
                handleEdit(row.original.id)
              }}
            >
              <i className='tabler-edit' />
            </IconButton>
          </Box>
        )
      })
    ],
    [columnHelper]
  )

  // const DebouncedInput = ({
  //   value: initialValue,
  //   onChange,
  //   debounce = 500,
  //   ...props
  // }: {
  //   value: string | number
  //   onChange: (value: string | number) => void
  //   debounce?: number
  // } & Omit<TextFieldProps, 'onChange'>) => {
  //   const [value, setValue] = useState(initialValue)

  //   useEffect(() => {
  //     setValue(initialValue)
  //   }, [initialValue])

  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       onChange(value)
  //     }, debounce)

  //     return () => clearTimeout(timeout)
  //   }, [value])

  //   return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} variant='outlined' />
  // }

  const handleAddUser = () => {
    router.push('/user-management/add/add-new-user')
  }

  const handleEdit = (id: number) => {
    router.push(`/user-management/edit/${id}`)
  }

  const handleFilterOpen = () => {
    setTempFilters(appliedFilters) // Initialize temp filters with current applied filters
    setOpenFilterModal(true)
  }

  const handleFilterClose = () => {
    setTempFilters(appliedFilters) // Reset temp filters to applied filters on close
    setOpenFilterModal(false)
  }

  const handleFilterApply = () => {
    setAppliedFilters(tempFilters) // Apply the temp filters
    handleFilterClose()
  }

  const handleFilterClear = () => {
    const clearedFilters = {
      active: false,
      inactive: false
    }

    setTempFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    handleFilterClose()
  }

  const handleRemoveFilter = (filterType: 'active' | 'inactive') => {
    setAppliedFilters(prev => ({
      ...prev,
      [filterType]: false
    }))
  }

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('')
  }

  // Handle filter changes
  const handleFilterChange = (filterType: 'active' | 'inactive', checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      [filterType]: checked
    }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => {
      const updatedPagination = { ...prev, pageIndex: newPage }

      console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex
      console.log('Page Size:', updatedPagination.pageSize) // Log pageSize

      return updatedPagination
    })
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    const updatedPagination = { pageIndex: 0, pageSize: newPageSize }

    console.log('Page Index:', updatedPagination.pageIndex) // Log pageIndex
    console.log('Page Size:', updatedPagination.pageSize) // Log pageSize
    setPagination(updatedPagination)
  }

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

          {/* Active Filters Display */}
          {(appliedFilters.active || appliedFilters.inactive) && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {appliedFilters.active && (
                <Chip label='Active Users' onDelete={() => handleRemoveFilter('active')} size='small' color='primary' />
              )}
              {appliedFilters.inactive && (
                <Chip
                  label='Inactive Users'
                  onDelete={() => handleRemoveFilter('inactive')}
                  size='small'
                  color='primary'
                />
              )}
              <Button
                size='small'
                color='error'
                onClick={handleFilterClear}
                sx={{
                  ml: 1,
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <Dialog open={openFilterModal} onClose={handleFilterClose}>
        <DialogTitle>Filter Users</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={tempFilters.active} onChange={e => handleFilterChange('active', e.target.checked)} />
              }
              label='Active Users'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.inactive}
                  onChange={e => handleFilterChange('inactive', e.target.checked)}
                />
              }
              label='Inactive Users'
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClear} color='error'>
            Clear Filters
          </Button>
          <Button onClick={handleFilterApply} variant='contained'>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Container */}
      <Card>
        {isUserManagementLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DynamicTable
            columns={columns}
            data={userManagementData?.data || []}
            pagination={pagination} // Pass pagination state
            onPaginationChange={setPagination} // Pass pagination change handler
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </Card>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination
          color='primary'
          shape='rounded'
          count={totalPages}
          page={paginationModel.page}
          onChange={(event, value) => {
            setPaginationModel({ ...paginationModel, page: value })
          }}
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Delete Confirmation Modal */}
      {/* <DeleteConfirmModal
        open={openModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        id={selectedUserId}
        title='Delete User'
        description='Are you sure you want to delete this user? This action cannot be undone.'
      /> */}
    </div>
  )
}

export default UserListing
