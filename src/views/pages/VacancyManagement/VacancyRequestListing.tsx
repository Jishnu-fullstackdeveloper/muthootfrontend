'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  Typography,
  Autocomplete,
  Button,
  Tooltip,
  Chip,
  CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import DynamicTable from '@/components/Table/dynamicTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState } from '@/redux/store'
import type { VacancyManagementState, VacancyRequestGroupByDesignation } from '@/types/vacancyManagement'
import { fetchVacancyRequestsGroupByDesignation } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import type { BudgetManagementState } from '@/types/budget'
import {
  fetchBranch,
  fetchTerritory,
  fetchArea,
  fetchRegion,
  fetchZone
} from '@/redux/BudgetManagement/BudgetManagementSlice'
import { ROUTES } from '@/utils/routes'

const filterOptions = ['Branch', 'Area', 'Region', 'Zone', 'Territory']

const VacancyRequestListing = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // State for search, filters, and pagination
  const [searchDesignation, setSearchDesignation] = useState<string>('')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false)
  const [selectedFilterType, setSelectedFilterType] = useState<string | null>(null)
  const [selectedFilterValues, setSelectedFilterValues] = useState<string[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Selectors for vacancy management state
  const {
    vacancyRequestGroupByDesignationLoading = false,
    vacancyRequestGroupByDesignationSuccess = false,
    vacancyRequestGroupByDesignationData = null,
    vacancyRequestGroupByDesignationTotal = 0,
    vacancyRequestGroupByDesignationFailure = false,
    vacancyRequestGroupByDesignationFailureMessage = ''
  } = useAppSelector((state: RootState) => state.vacancyManagementReducer) as VacancyManagementState

  // Selectors for budget management state (filter values)
  const {
    fetchBranchData,
    fetchBranchLoading,
    fetchTerritoryData,
    fetchTerritoryLoading,
    fetchAreaData,
    fetchAreaLoading,
    fetchRegionData,
    fetchRegionLoading,
    fetchZoneData,
    fetchZoneLoading
  } = useAppSelector((state: RootState) => state.budgetManagementReducer) as BudgetManagementState

  // Fetch vacancy requests grouped by designation
  useEffect(() => {
    const params: {
      page: number
      limit: number
      search?: string
      branchIds?: string[]
      areaIds?: string[]
      regionIds?: string[]
      zoneIds?: string[]
      territoryIds?: string[]
    } = {
      page: pagination.pageIndex + 1, // API expects 1-based page index
      limit: pagination.pageSize
    }

    if (searchDesignation) params.search = searchDesignation

    // Add filter IDs based on selected filter type and values
    if (selectedFilterType && selectedFilterValues.length > 0) {
      if (selectedFilterType === 'Branch') params.branchIds = selectedFilterValues
      else if (selectedFilterType === 'Area') params.areaIds = selectedFilterValues
      else if (selectedFilterType === 'Region') params.regionIds = selectedFilterValues
      else if (selectedFilterType === 'Zone') params.zoneIds = selectedFilterValues
      else if (selectedFilterType === 'Territory') params.territoryIds = selectedFilterValues
    }

    dispatch(fetchVacancyRequestsGroupByDesignation(params))
  }, [dispatch, searchDesignation, selectedFilterType, selectedFilterValues, pagination])

  // Fetch filter values
  useEffect(() => {
    // Fetch branches
    dispatch(fetchBranch({ page: 1, limit: 100 }))

    // Fetch territories
    dispatch(fetchTerritory({ page: 1, limit: 100 }))

    // Fetch areas
    dispatch(fetchArea({ page: 1, limit: 100 }))

    // Fetch regions
    dispatch(fetchRegion({ page: 1, limit: 100 }))

    // Fetch zones
    dispatch(fetchZone({ page: 1, limit: 100 }))
  }, [dispatch])

  // Map fetched filter values
  const filterValuesMap = useMemo(() => {
    return {
      Branch: fetchBranchData?.data?.map(branch => ({ id: branch.id, name: branch.name })) || [],
      Area: fetchAreaData?.data?.map(area => ({ id: area.id, name: area.name })) || [],
      Region: fetchRegionData?.data?.map(region => ({ id: region.id, name: region.name })) || [],
      Zone: fetchZoneData?.data?.map(zone => ({ id: zone.id, name: zone.name })) || [],
      Territory: fetchTerritoryData?.data?.map(territory => ({ id: territory.id, name: territory.name })) || []
    }
  }, [fetchBranchData, fetchAreaData, fetchRegionData, fetchZoneData, fetchTerritoryData])

  const columnHelper = createColumnHelper<VacancyRequestGroupByDesignation>()

  const handleFilterDrawerToggle = (filterType?: string) => {
    if (filterType) {
      setSelectedFilterType(filterType)
      setSelectedFilterValues([])
    }

    setIsFilterDrawerOpen(!isFilterDrawerOpen)
  }

  const handleViewDetails = (designationId: string) => {
    router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_REQUEST_DETAIL(designationId))
    console.log(`Viewing details for designationId: ${designationId}`)
  }

  const handleApplyFilters = () => {
    setIsFilterDrawerOpen(false)
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on filter apply
  }

  const handleResetFilters = () => {
    setSelectedFilterType(null)
    setSelectedFilterValues([])
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on filter reset
  }

  const filteredData = useMemo(() => {
    return vacancyRequestGroupByDesignationData?.data || []
  }, [vacancyRequestGroupByDesignationData])

  const columns = useMemo<ColumnDef<VacancyRequestGroupByDesignation, any>[]>(
    () => [
      columnHelper.accessor('designationName', {
        header: 'DESIGNATION NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.designationName}</Typography>
      }),
      columnHelper.accessor('departmentName', {
        header: 'DEPARTMENT NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.departmentName}</Typography>
      }),
      columnHelper.accessor('branchName', {
        header: 'BRANCH NAME',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.branchName}</Typography>
      }),
      columnHelper.accessor('count', {
        header: 'APPROVAL COUNT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.count}</Typography>
      }),
      columnHelper.accessor('designationId', {
        header: 'LAST ACTION',
        cell: ({ row }) => (
          <Tooltip title='View Details'>
            <IconButton color='primary' onClick={() => handleViewDetails(row.original.designationId)}>
              <VisibilityIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        ),
        enableSorting: false
      })
    ],
    [columnHelper]
  )

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize })
  }

  const isFilterLoading =
    fetchBranchLoading || fetchTerritoryLoading || fetchAreaLoading || fetchRegionLoading || fetchZoneLoading

  return (
    <Box sx={{}}>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: 1,
          p: 5,
          mb: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { md: 'center' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: '30%' } }}>
            <TextField
              label='Search Designation'
              variant='outlined'
              size='small'
              value={searchDesignation}
              onChange={e => {
                setSearchDesignation(e.target.value)
                setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on search
              }}
              sx={{ flex: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <IconButton
              color='primary'
              onClick={() => handleFilterDrawerToggle()}
              sx={{
                borderRadius: '8px',
                p: 1,
                '&:hover': { bgcolor: 'primary.main' }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: { xs: 2, md: 0 } }}>
            {filterOptions.map(option => (
              <Chip
                key={option}
                label={option}
                onClick={() => handleFilterDrawerToggle(option)}
                color={selectedFilterType === option ? 'primary' : 'default'}
                sx={{
                  '&:hover': {
                    backgroundColor: selectedFilterType === option ? 'primary.dark' : 'action.hover'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor='right'
        open={isFilterDrawerOpen}
        onClose={() => handleFilterDrawerToggle()}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '80%', sm: 400 }, p: 3 } }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' fontWeight='bold'>
            Filter Options
          </Typography>
        </Box>
        <Autocomplete
          options={filterOptions}
          value={selectedFilterType}
          onChange={(event, newValue) => {
            setSelectedFilterType(newValue)
            setSelectedFilterValues([])
          }}
          renderInput={params => <TextField {...params} label='Choose Filter Type' variant='outlined' size='small' />}
          sx={{ mb: 3 }}
        />
        {isFilterLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Autocomplete
            multiple
            options={selectedFilterType ? filterValuesMap[selectedFilterType].map(item => item.id) : ['Choose Filter']}
            getOptionLabel={option =>
              selectedFilterType
                ? filterValuesMap[selectedFilterType].find(item => item.id === option)?.name || option
                : option
            }
            value={selectedFilterValues}
            onChange={(event, newValue) => setSelectedFilterValues(newValue)}
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
            sx={{ mb: 3 }}
          />
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='contained' color='primary' onClick={handleApplyFilters} fullWidth>
            Apply Filters
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleResetFilters} fullWidth>
            Reset
          </Button>
        </Box>
      </Drawer>

      {vacancyRequestGroupByDesignationFailure ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>No Data</Box>
      ) : (
        <DynamicTable
          columns={columns}
          data={filteredData}
          totalCount={vacancyRequestGroupByDesignationData?.totalCount}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tableName='Vacancy Requests'
          loading={vacancyRequestGroupByDesignationLoading}
        />
      )}
    </Box>
  )
}

export default VacancyRequestListing
