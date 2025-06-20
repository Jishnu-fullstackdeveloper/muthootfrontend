'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  Drawer,
  Autocomplete,
  Divider,
  Checkbox,
  CircularProgress
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  TableChart as TableChartIcon,
  InboxOutlined as InboxOutlinedIcon,
  ManageAccountsRounded as ManageAccountsRoundedIcon,
  ApartmentRounded as ApartmentRoundedIcon,
  BusinessCenterRounded as BusinessCenterRoundedIcon,
  AccountTreeRounded as AccountTreeRoundedIcon,
  PublicRounded as PublicRoundedIcon,
  PinDropRounded as PinDropRoundedIcon,
  HubRounded as HubRoundedIcon,
  CardMembershipRounded as CardMembershipRoundedIcon,
  EngineeringRounded as EngineeringRoundedIcon,
  WorkOutlineRounded as WorkOutlineRoundedIcon,
  SchoolRounded as SchoolRoundedIcon,
  PersonOutlineRounded as PersonOutlineRoundedIcon,
  MilitaryTechRounded as MilitaryTechRoundedIcon,
  TodayRounded as TodayRoundedIcon,
  EventRounded as EventRoundedIcon
} from '@mui/icons-material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { getUserId } from '@/utils/functions'
import DynamicTable from '@/components/Table/dynamicTable'
import { ROUTES } from '@/utils/routes'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import type { VacancyManagementState, Vacancy } from '@/types/vacancyManagement'
import type { BudgetManagementState } from '@/types/budget'
import { fetchVacancies, updateVacancyStatus } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import {
  fetchBranch,
  fetchCluster,
  fetchTerritory,
  fetchArea,
  fetchRegion,
  fetchZone
} from '@/redux/BudgetManagement/BudgetManagementSlice'

// Icon mapping for employee categories
const iconMap: { [key: string]: React.ElementType } = {
  Corporate: CardMembershipRoundedIcon,
  Marketing: BusinessCenterRoundedIcon,
  Analytics: SchoolRoundedIcon,
  Technical: EngineeringRoundedIcon
}

interface VacancyListingTableViewProps {
  tabMode: 'list' | 'request'
}

type FilterKey = 'Branch' | 'Cluster' | 'Area' | 'Region' | 'Zone' | 'Territory' | 'Department'

const filterOptions: FilterKey[] = ['Branch', 'Cluster', 'Area', 'Region', 'Zone', 'Territory']

const VacancyListingTableView = ({ tabMode }: VacancyListingTableViewProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const userId = getUserId()

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedTab, setSelectedTab] = useState(0)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedFilterType, setSelectedFilterType] = useState<FilterKey | null>(null)
  const [visibleVacancies, setVisibleVacancies] = useState<Vacancy[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [selectedTabs, setSelectedTabs] = useState<{ [key: string]: number }>({})
  const [selectedVacancyIds, setSelectedVacancyIds] = useState<string[]>([])
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>(null)
  const [selectedFiltersMap, setSelectedFiltersMap] = useState<Record<string, string[]>>({})

  // Redux selectors
  const { vacancyListTotal, vacancyListLoading, updateVacancyStatusLoading } = useAppSelector(
    (state: RootState) => state.vacancyManagementReducer
  ) as VacancyManagementState

  const { fetchBranchData, fetchClusterData, fetchTerritoryData, fetchAreaData, fetchRegionData, fetchZoneData } =
    useAppSelector((state: RootState) => state.budgetManagementReducer) as BudgetManagementState

  // URL query params
  const initialParams = useMemo(
    () => ({
      designation: searchParams.get('designation') ? [searchParams.get('designation')!] : undefined,
      department: searchParams.get('department') ? [searchParams.get('department')!] : undefined,
      grade: searchParams.get('grade') ? [searchParams.get('grade')!] : undefined,
      branch: searchParams.get('branch') ? [searchParams.get('branch')!] : undefined,
      cluster: searchParams.get('cluster') ? [searchParams.get('cluster')!] : undefined,
      area: searchParams.get('area') ? [searchParams.get('area')!] : undefined,
      region: searchParams.get('region') ? [searchParams.get('region')!] : undefined,
      zone: searchParams.get('zone') ? [searchParams.get('zone')!] : undefined,
      territory: searchParams.get('territory') ? [searchParams.get('territory')!] : undefined
    }),
    [searchParams]
  )

  // Filter values map
  const filterValuesMap = useMemo(
    () => ({
      Branch: fetchBranchData?.data?.map(branch => ({ id: branch.id, name: branch.name })) || [],
      Cluster: fetchClusterData?.data?.map(cluster => ({ id: cluster.id, name: cluster.name })) || [],
      Area: fetchAreaData?.data?.map(area => ({ id: area.id, name: area.name })) || [],
      Region: fetchRegionData?.data?.map(region => ({ id: region.id, name: region.name })) || [],
      Zone: fetchZoneData?.data?.map(zone => ({ id: zone.id, name: zone.name })) || [],
      Territory: fetchTerritoryData?.data?.map(territory => ({ id: territory.id, name: territory.name })) || [],
      Department: []
    }),
    [fetchBranchData, fetchClusterData, fetchAreaData, fetchRegionData, fetchZoneData, fetchTerritoryData]
  )

  // Lazy loading for grid view
  const loadMoreVacancies = useCallback(() => {
    if (vacancyListLoading || visibleVacancies.length >= vacancyListTotal || !hasMore) return
    setPage(prev => prev + 1)
  }, [vacancyListLoading, visibleVacancies.length, vacancyListTotal, hasMore])

  useEffect(() => {
    if (viewMode !== 'grid' || !hasMore || vacancyListLoading) return

    if (observerRef.current) observerRef.current.disconnect()

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreVacancies()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current = observer
    if (sentinelRef.current) observer.observe(sentinelRef.current)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [viewMode, hasMore, vacancyListLoading, loadMoreVacancies])

  // Fetch filter values
  useEffect(() => {
    setLimit(100)
    const params = { page: 1, limit: limit }

    dispatch(fetchBranch(params))
    dispatch(fetchCluster(params))
    dispatch(fetchArea(params))
    dispatch(fetchRegion(params))
    dispatch(fetchZone(params))
    dispatch(fetchTerritory(params))
  }, [dispatch])

  // Check if current user can approve or freeze
  const canApproveOrFreeze = (vacancy: any) => {
    return (
      vacancy.approvalStatus?.some(
        (status: any) => status.approverId === userId && status.approvalStatus === 'PENDING'
      ) || false
    )
  }

  // Get IDs of eligible PENDING vacancies for bulk actions
  const eligibleVacancyIds = useMemo(() => {
    return visibleVacancies.filter(vacancy => canApproveOrFreeze(vacancy)).map(vacancy => vacancy.id)
  }, [visibleVacancies, userId])

  // Handle checkbox change for grid view
  const handleCheckboxChange = (vacancyId: string, checked: boolean) => {
    setSelectedVacancyIds(prev => (checked ? [...prev, vacancyId] : prev.filter(id => id !== vacancyId)))
  }

  // Handle bulk actions
  const handleBulkAction = (status: 'APPROVED' | 'FREEZED') => {
    const vacanciesToUpdate = selectedVacancyIds.length
      ? selectedVacancyIds.filter(id => eligibleVacancyIds.includes(id))
      : eligibleVacancyIds

    if (!vacanciesToUpdate.length) {
      toast.warn(`No eligible vacancies selected for ${status.toLowerCase()}`, {
        position: 'top-right',
        autoClose: 3000
      })

      return
    }

    dispatch(updateVacancyStatus({ ids: vacanciesToUpdate, status }))
      .unwrap()
      .then(res => {
        if (res?.error?.success === false) {
          throw res?.error?.error?.message || 'Failed to update vacancies'
        }

        toast.success(`${vacanciesToUpdate.length} vacancies ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 3000
        })
        setSelectedVacancyIds([])

        // Refresh vacancies
        const statusMap = ['PENDING', 'FREEZED', 'APPROVED', '']

        const params: {
          page: number
          limit: number
          search?: string
          status?: 'PENDING' | 'APPROVED' | 'FREEZED'
          designation?: string[]
          department?: string[]
          grade?: string[]
          branch?: string[]
          cluster?: string[]
          area?: string[]
          region?: string[]
          zone?: string[]
          territory?: string[]
        } = {
          page: 1,
          limit,
          status: statusMap[selectedTab] as 'PENDING' | 'APPROVED' | 'FREEZED',
          designation: initialParams.designation,
          department: initialParams.department,
          grade: initialParams.grade,
          ...(initialParams.branch && { branch: initialParams.branch }),
          ...(initialParams.cluster && { cluster: initialParams.cluster }),
          ...(initialParams.area && { area: initialParams.area }),
          ...(initialParams.region && { region: initialParams.region }),
          ...(initialParams.zone && { zone: initialParams.zone }),
          ...(initialParams.territory && { territory: initialParams.territory })
        }

        if (searchQuery) params.search = searchQuery.trim()

        if (selectedFilterType && selectedFilters.length > 0) {
          ;(params as any)[selectedFilterType.toLowerCase()] = selectedFilters
        }

        dispatch(fetchVacancies(params))
          .unwrap()
          .then(result => {
            const newVacancies = (result.data || []).map((vacancy: any) => ({
              band: vacancy.band ?? '',
              ...vacancy
            }))

            setVisibleVacancies(newVacancies)
            setPage(1)
            setHasMore(newVacancies.length < result.totalCount)
          })
          .catch(err => {
            console.error('Fetch vacancies failed after bulk action:', err)
            toast.error('Failed to refresh vacancies', { position: 'top-right', autoClose: 3000 })
          })
      })
      .catch(err => {
        const errorMsg = err || 'Failed to update vacancies'

        toast.error(errorMsg, {
          position: 'top-right',
          autoClose: 3000
        })
      })
  }

  // Handle individual vacancy action
  const handleVacancyAction = (id: string, status: 'APPROVED' | 'FREEZED') => {
    dispatch(updateVacancyStatus({ ids: [id], status }))
      .unwrap()
      .then(res => {
        if (res?.error?.success === false) {
          throw res?.error?.error?.message || 'Failed to update vacancy'
        }

        toast.success(`Vacancy ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 3000
        })

        // Refresh vacancies
        const statusMap = ['PENDING', 'FREEZED', 'APPROVED', '']

        const params: {
          page: number
          limit: number
          search?: string
          status?: 'PENDING' | 'APPROVED' | 'FREEZED'
          designation?: string[]
          department?: string[]
          branch?: string[]
          cluster?: string[]
          area?: string[]
          region?: string[]
          zone?: string[]
          territory?: string[]
        } = {
          page: 1,
          limit,
          status: statusMap[selectedTab] as 'PENDING' | 'APPROVED' | 'FREEZED',
          designation: initialParams.designation,
          department: initialParams.department,
          ...(initialParams.branch && { branch: initialParams.branch }),
          ...(initialParams.cluster && { cluster: initialParams.cluster }),
          ...(initialParams.area && { area: initialParams.area }),
          ...(initialParams.region && { region: initialParams.region }),
          ...(initialParams.zone && { zone: initialParams.zone }),
          ...(initialParams.territory && { territory: initialParams.territory })
        }

        if (searchQuery) params.search = searchQuery.trim()

        if (selectedFilterType && selectedFilters.length > 0) {
          ;(params as any)[selectedFilterType.toLowerCase()] = selectedFilters
        }

        dispatch(fetchVacancies(params))
          .unwrap()
          .then(result => {
            const newVacancies = (result.data || []).map((vacancy: any) => ({
              band: vacancy.band ?? '',
              ...vacancy
            }))

            setVisibleVacancies(newVacancies)
            setPage(1)
            setHasMore(newVacancies.length < result.totalCount)
          })
          .catch(err => {
            console.error('Fetch vacancies failed after action:', err)
            toast.error('Failed to refresh vacancies', { position: 'top-right', autoClose: 3000 })
          })
      })
      .catch(err => {
        const errorMsg = err || 'Failed to update vacancy'

        toast.error(errorMsg, {
          position: 'top-right',
          autoClose: 3000
        })
      })
  }

  // Handle tab change
  const handleTabChange = (vacancyId: string, newValue: number) => {
    setSelectedTabs(prev => ({ ...prev, [vacancyId]: newValue }))
  }

  // Handle filter drawer toggle
  const handleFilterDrawerToggle = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    setIsFilterDrawerOpen(false)
    setPage(1)
    setVisibleVacancies([])
    toast.info('Filters applied', { position: 'top-right', autoClose: 3000 })
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedFilterType(null)
    setSelectedFilters([])
    setSelectedFiltersMap({})
    setPage(1)
    setVisibleVacancies([])
    toast.info('Filters reset', { position: 'top-right', autoClose: 3000 })
  }

  const handleFilterChange = (option: string, newValue: string[]) => {
    setSelectedFiltersMap(prev => ({
      ...prev,
      [option]: newValue
    }))
    setSelectedFilterType(option as FilterKey)
    setSelectedFilters(newValue)
  }

  // Fetch vacancies
  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)

    debounceTimeoutRef.current = setTimeout(() => {
      const statusMap = ['PENDING', 'FREEZED', 'APPROVED', '']

      const params: {
        page: number
        limit: number
        search?: string
        status?: 'PENDING' | 'APPROVED' | 'FREEZED'
        designation?: string[]
        grade?: string[]
        department?: string[]
        branch?: string[]
        cluster?: string[]
        area?: string[]
        region?: string[]
        zone?: string[]
        territory?: string[]
      } = {
        page,
        limit,
        status: statusMap[selectedTab] as 'PENDING' | 'APPROVED' | 'FREEZED',
        designation: initialParams.designation,
        department: initialParams.department,
        grade: initialParams.grade,
        ...(initialParams.branch && { branch: initialParams.branch }),
        ...(initialParams.cluster && { cluster: initialParams.cluster }),
        ...(initialParams.area && { area: initialParams.area }),
        ...(initialParams.region && { region: initialParams.region }),
        ...(initialParams.zone && { zone: initialParams.zone }),
        ...(initialParams.territory && { territory: initialParams.territory })
      }

      if (searchQuery) params.search = searchQuery.trim()

      if (selectedFilterType && selectedFilters.length > 0) {
        ;(params as any)[selectedFilterType.toLowerCase()] = selectedFilters
      }

      dispatch(fetchVacancies(params))
        .unwrap()
        .then(result => {
          const newVacancies = (result.data || []).map((vacancy: any) => ({
            band: vacancy.band ?? '',
            ...vacancy
          }))

          setVisibleVacancies(prev => {
            const updated =
              page === 1
                ? newVacancies
                : [...prev, ...newVacancies.filter(v => !prev.some(existing => existing.id === v.id))]

            setSelectedTabs(prevTabs => ({
              ...prevTabs,
              ...updated.reduce((acc, v) => ({ ...acc, [v.id]: prevTabs[v.id] ?? 0 }), {})
            }))

            return updated
          })
          setHasMore(newVacancies.length < result.totalCount)
        })
        .catch(err => {
          console.error('Fetch vacancies failed:', err)
          setVisibleVacancies([])
          setSelectedTabs({})
          toast.error('Failed to fetch vacancies', { position: 'top-right', autoClose: 3000 })
        })
    }, 300)

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [dispatch, searchQuery, selectedTab, page, limit, selectedFilterType, selectedFilters, initialParams])

  // Table columns
  const columnHelper = createColumnHelper<any>()

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('jobTitle', {
        header: 'JOB TITLE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobTitle}
          </Typography>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.designation}
          </Typography>
        )
      }),
      columnHelper.accessor('jobRole', {
        header: 'JOB ROLE',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.jobRole}
          </Typography>
        )
      }),
      columnHelper.accessor('openings', {
        header: 'OPENINGS',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.openings}
          </Typography>
        )
      }),
      columnHelper.accessor('employeeCategory', {
        header: 'EMPLOYEE CATEGORY',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.employeeCategory}
          </Typography>
        )
      }),
      columnHelper.accessor('hiringManager', {
        header: 'HIRING MANAGER',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.hiringManager}
          </Typography>
        )
      }),
      columnHelper.accessor('approverStatus', {
        header: 'APPROVER STATUS',
        cell: ({ row }) => (
          <>
            {row?.original?.approvalStatus?.map((status, index) => (
              <>
                {userId === status?.approverId && (
                  <Typography key={index} sx={{ ml: 5, fontSize: '0.75rem', color: '#757575', mb: 0.5 }}>
                    Level {status.level}: {status.approver} ({status.approvalStatus})
                  </Typography>
                )}
              </>
            ))}
          </>
        )
      }),
      columnHelper.accessor('finialStatus', {
        header: 'FINAL STATUS',
        cell: ({ row }) => (
          <Box>
            <Chip
              label={row.original.status}
              size='small'
              variant='tonal'
              color={
                row.original.status === 'Open'
                  ? 'success'
                  : row.original.status === 'Closed'
                    ? 'error'
                    : row.original.status === 'FREEZED'
                      ? 'info'
                      : row.original.status === 'PENDING'
                        ? 'warning'
                        : 'default'
              }
              sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
            />
          </Box>
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        meta: { className: 'sticky right-0' },
        cell: ({ row }) => (
          <Box className='flex items-center gap-1'>
            <Tooltip title='View' placement='top'>
              <IconButton onClick={() => router.push(ROUTES.VACANCY_DETAIL(row.original.id))}>
                <VisibilityIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {canApproveOrFreeze(row.original) && tabMode === 'request' && (
              <>
                <Tooltip title='Approve' placement='top'>
                  <IconButton
                    color='success'
                    onClick={() => handleVacancyAction(row.original.id, 'APPROVED')}
                    disabled={updateVacancyStatusLoading}
                    sx={{ '&:hover': { bgcolor: 'success.light' } }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Freeze' placement='top'>
                  <IconButton
                    color='info'
                    onClick={() => handleVacancyAction(row.original.id, 'FREEZED')}
                    disabled={updateVacancyStatusLoading}
                    sx={{ '&:hover': { bgcolor: 'info.light' } }}
                  >
                    <PauseCircleOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        ),
        enableSorting: false
      })
    ],
    [router, tabMode, updateVacancyStatusLoading, userId]
  )

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ToastContainer position='top-right' autoClose={3000} />
      {/* Search Section */}
      <Card
        sx={{
          mb: 4,
          p: 3,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          bgcolor: '#fff',
          position: 'sticky',
          top: 16,
          zIndex: 10
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: '40%' } }}>
            <TextField
              label='Search Vacancies'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                bgcolor: '#fff',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#1976d2' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon sx={{ color: '#757575' }} />
                  </InputAdornment>
                )
              }}
            />
            <IconButton
              color='primary'
              onClick={handleFilterDrawerToggle}
              sx={{
                borderRadius: '8px',
                p: 1,
                '&:hover': { bgcolor: 'primary.light' }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {selectedTab === 0 && tabMode === 'request' && (
              <>
                <Button
                  variant='outlined'
                  color='success'
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => handleBulkAction('APPROVED')}
                  disabled={!eligibleVacancyIds.length || updateVacancyStatusLoading}
                  sx={{
                    borderColor: 'success.main',
                    color: 'success.main',
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  {selectedVacancyIds.length ? 'Approve Selected' : 'Approve All'}
                </Button>
                <Button
                  variant='outlined'
                  color='info'
                  startIcon={<PauseCircleOutlineIcon />}
                  onClick={() => handleBulkAction('FREEZED')}
                  disabled={!eligibleVacancyIds.length || updateVacancyStatusLoading}
                  sx={{
                    borderColor: 'info.main',
                    color: 'info.main',
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  {selectedVacancyIds.length ? 'Freeze Selected' : 'Freeze All'}
                </Button>
              </>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                padding: '2px',
                bgcolor: '#f5f5f5',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('grid')}
                  size='small'
                  sx={{ p: 0.5 }}
                >
                  <GridViewIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  size='small'
                  sx={{ p: 0.5 }}
                >
                  <TableChartIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Tabs */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: '8px',
          bgcolor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => {
            setSelectedTab(newValue)
            setPage(1)
            setVisibleVacancies([])
          }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#333',
              '&.Mui-selected': { color: 'primary.main' }
            },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' }
          }}
        >
          <Tab label='Pending' />
          <Tab label='Freeze' />
          <Tab label='Approved' />
          <Tab label='All' />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box>
        {/* Grid View */}
        {viewMode === 'grid' && (
          <>
            {vacancyListLoading && !hasMore && visibleVacancies.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            <Grid container spacing={3}>
              {visibleVacancies.map(vacancy => {
                const CategoryIcon = iconMap[vacancy.employeeCategory] || WorkOutlineRoundedIcon

                return (
                  <Grid item xs={12} sm={6} md={4} key={vacancy.id}>
                    <Card
                      onClick={() => router.push(ROUTES.VACANCY_DETAIL(vacancy.id))}
                      sx={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                        },
                        bgcolor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      {tabMode === 'request' && canApproveOrFreeze(vacancy) && (
                        <Checkbox
                          size='small'
                          checked={selectedVacancyIds.includes(vacancy.id)}
                          onChange={e => handleCheckboxChange(vacancy.id, e.target.checked)}
                          onClick={e => e.stopPropagation()}
                          sx={{
                            position: 'absolute',
                            top: 6,
                            color: 'primary.main'
                          }}
                        />
                      )}
                      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                        {vacancy.approvalStatus?.map((status, index) => (
                          <>
                            {userId === status?.approverId && (
                              <Typography key={index} sx={{ ml: 5, fontSize: '0.75rem', color: '#757575', mb: 0.5 }}>
                                Level {status.level}: {status.approver} ({status.approvalStatus})
                              </Typography>
                            )}
                          </>
                        ))}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <CategoryIcon sx={{ fontSize: 'small', color: '#757575' }} />
                          <Tooltip title='Job Title'>
                            <Typography
                              variant='h6'
                              fontWeight={600}
                              sx={{ color: '#333', textTransform: 'capitalize' }}
                            >
                              {vacancy.jobTitle}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box sx={{ p: 2, flexGrow: 1, borderTop: '1px solid #e0e0e0' }}>
                        <Tabs
                          value={selectedTabs[vacancy.id] ?? 0}
                          onClick={e => e.stopPropagation()}
                          onChange={(e, newValue) => handleTabChange(vacancy.id, newValue)}
                          sx={{
                            mb: 2,
                            '& .MuiTab-root': { fontSize: '0.8rem', textTransform: 'none' }
                          }}
                        >
                          <Tab label='Details' />
                          <Tab label='More Details' />
                        </Tabs>
                        {selectedTabs[vacancy.id] === 0 && (
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 1,
                              fontSize: '0.75rem',
                              minHeight: '100px'
                            }}
                          >
                            <Tooltip title='Employee Category'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <InboxOutlinedIcon fontSize='small' /> {vacancy.employeeCategory}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Hiring Manager'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <ManageAccountsRoundedIcon fontSize='small' /> {vacancy.hiringManager}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Company'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <ApartmentRoundedIcon fontSize='small' /> {vacancy.company}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Business Unit'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <BusinessCenterRoundedIcon fontSize='small' /> {vacancy.businessUnit}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Department'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <AccountTreeRoundedIcon fontSize='small' /> {vacancy.department}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Territory'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <PublicRoundedIcon fontSize='small' /> {vacancy.territory}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Region'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <PinDropRoundedIcon fontSize='small' /> {vacancy.region}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Cluster'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <HubRoundedIcon fontSize='small' /> {vacancy.cluster}
                              </Typography>
                            </Tooltip>
                          </Box>
                        )}
                        {selectedTabs[vacancy.id] === 1 && (
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 1,
                              fontSize: '0.75rem',
                              minHeight: '100px'
                            }}
                          >
                            <Tooltip title='Designation'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <CardMembershipRoundedIcon fontSize='small' /> {vacancy.designation}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Job Role'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <EngineeringRoundedIcon fontSize='small' /> {vacancy.jobRole}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Openings'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <WorkOutlineRoundedIcon fontSize='small' /> {vacancy.openings}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Campus/Lateral'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <SchoolRoundedIcon fontSize='small' /> {vacancy.campusOrLateral}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Employee Type'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <PersonOutlineRoundedIcon fontSize='small' /> {vacancy.employeeType}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Grade'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#757575' }}>
                                <MilitaryTechRoundedIcon fontSize='small' /> {vacancy.grade}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Start Date'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'green' }}>
                                <TodayRoundedIcon fontSize='small' /> {vacancy.startingDate.split('T')[0]}
                              </Typography>
                            </Tooltip>
                            <Tooltip title='End Date'>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'red' }}>
                                <EventRoundedIcon fontSize='small' /> {vacancy.closingDate.split('T')[0]}
                              </Typography>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between',
                          gap: 1,
                          bgcolor: '#fafafa',
                          borderTop: '1px solid #e0e0e0',
                          alignItems: 'center'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <Chip
                          label={vacancy.status}
                          size='small'
                          variant='tonal'
                          color={
                            vacancy.status === 'Open'
                              ? 'success'
                              : vacancy.status === 'Closed'
                                ? 'error'
                                : vacancy.status === 'FREEZED'
                                  ? 'info'
                                  : vacancy.status === 'PENDING'
                                    ? 'warning'
                                    : 'default'
                          }
                          sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
                        />
                        {tabMode === 'request' && canApproveOrFreeze(vacancy) && (
                          <Box>
                            <IconButton
                              color='success'
                              onClick={() => handleVacancyAction(vacancy.id, 'APPROVED')}
                              disabled={updateVacancyStatusLoading}
                              sx={{ '&:hover': { bgcolor: 'success.light' } }}
                            >
                              <CheckCircleOutlineIcon fontSize='small' />
                            </IconButton>
                            <IconButton
                              color='info'
                              onClick={() => handleVacancyAction(vacancy.id, 'FREEZED')}
                              disabled={updateVacancyStatusLoading}
                              sx={{ '&:hover': { bgcolor: 'info.light' } }}
                            >
                              <PauseCircleOutlineIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
            {hasMore && viewMode === 'grid' && (
              <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', mt: 4, height: '40px' }}>
                {vacancyListLoading && <CircularProgress size={24} />}
              </Box>
            )}
          </>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <DynamicTable
            columns={columns}
            data={visibleVacancies}
            totalCount={vacancyListTotal}
            pagination={pagination}
            onPageChange={newPage => setPagination(prev => ({ ...prev, pageIndex: newPage }))}
            onRowsPerPageChange={newPageSize => setPagination({ pageIndex: 0, pageSize: newPageSize })}
            tableName='Vacancy Management'
            isRowCheckbox={selectedTab === 0 && tabMode === 'request'}
            sorting={null}
            onSortingChange={null}
            initialState={null}
            onRowSelectionChange={rows =>
              setSelectedVacancyIds(Object.keys(rows).map(id => visibleVacancies[parseInt(id)].id))
            }
          />
        )}

        {visibleVacancies.length === 0 && !vacancyListLoading && (
          <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            No vacancies found for the selected status
          </Typography>
        )}
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor='right'
        open={isFilterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '80%', sm: 400 }, p: 3, bgcolor: '#fff' } }}
      >
        <Typography variant='h6' fontWeight='600' sx={{ mb: 3, color: '#333' }}>
          Filter Options
        </Typography>
        {filterOptions.map(option => (
          <React.Fragment key={option}>
            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle1' fontWeight='500' sx={{ mb: 1, color: '#333' }}>
                {option}
              </Typography>
              <Autocomplete
                multiple
                options={filterValuesMap[option].map(item => item.name)}
                getOptionLabel={name => filterValuesMap[option]?.find(item => item.name === name)?.name || name}
                value={selectedFiltersMap[option] || []}
                onChange={(e, newValue) => handleFilterChange(option, newValue)}
                renderInput={params => (
                  <TextField {...params} label={`${option} Values`} variant='outlined' size='small' />
                )}
                sx={{ mb: 1 }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
          </React.Fragment>
        ))}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleApplyFilters}
            fullWidth
            sx={{ borderRadius: '8px' }}
          >
            Apply Filters
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleResetFilters}
            fullWidth
            sx={{ borderRadius: '8px' }}
          >
            Reset Filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default VacancyListingTableView
