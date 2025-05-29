/* eslint-disable lines-around-comment */
'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, IconButton, Tab, Tabs, Tooltip, Typography, TextField, InputAdornment, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// import Stack from '@mui/material/Stack'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'

// import { RestartAlt } from '@mui/icons-material'

// Import MUI icons
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined' //designation
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined' //job role
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined' // openings
//import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined' // businessRole
//import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined' // experience
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined' // campusOrLateral
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined' // employeeCategory
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined' // employeeType
import EventOutlinedIcon from '@mui/icons-material/EventOutlined' // starting date
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined' // closing date

import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined' // hiringManager
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined' // company
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined' // businessUnit
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined' // department
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined' // territory
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined' // region
import HubOutlinedIcon from '@mui/icons-material/HubOutlined' // cluster

import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined' // area
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined' // branch
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined' // branchCode
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined' // city
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined' // state
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined' // origin
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'

import type { ViewMode, Vacancy, SelectedTabs } from '@/types/vacancy' //VacancyFilters //DebouncedInputProps
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import VacancyListingTableView from './VacancyTableView'
import { ROUTES } from '@/utils/routes'

// import {
//   getVacancyManagementFiltersFromCookie,
//   removeVacancyManagementFiltersFromCookie,
//   setVacancyManagementFiltersToCookie
// } from '@/utils/functions'
// import CustomTextField from '@/@core/components/mui/TextField'
// import VacancyManagementFilters from '@/@core/components/dialogs/vacancy-listing-filters'
// import DynamicButton from '@/components/Button/dynamicButton'

const VacancyListingPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { vacancyListData, vacancyListTotal, vacancyListLoading, vacancyListFailureMessage } = useAppSelector(
    state => state.vacancyManagementReducer
  )

  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  //const [addMoreFilters, setAddMoreFilters] = useState(false)
  const [visibleVacancies, setVisibleVacancies] = useState<Vacancy[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(6) // Fixed limit for lazy loading batches
  //const [searchTerm, setSearchTerm] = useState('') // New state for search input
  const [searchQuery, setSearchQuery] = useState<string>('') // Updated to searchQuery for consistency
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null) // Added for debounce

  // const [selectedFilters, setSelectedFilters] = useState<VacancyFilters>({
  //   location: [],
  //   department: [],
  //   employmentType: [],
  //   experience: [],
  //   skills: [],
  //   salaryRange: [0, 0],
  //   jobRole: ''
  // })

  // const [selectedFilters, setSelectedFilters] = useState<VacancyFilters>({
  //   location: [],
  //   department: [],
  //   employmentType: [],
  //   experience: [],
  //   skills: [],
  //   salaryRange: [0, 0],
  //   jobRole: ''
  // })

  const [selectedTabs, setSelectedTabs] = useState<SelectedTabs>({})

  //const FiltersFromCookie = getVacancyManagementFiltersFromCookie()

  // useEffect(() => {
  //   setVacancyManagementFiltersToCookie({ selectedFilters, appliedFilters })
  // }, [selectedFilters, appliedFilters])

  // useEffect(() => {
  //   const cookieFilters = FiltersFromCookie
  //   if (cookieFilters?.selectedFilters) setSelectedFilters(cookieFilters.selectedFilters)
  //   if (cookieFilters?.appliedFilters) setAppliedFilters(cookieFilters.appliedFilters)
  // }, [])

  // Consolidated useEffect for fetching vacancies with debounced search
  useEffect(() => {
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout for debounced search
    debounceTimeout.current = setTimeout(() => {
      console.log('Dispatching fetchVacancies with:', { page: 1, limit, search: searchQuery.trim() }) // Debug log
      dispatch(fetchVacancies({ page: 1, limit, search: searchQuery.trim() }))
        .unwrap()
        .then(result => {
          console.log('fetchVacancies result:', result) // Debug API response
          const newVacancies = result.data || []

          setVisibleVacancies(newVacancies) // Reset visibleVacancies with new data
          // Initialize selectedTabs for all new vacancies
          setSelectedTabs(newVacancies.reduce((acc, vacancy) => ({ ...acc, [vacancy.id]: 0 }), {} as SelectedTabs))
          setPage(1) // Reset to page 1
        })
        .catch(err => console.error('Search failed:', err)) // Log errors
    }, 300) // 300ms debounce delay

    // Cleanup timeout on unmount or searchQuery/viewMode change
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [dispatch, limit, searchQuery, viewMode])

  // Update visibleVacancies with unique items from API
  useEffect(() => {
    if (vacancyListData?.length && viewMode === 'grid') {
      console.log('Appending vacancies:', vacancyListData) // Debug log
      setVisibleVacancies((prev: Vacancy[]) => {
        const newVacancies = vacancyListData.filter(vacancy => !prev.some(existing => existing.id === vacancy.id))
        const updatedVacancies = [...prev, ...newVacancies]

        // Update selectedTabs for all vacancies in updatedVacancies, preserving existing selections
        setSelectedTabs(prevTabs => {
          const updatedTabs = { ...prevTabs }

          updatedVacancies.forEach(vacancy => {
            if (!(vacancy.id in updatedTabs)) {
              updatedTabs[vacancy.id] = 0 // Default to tab 0 if not already set
            }
          })

          return updatedTabs
        })

        return updatedVacancies
      })
    } else if (!vacancyListData?.length && viewMode === 'grid' && !vacancyListLoading && page === 1) {
      // Clear visibleVacancies and selectedTabs only on initial empty results
      console.log('Clearing visibleVacancies: No vacancies returned') // Debug log
      setVisibleVacancies([])
      setSelectedTabs({}) // Clear selectedTabs when no vacancies
    }
  }, [vacancyListData, viewMode, vacancyListLoading, page])

  const loadMoreVacancies = useCallback(() => {
    if (vacancyListLoading || visibleVacancies.length >= vacancyListTotal) return
    const nextPage = page + 1

    console.log('Loading more vacancies for page:', nextPage) // Debug log
    setPage(nextPage)
    dispatch(fetchVacancies({ page: nextPage, limit, search: searchQuery.trim() }))
      .unwrap()
      .then(result => {
        console.log('Loaded more vacancies:', result) // Debug log
      })
      .catch(err => console.error('Load more failed:', err))
  }, [vacancyListLoading, visibleVacancies.length, vacancyListTotal, page, dispatch, limit, searchQuery])

  useEffect(() => {
    if (viewMode !== 'grid' || visibleVacancies.length >= vacancyListTotal) return

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !vacancyListLoading) {
          loadMoreVacancies()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreVacancies, viewMode, visibleVacancies.length, vacancyListTotal, vacancyListLoading])

  const handleTabChange = (vacancyId: any, newValue: number) =>
    setSelectedTabs(prev => ({ ...prev, [vacancyId]: newValue }))

  console.log('Vacancies', visibleVacancies, vacancyListFailureMessage)

  // const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) => {
  //   const [value, setValue] = useState(initialValue)
  //   useEffect(() => setValue(initialValue), [initialValue])
  //   useEffect(() => {
  //     const timeout = setTimeout(() => onChange(value), debounce)
  //     return () => clearTimeout(timeout)
  //   }, [value])
  //   return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  // }

  // const CheckAllFiltersEmpty = (filters: VacancyFilters): boolean =>
  //   Object.entries(filters).every(([key, value]) =>
  //     Array.isArray(value)
  //       ? key === 'salaryRange'
  //         ? value[0] === 0 && value[1] === 0
  //         : !value.length
  //       : !value?.trim?.()
  //   )

  // const handleResetFilters = () => {
  //   setSelectedFilters({
  //     location: [],
  //     department: [],
  //     employmentType: [],
  //     experience: [],
  //     skills: [],
  //     salaryRange: [0, 0],
  //     jobRole: ''
  //   })
  //   removeVacancyManagementFiltersFromCookie()
  // }

  // const removeSelectedFilterItem = (category: keyof VacancyFilters, value: string) =>
  //   setSelectedFilters(prev => ({
  //     ...prev,
  //     [category]: category === 'jobRole' ? '' : (prev[category] as string[]).filter(item => item !== value)
  //   }))

  // const toggleFilter = (filterType: keyof VacancyFilters, filterValue: any) =>
  //   setAppliedFilters(prev => {
  //     if (filterType === 'salaryRange') {
  //       return {
  //         ...prev,
  //         salaryRange:
  //           prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1] ? [0, 0] : filterValue
  //       }
  //     }
  //     if (filterType === 'jobRole') {
  //       return { ...prev, jobRole: prev.jobRole === filterValue ? '' : filterValue }
  //     }
  //     return {
  //       ...prev,
  //       [filterType]: prev[filterType]?.includes(filterValue)
  //         ? (prev[filterType] as string[]).filter(item => item !== value)
  //         : [...((prev[filterType] as string[]) || []), filterValue]
  //     }
  //   })

  // const renderFilterChips = (category: keyof VacancyFilters) => {
  //   switch (category) {
  //     case 'location':
  //     case 'department':
  //     case 'employmentType':
  //     case 'experience':
  //     case 'skills':
  //       return selectedFilters[category].map((val: string) => (
  //         <Chip
  //           key={val}
  //           label={val}
  //           variant='outlined'
  //           color={appliedFilters[category].includes(val) ? 'primary' : 'default'}
  //           onClick={() => toggleFilter(category, val)}
  //           onDelete={() => removeSelectedFilterItem(category, val)}
  //         />
  //       ))
  //     case 'salaryRange':
  //       return selectedFilters.salaryRange[0] !== 0 || selectedFilters.salaryRange[1] !== 0 ? (
  //         <Chip
  //           key='salary-range'
  //           label={`${selectedFilters.salaryRange[0]} - ${selectedFilters.salaryRange[1]}`}
  //           variant='outlined'
  //           color={appliedFilters.salaryRange[0] !== 0 || appliedFilters.salaryRange[1] !== 0 ? 'primary' : 'default'}
  //           onClick={() => toggleFilter('salaryRange', selectedFilters.salaryRange)}
  //           onDelete={() => setSelectedFilters({ ...selectedFilters, salaryRange: [0, 0] })}
  //         />
  //       ) : null
  //     case 'jobRole':
  //       return selectedFilters.jobRole ? (
  //         <Chip
  //           key='job-role'
  //           label={selectedFilters.jobRole}
  //           variant='outlined'
  //           color={appliedFilters.jobRole === selectedFilters.jobRole ? 'primary' : 'default'}
  //           onClick={() => toggleFilter('jobRole', selectedFilters.jobRole)}
  //           onDelete={() => removeSelectedFilterItem('jobRole', '')}
  //         />
  //       ) : null
  //     default:
  //       return null
  //   }
  // }

  return (
    <Box className=''>
      {/* <VacancyManagementFilters
        open={addMoreFilters}
        setOpen={setAddMoreFilters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setAppliedFilters={setAppliedFilters}
        handleResetFilters={handleResetFilters}
      /> */}
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          height: 'auto',
          paddingBottom: 2
        }}
      >
        {viewMode === 'grid' && (
          <Typography variant='h5' fontWeight='bold' sx={{ p: 2 }}>
            Vacancy Listing
          </Typography>
        )}
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-2 border-bs gap-3 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-3 flex-wrap'>
            <TextField
              label='Search'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ width: '400px', mr: 2, mt: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            {/* <Box sx={{ mt: 5 }}>
              <DynamicButton
                label='Add more filters'
                variant='tonal'
                icon={<i className='tabler-plus' />}
                position='start'
                onClick={() => setAddMoreFilters(true)}
                children='Add more filters'
              />
            </Box> */}
            {/* <Box sx={{ mt: 5, cursor: CheckAllFiltersEmpty(selectedFilters) ? 'not-allowed' : 'pointer' }}>
              <DynamicButton
                label='Reset Filters'
                variant='outlined'
                icon={<RestartAlt />}
                position='start'
                onClick={handleResetFilters}
                children='Reset Filters'
                disabled={CheckAllFiltersEmpty(selectedFilters)}
              />
            </Box> */}
          </Box>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 5 }}>
            {/* <DynamicButton
              label='New Vacancy'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/vacancy-management/add/new-vacancy`)}
              children='New Vacancy'
            /> */}
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
                padding: '2px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
                width: 'fit-content'
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
        {/* <Box>
          {!CheckAllFiltersEmpty(selectedFilters) && (
            <Stack direction='row' spacing={1} ml={5}>
              <Typography component='h3' color='black'>
                Filters
              </Typography>
            </Stack>
          )}
          <Stack direction='row' spacing={1} ml={5}>
            <Box sx={{ overflow: 'hidden', maxWidth: '100%', display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
              {renderFilterChips('experience')}
              {renderFilterChips('location')}
              {renderFilterChips('department')}
              {renderFilterChips('employmentType')}
              {renderFilterChips('skills')}
              {(selectedFilters.salaryRange[0] !== 0 || selectedFilters.salaryRange[1] !== 0) && (
                <Chip
                  key='salary-range'
                  label={`${selectedFilters.salaryRange[0]} - ${selectedFilters.salaryRange[1]}`}
                  variant='outlined'
                  color={
                    appliedFilters.salaryRange?.[0] !== 0 || appliedFilters.salaryRange?.[1] !== 0
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => toggleFilter('salaryRange', selectedFilters.salaryRange)}
                  onDelete={() => setSelectedFilters({ ...selectedFilters, salaryRange: [0, 0] })}
                />
              )}
              {selectedFilters.jobRole && (
                <Chip
                  key='job-role'
                  label={selectedFilters.jobRole}
                  variant='outlined'
                  color={appliedFilters.jobRole === selectedFilters.jobRole ? 'primary' : 'default'}
                  onClick={() => toggleFilter('jobRole', selectedFilters.jobRole)}
                  onDelete={() => removeSelectedFilterItem('jobRole', '')}
                />
              )}
            </Box>
          </Stack>
        </Box> */}
      </Card>

      {vacancyListFailureMessage && (
        <Box sx={{ mb: 4, mx: 6, justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='h6' color='secondary'>
            {vacancyListFailureMessage}
          </Typography>
        </Box>
      )}

      {/* {viewMode === 'grid' && vacancyListLoading && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            Searching...
          </Typography>
        </Box>
      )} */}

      {/* {viewMode === 'grid' && vacancyListFailureMessage && (
        <Box sx={{ mb: 4, mx: 6, textAlign: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            {searchQuery ? `No vacancies match "${searchQuery}"` : 'No vacancies found'}
          </Typography>
        </Box>
      )} */}

      <Box className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          visibleVacancies?.map(vacancy => (
            <Box
              // onClick={() => router.push(`/hiring-management/vacancy-management/view/vacancy-details?id=${vacancy.id}`)}
              onClick={() => router.push(ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST_VIEW(vacancy.id))}
              key={vacancy.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              sx={{ cursor: 'pointer', minHeight: '150px' }}
            >
              <Box className='pt-3 pl-4 pb-1 pr-2 flex justify-between items-center'>
                <Tooltip title='Job Title'>
                  <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
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
                  sx={{ ml: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
                />

                {/* <Box className='flex'>
                  <Tooltip title='Edit Vacancy' placement='top'>
                    <IconButton
                      sx={{ ':hover': { color: 'primary.main' }, fontSize: '1.2rem' }}
                      onClick={e => {
                        e.stopPropagation()
                        router.push(`/vacancy-management/edit/${vacancy.id}`)
                      }}
                    >
                      <i className='tabler-edit' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete Vacancy' placement='top'>
                    <IconButton
                      sx={{ ':hover': { color: 'error.main' }, fontSize: '1.2rem' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <i className='tabler-trash' />
                    </IconButton>
                  </Tooltip>
                </Box> */}
              </Box>
              <Box className='p-2 border-t'>
                <Tabs
                  value={selectedTabs[vacancy.id] || 0}
                  onClick={e => e.stopPropagation()}
                  onChange={(e, newValue) => handleTabChange(vacancy.id, newValue)}
                  aria-label='vacancy details'
                >
                  <Tab label='Details' sx={{ fontSize: '11px' }} />
                  <Tab label='More details' sx={{ fontSize: '11px' }} />
                  {/* <Tab label='More details2' sx={{ fontSize: '11px' }} /> */}
                </Tabs>
                <Box className='mt-4'>
                  {/* {selectedTabs[vacancy.id] === 0 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      <Tooltip title='Designation'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CardMembershipOutlinedIcon fontSize='small' />: {vacancy.designation}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Job Role'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <EngineeringOutlinedIcon fontSize='small' />: {vacancy.jobRole}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Openings'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <WorkOutlineOutlinedIcon fontSize='small' />: {vacancy.openings}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Experience'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ViewTimelineOutlinedIcon fontSize='small' />: {vacancy.experienceMin} -{' '}
                          {vacancy.experienceMax} years
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Campus/Lateral'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <SchoolOutlinedIcon fontSize='small' />: {vacancy.campusOrLateral}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Employee Type'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PersonOutlineOutlinedIcon fontSize='small' />: {vacancy.employeeType}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Start Date'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'green' }}
                        >
                          <TodayOutlinedIcon fontSize='small' />: {vacancy.startingDate.split('T')[0]}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='End Date'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'red' }}
                        >
                          <EventOutlinedIcon fontSize='small' />: {vacancy.closingDate.split('T')[0]}
                        </Typography>
                      </Tooltip>
                    </Box>
                  )} */}
                  {selectedTabs[vacancy.id] === 0 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      {/* <Tooltip title='Business Role'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CorporateFareOutlinedIcon fontSize='small' />: {vacancy.businessRole}
                        </Typography>
                      </Tooltip> */}
                      <Tooltip title='Employee Category'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <InboxOutlinedIcon fontSize='small' />: {vacancy.employeeCategory}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Hiring Manager'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ManageAccountsOutlinedIcon fontSize='small' />: {vacancy.hiringManager}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Company'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ApartmentOutlinedIcon fontSize='small' />: {vacancy.company}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Business Unit'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <BusinessCenterOutlinedIcon fontSize='small' />: {vacancy.businessUnit}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Department'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <AccountTreeOutlinedIcon fontSize='small' />: {vacancy.department}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Territory'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PublicOutlinedIcon fontSize='small' />: {vacancy.territory}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Region'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PinDropOutlinedIcon fontSize='small' />: {vacancy.region}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Cluster'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <HubOutlinedIcon fontSize='small' />: {vacancy.cluster}
                        </Typography>
                      </Tooltip>
                    </Box>
                  )}
                  {selectedTabs[vacancy.id] === 1 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      <Tooltip title='Designation'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CardMembershipOutlinedIcon fontSize='small' />: {vacancy.designation}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Job Role'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <EngineeringOutlinedIcon fontSize='small' />: {vacancy.jobRole}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Openings'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <WorkOutlineOutlinedIcon fontSize='small' />: {vacancy.openings}
                        </Typography>
                      </Tooltip>
                      {/* <Tooltip title='Experience'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ViewTimelineOutlinedIcon fontSize='small' />: {vacancy.experienceMin} -{' '}
                          {vacancy.experienceMax} years
                        </Typography>
                      </Tooltip> */}
                      <Tooltip title='Campus/Lateral'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <SchoolOutlinedIcon fontSize='small' />: {vacancy.campusOrLateral}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Employee Type'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PersonOutlineOutlinedIcon fontSize='small' />: {vacancy.employeeType}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Employee Type'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <MilitaryTechOutlinedIcon fontSize='small' />: {vacancy.grade}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Start Date'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'green' }}
                        >
                          <TodayOutlinedIcon fontSize='small' />: {vacancy.startingDate.split('T')[0]}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='End Date'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'red' }}
                        >
                          <EventOutlinedIcon fontSize='small' />: {vacancy.closingDate.split('T')[0]}
                        </Typography>
                      </Tooltip>
                    </Box>
                  )}
                  {selectedTabs[vacancy.id] === 2 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      <Tooltip title='Area'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ExploreOutlinedIcon fontSize='small' />: {vacancy.area}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Branch'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <StoreOutlinedIcon fontSize='small' />: {vacancy.branch}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Branch Code'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CodeOutlinedIcon fontSize='small' />: {vacancy.branchCode}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='City'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <LocationCityOutlinedIcon fontSize='small' />: {vacancy.city}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='State'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <FlagOutlinedIcon fontSize='small' />: {vacancy.state}
                        </Typography>
                      </Tooltip>
                      <Tooltip title='Origin'>
                        <Typography
                          variant='body2'
                          fontSize='10px'
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <SourceOutlinedIcon fontSize='small' />: {vacancy.origin}
                        </Typography>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <VacancyListingTableView />
        )}
      </Box>

      {viewMode === 'grid' && visibleVacancies.length === 0 && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4 }}>
          {searchQuery ? `No vacancies match "${searchQuery}"` : 'No vacancies found'}
        </Box>
      )}
      {viewMode === 'grid' && visibleVacancies.length < vacancyListTotal && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>{vacancyListLoading ? 'Loading more...' : 'Scroll to load more'}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default VacancyListingPage
