'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import {
  Box,
  Card,
  Grid,
  Popper,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Autocomplete,
  TextField
} from '@mui/material'

// Component Imports
import BranchEmployeeChart from '@/views/dashboards/budgetReport/BranchEmployeeChart'
import BubblePositionTrendsChart from '@/views/dashboards/budgetReport/BubblePositionTrendsChart'
import BranchOpeningsChart from '@/views/dashboards/budgetReport/BranchOpeningsChart'
import ResignationsListReport from '@/views/dashboards/budgetReport/ResignationsListReport'

// Redux Imports
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchArea, getBranchList, fetchBranchReport, fetchVacancyReport } from '@/redux/BranchManagementSlice'
import type { RootState } from '@/redux/store'
import type { BranchManagementState } from '@/types/branch'

// Custom Popper component to fix dropdown positioning
const CustomPopper = (props: any) => <Popper {...props} placement='bottom-start' style={{ zIndex: 1300 }} />

const BudgetReport = () => {
  const dispatch = useAppDispatch()

  const {
    fetchBranchReportData,
    fetchBranchReportLoading,
    fetchBranchReportFailure,
    fetchBranchReportFailureMessage,
    fetchVacancyReportData,
    fetchVacancyReportLoading,
    fetchVacancyReportFailure,
    fetchVacancyReportFailureMessage
  } = useAppSelector((state: RootState) => state.branchManagementReducer) as BranchManagementState

  const [filterMode, setFilterMode] = useState<'Branch' | 'Area'>('Branch') // Default to Branch
  const [autocompleteOptions, setAutocompleteOptions] = useState<{ name: string; id: string }[]>([])
  const [selectedFilter, setSelectedFilter] = useState<{ name: string; id: string } | null>(null)
  const employeeCount = fetchBranchReportData?.data?.employeeCount || 0
  const bubblePositions = fetchBranchReportData?.data?.bubblePositions || []
  const vacancyCount = fetchVacancyReportData?.data?.vacancyCount || 0

  // Pagination state for lazy loading
  const [branchPage, setBranchPage] = useState(1)
  const [branchTotalPages, setBranchTotalPages] = useState(0)
  const [areaPage, setAreaPage] = useState(1)
  const [areaTotalPages, setAreaTotalPages] = useState(0)
  const limit = 10 // Reduced limit to 10 for lazy loading

  // Handle toggle button change
  const handleFilterModeChange = (event: React.MouseEvent<HTMLElement>, newFilterMode: 'Branch' | 'Area' | null) => {
    if (newFilterMode !== null) {
      setFilterMode(newFilterMode)
      setSelectedFilter(null) // Reset selected filter when toggling
      setAutocompleteOptions([]) // Clear options when toggling
      // Reset pagination states
      setBranchPage(1)
      setBranchTotalPages(0)
      setAreaPage(1)
      setAreaTotalPages(0)
    }
  }

  // Fetch data based on filter mode and set default selection
  useEffect(() => {
    const fetchData = async () => {
      if (filterMode === 'Branch') {
        try {
          const response = await dispatch(getBranchList({ search: '', page: branchPage, limit })).unwrap()
          const options = response.data.map((branch: any) => ({ name: branch.name, id: branch.id }))
          const totalCount = response.totalCount || 0
          const calculatedTotalPages = Math.ceil(totalCount / limit)

          setBranchTotalPages(calculatedTotalPages)

          // Append new options to existing ones
          setAutocompleteOptions(prevOptions => {
            const existingIds = new Set(prevOptions.map(option => option.id))
            const newOptions = options.filter((option: { id: string }) => !existingIds.has(option.id))
            const updatedOptions = [...prevOptions, ...newOptions]

            // Set the first option as default if no selection has been made yet
            if (updatedOptions.length > 0 && !selectedFilter && branchPage === 1) {
              setSelectedFilter(updatedOptions[0])
            }

            return updatedOptions
          })
        } catch (error) {
          console.error('Error fetching branch list:', error)
          setAutocompleteOptions([])
        }
      } else if (filterMode === 'Area') {
        try {
          const response = await dispatch(fetchArea({ page: areaPage, limit })).unwrap()
          const options = response.data.map((area: any) => ({ name: area.name, id: area.id }))
          const totalCount = response.totalCount || 0
          const calculatedTotalPages = Math.ceil(totalCount / limit)

          setAreaTotalPages(calculatedTotalPages)

          // Append new options to existing ones
          setAutocompleteOptions(prevOptions => {
            const existingIds = new Set(prevOptions.map(option => option.id))
            const newOptions = options.filter((option: { id: string }) => !existingIds.has(option.id))
            const updatedOptions = [...prevOptions, ...newOptions]

            // Set the first option as default if no selection has been made yet
            if (updatedOptions.length > 0 && !selectedFilter && areaPage === 1) {
              setSelectedFilter(updatedOptions[0])
            }

            return updatedOptions
          })
        } catch (error) {
          console.error('Error fetching area list:', error)
          setAutocompleteOptions([])
        }
      }
    }

    fetchData()
  }, [filterMode, branchPage, areaPage, dispatch])

  // Fetch branch report when selectedFilter changes
  useEffect(() => {
    if (selectedFilter) {
      const filterKey = filterMode === 'Branch' ? 'branchId' : 'areaId'

      dispatch(fetchBranchReport({ filterKey, filterValue: selectedFilter.id }))
        .unwrap()
        .then(() => {
          console.log('Branch/Area report fetched successfully')
        })
        .catch(error => {
          console.error('Error fetching branch/area report:', error)
        })
    }
  }, [dispatch, selectedFilter, filterMode])

  // Fetch vacancy report when selectedFilter changes
  useEffect(() => {
    if (selectedFilter) {
      const filterKey = filterMode === 'Branch' ? 'branchId' : 'areaId'

      dispatch(fetchVacancyReport({ filterKey, filterValue: selectedFilter.id }))
        .unwrap()
        .then(() => {
          console.log('Vacancy report fetched successfully')
        })
        .catch(error => {
          console.error('Error fetching vacancy report:', error)
        })
    }
  }, [dispatch, selectedFilter, filterMode])

  // Handle scroll to bottom to load more options
  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget
    const position = listboxNode.scrollTop + listboxNode.clientHeight

    // Check if the user has scrolled to the bottom (within 5 pixels)
    if (listboxNode.scrollHeight - position <= 5) {
      if (filterMode === 'Branch' && branchPage <= branchTotalPages) {
        setBranchPage(prevPage => prevPage + 1)
      } else if (filterMode === 'Area' && areaPage <= areaTotalPages) {
        setAreaPage(prevPage => prevPage + 1)
      }
    }
  }

  return (
    <>
      {/* Header with filters */}
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          paddingBottom: 2,
          overflow: 'visible' // Ensure overflow is visible
        }}
      >
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='w-full flex gap-4 justify-between align-middle' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <Box mt={1}>
              <Autocomplete
                sx={{ width: '300px' }}
                PopperComponent={CustomPopper}
                options={autocompleteOptions}
                getOptionLabel={option => option.name}
                value={selectedFilter}
                onChange={(event, newValue) => setSelectedFilter(newValue)}
                renderInput={params => <TextField {...params} label={`${filterMode} Filter`} variant='outlined' />}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                ListboxProps={{
                  onScroll: handleScroll,
                  style: { maxHeight: '300px', overflow: 'auto' } // Ensure the listbox is scrollable
                }}
              />
            </Box>
            <Box mt={1} display='flex' alignItems='center' gap={2}>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Filter By:
              </Typography>
              <ToggleButtonGroup
                value={filterMode}
                exclusive
                onChange={handleFilterModeChange}
                aria-label='filter mode'
                sx={{
                  borderRadius: '8px',
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    padding: '5px 15px',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }
                }}
              >
                <ToggleButton value='Branch' aria-label='branch filter'>
                  Branch
                </ToggleButton>
                <ToggleButton value='Area' aria-label='area filter'>
                  Area
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </div>
      </Card>

      {/* Main Grid Layout */}
      <Grid container spacing={6}>
        {/* Revenue by Branch */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {fetchBranchReportLoading ? (
            <Typography>Loading employee count...</Typography>
          ) : fetchBranchReportFailure ? (
            <Typography color='error'>Error: {fetchBranchReportFailureMessage}</Typography>
          ) : (
            <BranchEmployeeChart totalEmployeeCount={employeeCount} />
          )}
        </Grid>

        {/* Expense Trends */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {fetchBranchReportLoading ? (
            <Typography>Loading Bubble Positions Overview ...</Typography>
          ) : fetchBranchReportFailure ? (
            <Typography color='error'>Error: {fetchBranchReportFailureMessage}</Typography>
          ) : (
            <BubblePositionTrendsChart bubblePositions={bubblePositions} />
          )}
        </Grid>

        <Grid item xs={12} md={8} lg={4}>
          {fetchVacancyReportLoading ? (
            <Typography>Loading vacancy count...</Typography>
          ) : fetchVacancyReportFailure ? (
            <Typography color='error'>Error: {fetchVacancyReportFailureMessage}</Typography>
          ) : (
            <BranchOpeningsChart vacancyCount={vacancyCount} />
          )}
        </Grid>

        {/* Budget Allocation */}
        <Grid item xs={12} md={12}>
          {selectedFilter ? (
            <ResignationsListReport id={selectedFilter.id} />
          ) : (
            <Typography>No selection made. Please select a Branch or Area.</Typography>
          )}
        </Grid>

        {/* Cost Efficiency Status */}
        {/* <Grid item xs={12} md={6}>
          <CostEfficiencyStatus />
        </Grid> */}

        {/* Approval Status */}
        {/* <Grid item xs={12} md={6}>
          <ApprovalStatus />
        </Grid> */}
      </Grid>
    </>
  )
}

export default BudgetReport
