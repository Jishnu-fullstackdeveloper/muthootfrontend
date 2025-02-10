'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import {
  Box,
  Tooltip,
  IconButton,
  InputAdornment,
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
  Chip
} from '@mui/material'
import { TextFieldProps } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useRouter } from 'next/navigation'
import DynamicTable from '@/components/Table/dynamicTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import DeleteConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'

// Sample data - replace with your data source
const sampleData = [
  {
    userId: 1001,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    status: 'Active'
  },

  {
    userId: 1002,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    status: 'Inactive '
  },

  {
    userId: 1003,
    firstName: 'Raj',
    lastName: 'Kumar',
    email: 'raj@example.com',
    status: 'Active'
  },
  {
    userId: 1004,
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit@example.com',
    status: 'Inactive'
  }

  // Add more sample data as needed
]

const UserListing = () => {
  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10
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
  const columnHelper = createColumnHelper<any>()

  // Define columns using useMemo
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
            {/* View Button */}
            {/* <IconButton
      //         onClick={(e: any) => {
      //           e.stopPropagation()
      //           handleView(row.original.id)
      //         }}
      //       >
      //         <i className='tabler-eye' />
      //       </IconButton> */}

            {/* Edit Button */}
            <IconButton
              onClick={(e: any) => {
                e.stopPropagation()
                handleEdit(row.original.id)
              }}
            >
              <i className='tabler-edit' />
            </IconButton>

            {/* Delete Button */}
            {/* <IconButton
      //         aria-label='Delete User'
      //         onClick={(e: any) => {
      //           e.stopPropagation()
      //           handleDelete(row.original.id)
      //         }}
      //       >
      //         <i className='tabler-trash' />
      //       </IconButton> */}
          </Box>
        )
      })
    ],
    [columnHelper]
  )

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} variant='outlined' />
  }

  // Handler functions
  const handleAddUser = () => {
    router.push('/user-management/add/add-new-user')
  }

  // const handleView = (id: number) => {
  //   router.push(`/user-management/view/${id}`)
  // }

  const handleEdit = (id: number) => {
    router.push(`/user-management/edit/${id}`)
  }

  // const handleDelete = (id: number) => {
  //   setSelectedUserId(id)
  //   setOpenModal(true)
  // }

  // const handleDeleteConfirm = () => {
  //   // Add your delete logic here
  //   console.log('Deleting user:', selectedUserId)
  //   setOpenModal(false)
  //   setSelectedUserId(null)
  // }

  // const handleDeleteCancel = () => {
  //   setOpenModal(false)
  //   setSelectedUserId(null)
  // }

  // Update filteredData to include userId in search
  const filteredData = useMemo(() => {
    return sampleData.filter(user => {
      const searchTerm = search.toLowerCase().trim()

      const matchesSearch =
        // Convert userId to string for searching
        user.userId.toString().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)

      const matchesStatus =
        (!appliedFilters.active && !appliedFilters.inactive) ||
        (appliedFilters.active && user.status.toLowerCase().trim() === 'active') ||
        (appliedFilters.inactive && user.status.toLowerCase().trim() === 'inactive')

      return matchesSearch && matchesStatus
    })
  }, [search, sampleData, appliedFilters])

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

  return (
    <div>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <DebouncedInput
                value={search}
                onChange={(value: any) => setSearch(value)}
                placeholder='Search by ID, name, or email...'
                sx={{ width: '300px' }}
                size='small'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }}
              />
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
                <Checkbox
                  checked={tempFilters.active}
                  onChange={e => setTempFilters(prev => ({ ...prev, active: e.target.checked }))}
                />
              }
              label='Active Users'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.inactive}
                  onChange={e => setTempFilters(prev => ({ ...prev, inactive: e.target.checked }))}
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
        <DynamicTable columns={columns} data={filteredData} />
      </Card>

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
