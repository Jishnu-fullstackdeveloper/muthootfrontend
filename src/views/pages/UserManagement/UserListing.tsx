'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Chip,
  Drawer,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  Typography

  // Autocomplete
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon, FilterList as FilterListIcon } from '@mui/icons-material'

import GridIcon from '@/icons/GridAndTableIcons/Grid'
import TableIcon from '@/icons/GridAndTableIcons/TableIcon'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserManagement } from '@/redux/UserManagment/userManagementSlice'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

// import { ROUTES } from '@/utils/routes'

// Lazy load UserTable and UserGrid
const UserTable = dynamic(() => import('./UserListingTable'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

const UserGrid = dynamic(() => import('./UserListingGrid'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
})

interface Role {
  id: string
  name: string
  permissions: { id: string; name: string; description: string }[]
  data?: any
  pagination?: any
}

interface DesignationRoles {
  id: string
  name: string
  description: string
  groupRoles: string
  permissions: { id: string; name: string; description: string }[]
  map?: any
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
  designationRoles?: DesignationRoles // Allow both string[], Role[], or undefined for compatibility
  GroupRoles?: string
  designation?: string
  roles?: (Role | string)[]
  role?: any
  data?: any
  pagination?: any
  totalPages?: any
}

interface FetchParams {
  limit: number
  page: number
  search?: string
  filters?: string[]
}

interface Pagination {
  totalPages: number
  currentPage: number
  totalItems: number
  limit: number
}

interface UserManagementResponse {
  data: User[]
  pagination: Pagination
  userManagementData?: any
  isUserManagementLoading?: any
}

const UserListing = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [gridPage, setGridPage] = useState(1) // Page for grid view (lazy loading)
  const [gridLimit] = useState(10) // Fixed limit for grid view
  const [tablePage, setTablePage] = useState(1) // Page for table view (pagination)
  const [tableLimit, setTableLimit] = useState(10) // Mutable limit for table view
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([]) // For grid view (lazy loading)
  const [tableUsers, setTableUsers] = useState<User[]>([]) // For table view (pagination)

  const [filters, setFilters] = useState({
    active: false,
    inactive: false,
    ad: false,
    nonAd: false,
    selectedRoles: [] as string[]
  })

  const router = useRouter()
  const dispatch = useAppDispatch()

  const { userManagementData, isUserManagementLoading } = useAppSelector(
    state => state.UserManagementReducer
  ) as unknown as UserManagementResponse

  const { userRoleData } = useAppSelector(state => state.UserRoleReducer)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setGridPage(1)
      setTablePage(1)
      setAllUsers([])
      setTableUsers([])
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const filterValues = [
      ...(filters.active ? ['Active'] : []),
      ...(filters.inactive ? ['Inactive'] : []),
      ...(filters.ad ? ['AD_USER'] : []),
      ...(filters.nonAd ? ['NON_AD_USER'] : [])
    ]

    const params: FetchParams = {
      limit: view === 'grid' ? gridLimit : tableLimit,
      page: view === 'grid' ? gridPage : tablePage,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(filterValues.length > 0 && { filters: filterValues })
    }

    console.log('Fetching with params:', params)
    dispatch(fetchUserManagement(params)).then(result => {
      console.log('fetchUserManagement result:', result)
    })
    dispatch(fetchUserRole({ limit: 10, page: 1 }))
  }, [debouncedSearch, filters, gridPage, tablePage, view, gridLimit, tableLimit, dispatch])

  const handleTablePageChange = (newPage: number) => {
    setTablePage(newPage)
  }

  const handleTableRowsPerPageChange = (newPageSize: number) => {
    setTableLimit(newPageSize)
    setTablePage(1)
  }

  const handleGridLoadMore = (newPage: number) => {
    setGridPage(newPage)
  }

  useEffect(() => {
    if (userManagementData?.data) {
      if (view === 'grid') {
        // Append for grid view (lazy loading)
        setAllUsers(prev => {
          const newUsers = userManagementData.data.filter(
            user => !prev.some(existing => existing.userId === user.userId)
          )

          return [...prev, ...newUsers]
        })
      } else {
        // Replace for table view (pagination)
        setTableUsers(userManagementData.data)
      }
    }
  }, [userManagementData, view])

  // Reset inactive view's state when switching views
  useEffect(() => {
    if (view === 'grid') {
      setTablePage(1)
      setTableUsers([])
    } else {
      setGridPage(1)
      setAllUsers([])
    }
  }, [view])

  const handleFilterChange = (filterName: keyof typeof filters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [filterName]: event.target.checked }))
    setGridPage(1)
    setTablePage(1)
    setAllUsers([])
    setTableUsers([])
  }

  const handleClearFilters = () => {
    setFilters({ active: false, inactive: false, ad: false, nonAd: false, selectedRoles: [] })
    setGridPage(1)
    setTablePage(1)
    setAllUsers([])
    setTableUsers([])
  }

  const handleRemoveFilter = (filterName: keyof typeof filters | string) => {
    if (filterName in filters && filterName !== 'selectedRoles') {
      setFilters(prev => ({ ...prev, [filterName]: false }))
    } else {
      setFilters(prev => ({
        ...prev,
        selectedRoles: prev.selectedRoles.filter(role => role !== filterName)
      }))
    }

    setGridPage(1)
    setTablePage(1)
    setAllUsers([])
    setTableUsers([])
  }

  // const safeGetData = <T,>(source: any): T[] => (source?.data && Array.isArray(source.data) ? source.data : [])

  const enrichedUserData = useMemo(() => {
    // const roles = safeGetData<Role>(userRoleData)
    const users = view === 'grid' ? allUsers : tableUsers

    return users.map(user => {
      if (Array.isArray(user.roles)) {
        // If all elements are Role objects, return as Role[]
        if (user.roles.every(role => typeof role === 'object' && role !== null && 'id' in role && 'name' in role)) {
          return { ...user, roles: user.roles as Role[] }
        }

        // If all elements are strings, return as string[]
        if (user.roles.every(role => typeof role === 'string')) {
          return { ...user, roles: user.roles as string[] }
        }

        // If mixed, convert all to string[]
        return {
          ...user,
          roles: user.roles.map(role => (typeof role === 'string' ? role : (role as Role).name)) as string[]
        }
      } else if (user.role) {
        // If single role, wrap as Role[]
        return { ...user, roles: [user.role] as Role[] }
      } else {
        return { ...user, roles: [] as string[] }
      }
    })
  }, [allUsers, tableUsers, userRoleData, view])

  const handleEdit = (userId: string) => {
    router.push(`/user-management/edit?id=${userId}`)
  }

  const handleView = (role: any) => {
    const query = new URLSearchParams({ id: role.id, name: role.name }).toString()

    router.push(`/user-role/view/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  // const handleGridLoadMore = (newPage: number) => {
  //   setGridPage(newPage)
  // }

  // const handleTablePageChange = (newPage: number) => {
  //   setTablePage(newPage)
  //   setTableUsers([]) // Clear table data while fetching new page
  // }

  // const handleTableRowsPerPageChange = (newPageSize: number) => {
  //   setTableLimit(newPageSize)
  //   setTablePage(1)
  //   setTableUsers([])
  // }

  const selectedFilters = [
    ...(filters.active ? [{ key: 'active', label: 'active' }] : []),
    ...(filters.inactive ? [{ key: 'inactive', label: 'inactive' }] : []),
    ...(filters.ad ? [{ key: 'ad', label: 'ad_user' }] : []),
    ...(filters.nonAd ? [{ key: 'nonAd', label: 'non_ad_user' }] : [])
  ]

  const pagination = userManagementData?.pagination || { totalPages: 1, currentPage: 1, totalItems: 0, limit: 10 }

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
           <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fc', borderRadius: '12px' }}>
              <Box
                sx={{
                  backgroundColor: view === 'grid' ? '#0096DA' : 'transparent',
                  color: view === 'grid' ? 'white' : '#0096DA',
                  borderRadius: '8px',
                  padding: 2,
                  cursor: 'pointer'
                }}
                onClick={() => setView('grid')}
              >
                <GridIcon className={''} />
              </Box>
              <Box
                sx={{
                  backgroundColor: view === 'table' ? '#0096DA' : 'transparent',
                  color: view === 'table' ? 'white' : '#0096DA',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  padding: 1
                }}
                onClick={() => setView('table')}
              >
                <TableIcon className='h-5 w-6' />
              </Box>
             
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
        <Box
          sx={{
            width: 300,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#fafafa'
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6' fontWeight={600}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterOpen(false)} size='small'>
              <i className='tabler-x' style={{ fontSize: '20px' }} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filter Sections */}
          <Box sx={{ flexGrow: 2, display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 2 }}>
            {/* Status Filter */}
            <Box gap={3}>
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                Status
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={filters.active} onChange={handleFilterChange('active')} size='small' />}
                label='Active'
              />
              <FormControlLabel
                control={<Checkbox checked={filters.inactive} onChange={handleFilterChange('inactive')} size='small' />}
                label='Inactive'
              />
            </Box>

            {/* Source Filter */}
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                Source
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={filters.ad} onChange={handleFilterChange('ad')} size='small' />}
                label='AD Users'
              />
              <FormControlLabel
                control={<Checkbox checked={filters.nonAd} onChange={handleFilterChange('nonAd')} size='small' />}
                label='Non-AD Users'
              />
            </Box>

            <Button
              variant='outlined'
              color='error'
              onClick={handleClearFilters}
              sx={{ mt: 3, borderRadius: 1 }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Box>

          {/* Clear Button */}
        </Box>
      </Drawer>

      {isUserManagementLoading && (view === 'grid' ? gridPage === 1 : tablePage === 1) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : userManagementData?.error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography color='error'>Error loading data: {userManagementData.error}</Typography>
        </Box>
      ) : enrichedUserData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <Typography>No data available</Typography>
        </Box>
      ) : view === 'grid' ? (
        <UserGrid
          data={enrichedUserData}
          loading={isUserManagementLoading}
          onEdit={handleEdit}
          page={gridPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalItems || pagination.totalCount || 0}
          onLoadMore={handleGridLoadMore}
        />
      ) : (
        <UserTable
          data={enrichedUserData}
          page={tablePage}
          limit={tableLimit}
          totalCount={pagination.totalItems || pagination.totalCount || 0}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          onEdit={handleEdit}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default UserListing
