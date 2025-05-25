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
  Typography,
  Grid,
  Autocomplete
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  TableView as TableChartIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchUserManagement } from '@/redux/UserManagment/userManagementSlice'
import { fetchUserRole } from '@/redux/UserRoles/userRoleSlice'

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
  designationRole?: string[] | Role[]
  GroupRoles?: string
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
    nonAd: false
  })

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userManagementData, isUserManagementLoading } = useAppSelector(state => state.UserManagementReducer)
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

    dispatch(fetchUserManagement(params))
    dispatch(fetchUserRole({ limit: 10, page: 1 }))
  }, [debouncedSearch, filters, gridPage, tablePage, view, gridLimit, tableLimit, dispatch])

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
    setFilters({ active: false, inactive: false, ad: false, nonAd: false })
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

  const safeGetData = <T,>(source: any): T[] => (source?.data && Array.isArray(source.data) ? source.data : [])

  const enrichedUserData = useMemo(() => {
    const roles = safeGetData<Role>(userRoleData)
    const users = view === 'grid' ? allUsers : tableUsers

    return users.map(user => ({
      ...user,
      roles: (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : []).map(
        roleName => roles.find(r => r.name.toLowerCase() === (roleName as string).toLowerCase()) || { name: roleName }
      )
    }))
  }, [allUsers, tableUsers, userRoleData, view])

  const handleEdit = (empCode: string | undefined, id: string) => {
    if (!empCode) return
    const query = new URLSearchParams({ id: id }).toString()

    router.push(`/user-management/user/edit/${empCode}?${query}`)
  }

  const handleView = (role: any) => {
    const query = new URLSearchParams({ id: role.id, name: role.name }).toString()

    router.push(`/user-role/view/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const handleGridLoadMore = (newPage: number) => {
    setGridPage(newPage)
  }

  const handleTablePageChange = (newPage: number) => {
    setTablePage(newPage)
    setTableUsers([]) // Clear table data while fetching new page
  }

  const handleTableRowsPerPageChange = (newPageSize: number) => {
    setTableLimit(newPageSize)
    setTablePage(1)
    setTableUsers([])
  }

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
        <Box sx={{ width: 250, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6'>Filters</Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <i className='tabler-x' style={{ fontSize: '23px' }} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
            <Box>
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
            </Box>
            <Box>
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
            </Box>
          </Grid>
          <Button variant='outlined' color='error' onClick={handleClearFilters} sx={{ mt: 2 }}>
            Clear
          </Button>
        </Box>
      </Drawer>

      {isUserManagementLoading && (view === 'grid' ? gridPage === 1 : tablePage === 1) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
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
          totalCount={pagination.totalItems}
          onLoadMore={handleGridLoadMore}
        />
      ) : (
        <UserTable
          data={enrichedUserData}
          page={tablePage}
          limit={tableLimit}
          totalCount={pagination.totalItems}
          onPageChange={handleTablePageChange}
          onRowsPerPageChange={handleTableRowsPerPageChange}
          handleEdit={handleEdit}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default UserListing
