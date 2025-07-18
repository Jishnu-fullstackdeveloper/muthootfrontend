'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Drawer,
  Autocomplete,
  Button,
  CircularProgress,
  Tooltip,
  Grid
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import CardMembershipRoundedIcon from '@mui/icons-material/CardMembershipRounded'
import EngineeringRoundedIcon from '@mui/icons-material/Engineering'
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutline'
import SchoolRoundedIcon from '@mui/icons-material/School'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutline'
import TodayRoundedIcon from '@mui/icons-material/Today'
import EventRoundedIcon from '@mui/icons-material/Event'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccounts'
import ApartmentRoundedIcon from '@mui/icons-material/Apartment'
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenter'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTree'
import PublicRoundedIcon from '@mui/icons-material/Public'
import PinDropRoundedIcon from '@mui/icons-material/PinDrop'
import HubRoundedIcon from '@mui/icons-material/Hub'

// import ExploreRoundedIcon from '@mui/icons-material/Explore'
// import StoreRoundedIcon from '@mui/icons-material/Store'
// import CodeRoundedIcon from '@mui/icons-material/Code'
// import LocationCityRoundedIcon from '@mui/icons-material/LocationCity'
// import FlagRoundedIcon from '@mui/icons-material/Flag'
// import SourceRoundedIcon from '@mui/icons-material/Source'
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTech'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
import { ROUTES } from '@/utils/routes'
import { getUserId } from '@/utils/functions'
import VacancyListingTableView from './VacancyTableView'

type ViewMode = 'grid' | 'table'
type TabMode = 'list' | 'request'
type FilterType = 'Branch' | 'Cluster' | 'Area' | 'Region' | 'Zone' | 'Territory' | null

// interface FilterOption {
//   id: string
//   name: string
// }

const filterOptions: FilterType[] = ['Branch', 'Cluster', 'Area', 'Region', 'Zone', 'Territory']

const VacancyListingPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = getUserId()

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [tabMode] = useState<TabMode>('list')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [visibleVacancies, setVisibleVacancies] = useState<Vacancy[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [selectedFilterType, setSelectedFilterType] = useState<FilterType>(null)
  const [selectedFilterValues, setSelectedFilterValues] = useState<string[]>([])
  const [filterPage, setFilterPage] = useState(1)
  const [filterLimit, setFilterLimit] = useState(10)
  const [filterHasMore, setFilterHasMore] = useState(true)
  const [selectedTabs, setSelectedTabs] = useState({})

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

  // Redux selectors
  const {
    vacancyListData,
    vacancyListTotal,
    vacancyListLoading,
    vacancyListFailureMessage,
    updateVacancyStatusLoading
  } = useAppSelector((state: RootState) => state.vacancyManagementReducer) as VacancyManagementState

  const {
    fetchBranchData,
    fetchBranchLoading,
    fetchClusterData,
    fetchClusterLoading,
    fetchTerritoryData,
    fetchTerritoryLoading,
    fetchAreaData,
    fetchAreaLoading,
    fetchRegionData,
    fetchRegionLoading,
    fetchZoneData,
    fetchZoneLoading
  } = useAppSelector((state: RootState) => state.budgetManagementReducer) as BudgetManagementState

  // Refs for lazy loading
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const filterSentinelRef = useRef<HTMLDivElement | null>(null)
  const filterObserverRef = useRef<IntersectionObserver | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Fetch vacancies with debounced search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(() => {
      setVisibleVacancies([])
      setPage(1)
      setLimit(10)
      setHasMore(true)

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
        page: 1,
        limit: 10,
        status: tabMode === 'list' ? 'APPROVED' : 'PENDING',
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

      if (selectedFilterType && selectedFilterValues.length > 0) {
        ;(params as any)[selectedFilterType.toLowerCase()] = selectedFilterValues
      }

      dispatch(fetchVacancies(params))
        .unwrap()
        .then(result => {
          const newVacancies = (result.data || []).map((vacancy: any) => ({
            band: vacancy.band ?? '',
            ...vacancy
          }))

          setVisibleVacancies(newVacancies)
          setSelectedTabs(newVacancies.reduce((acc, vacancy) => ({ ...acc, [vacancy.id]: 0 }), {}))
          setHasMore(newVacancies.length < result.totalCount)
        })
        .catch(err => {
          console.error('Fetch vacancies failed:', err)
          setVisibleVacancies([])
          setSelectedTabs({})
        })
    }, 300)

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [dispatch, searchQuery, tabMode, selectedFilterType, selectedFilterValues, initialParams])

  // Append new vacancies for lazy loading
  useEffect(() => {
    if (!vacancyListData?.data?.length || viewMode !== 'grid' || page === 1) return

    setVisibleVacancies(prev => {
      const newVacancies = vacancyListData.data
        .filter(vacancy => !prev.some(existing => existing.id === vacancy.id))
        .map(vacancy => ({
          band: vacancy.band ?? '',
          ...vacancy
        }))

      const updatedVacancies = [...prev, ...newVacancies]

      setSelectedTabs(prevTabs => {
        const updatedTabs = { ...prevTabs }

        updatedVacancies.forEach(vacancy => {
          if (!(vacancy.id in updatedTabs)) updatedTabs[vacancy.id] = 0
        })

        return updatedTabs
      })

      setHasMore(updatedVacancies.length < vacancyListTotal)

      return updatedVacancies
    })
  }, [vacancyListData, viewMode, page, vacancyListTotal])

  // Lazy loading for grid view
  const loadMoreVacancies = useCallback(() => {
    if (vacancyListLoading || visibleVacancies.length >= vacancyListTotal || !hasMore) return

    const nextPage = page + 1

    setPage(nextPage)

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
      page: nextPage,
      limit,
      status: tabMode === 'list' ? 'APPROVED' : 'PENDING',
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

    if (selectedFilterType && selectedFilterValues.length > 0) {
      // params[selectedFilterType.toLowerCase() as keyof typeof params] = selectedFilterValues
      ;(params as any)[selectedFilterType.toLowerCase()] = selectedFilterValues
    }

    dispatch(fetchVacancies(params))
  }, [
    vacancyListLoading,
    visibleVacancies.length,
    vacancyListTotal,
    hasMore,
    page,
    limit,
    searchQuery,
    tabMode,
    selectedFilterType,
    selectedFilterValues,
    dispatch,
    initialParams
  ])

  useEffect(() => {
    if (viewMode !== 'grid' || !hasMore || vacancyListLoading) return

    if (observerRef.current) observerRef.current.disconnect()

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setLimit(prev => prev + 10)
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

  // Fetch filter values with lazy loading
  const fetchFilterValues = useCallback(() => {
    if (!selectedFilterType || filterPage === 1) setFilterLimit(10)

    const params = { page: filterPage, limit: filterLimit }
    let fetchAction

    switch (selectedFilterType) {
      case 'Branch':
        fetchAction = fetchBranch(params)
        break
      case 'Cluster':
        fetchAction = fetchCluster(params)
        break
      case 'Area':
        fetchAction = fetchArea(params)
        break
      case 'Region':
        fetchAction = fetchRegion(params)
        break
      case 'Zone':
        fetchAction = fetchZone(params)
        break
      case 'Territory':
        fetchAction = fetchTerritory(params)
        break
      default:
        return
    }

    dispatch(fetchAction).then(result => {
      if (result.payload?.data) {
        setFilterHasMore(result.payload.data.length < result.payload.totalCount)
      }
    })
  }, [dispatch, selectedFilterType, filterPage, filterLimit])

  useEffect(() => {
    if (!selectedFilterType) return
    setFilterPage(1)
    setSelectedFilterValues([])
    fetchFilterValues()
  }, [selectedFilterType, fetchFilterValues])

  // Lazy loading for filter dropdown
  useEffect(() => {
    if (!selectedFilterType || !filterHasMore || filterSentinelRef.current === null) return

    if (filterObserverRef.current) filterObserverRef.current.disconnect()

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setFilterLimit(prev => prev + 10)
          setFilterPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    filterObserverRef.current = observer
    if (filterSentinelRef.current) observer.observe(filterSentinelRef.current)

    return () => {
      if (filterObserverRef.current) filterObserverRef.current.disconnect()
    }
  }, [selectedFilterType, filterHasMore])

  // Map filter values
  const filterValuesMap = useMemo(
    () => ({
      Branch: fetchBranchData?.data?.map(branch => ({ id: branch.id, name: branch.name })) || [],
      Cluster: fetchClusterData?.data?.map(cluster => ({ id: cluster.id, name: cluster.name })) || [],
      Area: fetchAreaData?.data?.map(area => ({ id: area.id, name: area.name })) || [],
      Region: fetchRegionData?.data?.map(region => ({ id: region.id, name: region.name })) || [],
      Zone: fetchZoneData?.data?.map(zone => ({ id: zone.id, name: zone.name })) || [],
      Territory: fetchTerritoryData?.data?.map(territory => ({ id: territory.id, name: territory.name })) || []
    }),
    [fetchBranchData, fetchClusterData, fetchAreaData, fetchRegionData, fetchZoneData, fetchTerritoryData]
  )

  const isFilterLoading =
    fetchBranchLoading ||
    fetchClusterLoading ||
    fetchTerritoryLoading ||
    fetchAreaLoading ||
    fetchRegionLoading ||
    fetchZoneLoading

  // Handle tab change for vacancies
  const handleTabChange = (vacancyId: string, newValue: number) => {
    setSelectedTabs(prev => ({ ...prev, [vacancyId]: newValue }))
  }

  // Handle filter drawer toggle
  const handleFilterDrawerToggle = () => {
    setIsFilterDrawerOpen(prev => !prev)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    setIsFilterDrawerOpen(false)
    setPage(1)
    setLimit(10)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedFilterType(null)
    setSelectedFilterValues([])
    setFilterPage(1)
    setFilterLimit(10)
    setPage(1)
    setLimit(10)
  }

  // Check if current user is an approver with PENDING status
  const canApproveOrFreeze = (vacancy: Vacancy) => {
    return (
      vacancy.approvalStatus?.some(status => status.approverId === userId && status.approvalStatus === 'PENDING') ||
      false
    )
  }

  // Get IDs of PENDING vacancies for bulk actions
  const pendingVacancyIds = useMemo(() => {
    return visibleVacancies.filter(vacancy => canApproveOrFreeze(vacancy)).map(vacancy => vacancy.id)
  }, [visibleVacancies, userId])

  // Handle bulk actions
  const handleBulkAction = (status: 'APPROVED' | 'FREEZED') => {
    if (!pendingVacancyIds.length) return

    dispatch(updateVacancyStatus({ ids: pendingVacancyIds, status }))
      .unwrap()
      .then(() => {
        toast.success(`All vacancies ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 3000
        })
        setVisibleVacancies([])
        setPage(1)
        setLimit(10)
      })
      .catch(err => {
        toast.error(`Failed to update vacancies: ${err}`, {
          position: 'top-right',
          autoClose: 3000
        })
      })
  }

  // Handle individual vacancy action
  const handleVacancyAction = (id: string, status: 'APPROVED' | 'FREEZED') => {
    dispatch(updateVacancyStatus({ ids: [id], status }))
      .unwrap()
      .then(() => {
        toast.success(`Vacancy ${status.toLowerCase()} successfully`, {
          position: 'top-right',
          autoClose: 3000
        })

        // setVisibleVacancies(prev => prev.filter(v => v.id !== id))
        setVisibleVacancies([])
        setPage(1)
        setLimit(10)
      })
      .catch(err => {
        toast.error(`Failed to update vacancy: ${err}`, {
          position: 'top-right',
          autoClose: 3000
        })
      })
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f9fafb' }}>
      <ToastContainer position='top-right' autoClose={3000} />
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
        {/* <Typography variant='h5' fontWeight={600} sx={{ mb: 3, color: '#333' }}>
          Vacancy Management
        </Typography> */}
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
            {tabMode === 'request' && viewMode === 'grid' && (
              <>
                <Button
                  variant='outlined'
                  color='success'
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => handleBulkAction('APPROVED')}
                  disabled={!pendingVacancyIds.length || updateVacancyStatusLoading}
                  sx={{
                    borderColor: 'success.main',
                    color: 'success.main',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'success.main' }
                  }}
                >
                  Approve All
                </Button>
                <Button
                  variant='outlined'
                  color='info'
                  startIcon={<PauseCircleOutlineIcon />}
                  onClick={() => handleBulkAction('FREEZED')}
                  disabled={!pendingVacancyIds.length || updateVacancyStatusLoading}
                  sx={{
                    borderColor: 'info.main',
                    color: 'info.main',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'info.main' }
                  }}
                >
                  Freeze All
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

      {/* <Tabs
        value={tabMode}
        onChange={(e, newValue) => setTabMode(newValue as TabMode)}
        sx={{
          mb: 3,
          bgcolor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Tab label='Vacancy List' value='list' sx={{ textTransform: 'none', fontWeight: 600 }} />
        <Tab label='Vacancy Request' value='request' sx={{ textTransform: 'none', fontWeight: 600 }} />
      </Tabs> */}

      {vacancyListFailureMessage && (
        <Box sx={{ textAlign: 'center', mt: 4, color: '#757575' }}>
          <Typography variant='h6'>No vacancy data found</Typography>
        </Box>
      )}

      {viewMode === 'grid' && !vacancyListLoading && visibleVacancies.length === 0 && !vacancyListFailureMessage && (
        <Box sx={{ textAlign: 'center', mt: 4, color: '#757575' }}>
          <Typography variant='h6'>No record found</Typography>
        </Box>
      )}

      {viewMode === 'grid' ? (
        <>
          <Grid container spacing={3}>
            {visibleVacancies.map(vacancy => (
              <Grid item xs={12} sm={6} md={4} key={vacancy.id}>
                <Card
                  onClick={() =>
                    router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST_VIEW_DETAIL(vacancy.id))
                  }
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
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tooltip title='Job Title'>
                      <Typography variant='h6' fontWeight={600} sx={{ color: '#333', textTransform: 'capitalize' }}>
                        {vacancy.jobTitle}
                      </Typography>
                    </Tooltip>
                    <Chip
                      label={vacancy.status}
                      size='small'
                      variant='tonal'
                      color={
                        vacancy.status === 'Open'
                          ? 'success'
                          : vacancy.status === 'Closed'
                            ? 'error'
                            : vacancy.status === 'Freeze'
                              ? 'info'
                              : 'default'
                      }
                      sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Tabs
                      value={selectedTabs[vacancy.id] || 0}
                      onClick={e => e.stopPropagation()}
                      onChange={(e, newValue) => handleTabChange(vacancy.id, newValue)}
                      sx={{ mb: 2 }}
                    >
                      <Tab label='Details' sx={{ fontSize: '0.8rem', textTransform: 'none' }} />
                      <Tab label='More Details' sx={{ fontSize: '0.8rem', textTransform: 'none' }} />
                    </Tabs>
                    {selectedTabs[vacancy.id] === 0 && (
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.75rem' }}>
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
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.75rem' }}>
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
                  {tabMode === 'request' && canApproveOrFreeze(vacancy) && (
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        bgcolor: '#fafafa',
                        borderTop: '1px solid #e0e0e0'
                      }}
                      onClick={e => e.stopPropagation()}
                    >
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
                </Card>
              </Grid>
            ))}
          </Grid>
          {hasMore && viewMode === 'grid' && (
            <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', mt: 4, height: '40px' }}>
              {vacancyListLoading && <CircularProgress size={24} />}
            </Box>
          )}
        </>
      ) : (
        <VacancyListingTableView tabMode={tabMode} />
      )}

      <Drawer
        anchor='right'
        open={isFilterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '80%', sm: 400 }, p: 3, bgcolor: '#fff' } }}
      >
        <Typography variant='h6' fontWeight={600} sx={{ mb: 3, color: '#333' }}>
          Filter Options
        </Typography>
        <Autocomplete
          options={filterOptions}
          value={selectedFilterType}
          onChange={(e, newValue) => {
            setSelectedFilterType(newValue as FilterType)
            setSelectedFilterValues([])
            setFilterPage(1)
            setFilterLimit(10)
          }}
          renderInput={params => <TextField {...params} label='Filter Type' variant='outlined' size='small' />}
          sx={{ mb: 3 }}
        />
        {isFilterLoading && !filterValuesMap[selectedFilterType || 'Branch'].length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Autocomplete
            multiple
            options={selectedFilterType ? filterValuesMap[selectedFilterType].map(item => item.name) : []}
            getOptionLabel={option =>
              selectedFilterType
                ? filterValuesMap[selectedFilterType].find(item => item.id === option)?.name || option
                : option
            }
            value={selectedFilterValues}
            onChange={(e, newValue) => setSelectedFilterValues(newValue)}
            disabled={!selectedFilterType}
            renderInput={params => (
              <TextField
                {...params}
                label='Filter Values'
                variant='outlined'
                size='small'
                sx={{
                  '& .MuiInputBase-input': {
                    color: !selectedFilterType ? 'text.disabled' : 'text.primary'
                  }
                }}
              />
            )}
            ListboxProps={{ style: { maxHeight: 200, overflow: 'auto' } }}
            sx={{ mb: 3 }}
          />
        )}
        {filterHasMore && selectedFilterType && (
          <Box ref={filterSentinelRef} sx={{ height: '20px', textAlign: 'center' }}>
            {isFilterLoading && <CircularProgress size={16} />}
          </Box>
        )}
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
            Reset
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default VacancyListingPage
