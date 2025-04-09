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
  Chip,
  Drawer,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  Typography,
  Grid
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
import UserTable from './UserListingTable'
import UserGrid from './UserListingGrid'

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
  const [limit] = useState(10)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [hasMore, setHasMore] = useState(true)
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
  const { userRoleData } = useAppSelector(state => state.UserRoleReducer)

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Search term debounced:', searchTerm)
      setDebouncedSearch(searchTerm)
      setPage(1)
      setAllUsers([])
    }, 500)
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

    const params: FetchParams = {
      limit,
      page,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(filterValues.length > 0 && { filters: filterValues })
    }
    console.log('Fetching with params:', params)
    dispatch(fetchUserManagement(params))
    dispatch(fetchUserRole({ limit: 1000, page: 1 }))
  }, [debouncedSearch, filters, page, dispatch, limit])

  useEffect(() => {
    if (userManagementData?.data) {
      console.log('Received data:', userManagementData.data)
      setAllUsers(prev => {
        const newUsers = userManagementData.data.filter(
          (newUser: User) => !prev.some(existingUser => existingUser.userId === newUser.userId)
        )
        return [...prev, ...newUsers]
      })
      setHasMore(page * limit < (userManagementData.totalCount || 0))
    }
  }, [userManagementData, page, limit])

  const handleFilterChange = (filterName: keyof typeof filters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [filterName]: event.target.checked }))
    setPage(1)
    setAllUsers([])
  }

  const handleClearFilters = () => {
    setFilters({ active: false, inactive: false, ad: false, nonAd: false, selectedRoles: [] })
    setPage(1)
    setAllUsers([])
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
    setPage(1)
    setAllUsers([])
  }

  const safeGetData = <T,>(source: any): T[] => (source?.data && Array.isArray(source.data) ? source.data : [])

  const enrichedUserData = useMemo(() => {
    const roles = safeGetData<Role>(userRoleData)
    return allUsers.map(user => ({
      ...user,
      roles: (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : []).map(
        roleName => roles.find(r => r.name.toLowerCase() === (roleName as string).toLowerCase()) || { name: roleName }
      )
    }))
  }, [allUsers, userRoleData])

  const handleEdit = (id: string) => router.push(`/user-management/edit/${id}`)

  const handleView = (role: any) => {
    const query = new URLSearchParams({ id: role.id, name: role.name }).toString()
    router.push(`/user-role/view/${role.name.replace(/\s+/g, '-')}?${query}`)
  }

  const loadMore = () => {
    if (hasMore && !isUserManagementLoading) {
      setPage(prev => prev + 1)
    }
  }

  const selectedFilters = [
    ...(filters.active ? [{ key: 'active', label: 'active' }] : []),
    ...(filters.inactive ? [{ key: 'inactive', label: 'inactive' }] : []),
    ...(filters.ad ? [{ key: 'ad', label: 'ad_user' }] : []),
    ...(filters.nonAd ? [{ key: 'nonAd', label: 'non_ad_user' }] : []),
    ...filters.selectedRoles.map(role => ({ key: role, label: role }))
  ]

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
            <Typography variant='h6'>Filters</Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <i className='tabler-x' style={{ fontSize: '23px' }} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
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
          <Button variant='outlined' color='error' onClick={handleClearFilters} sx={{ mt: 2 }}>
            Clear
          </Button>
        </Box>
      </Drawer>

      {isUserManagementLoading && page === 1 ? (
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
          loadMore={loadMore}
          hasMore={hasMore}
        />
      ) : (
        <UserTable
          data={enrichedUserData}
          page={page}
          limit={limit}
          totalCount={userManagementData?.totalCount || 0}
          onPageChange={newPage => setPage(newPage)}
          onRowsPerPageChange={newPageSize => {
            setPage(1)
          }}
          handleEdit={handleEdit}
          handleView={handleView}
        />
      )}
    </Box>
  )
}

export default UserListing
