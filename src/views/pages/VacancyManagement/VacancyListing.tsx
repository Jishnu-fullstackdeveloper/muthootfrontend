'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  InputAdornment
} from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import GridViewIcon from '@mui/icons-material/GridView'
import TableChartIcon from '@mui/icons-material/TableChart'
import { RestartAlt } from '@mui/icons-material'

import DynamicButton from '@/components/Button/dynamicButton'
import VacancyManagementFilters from '@/@core/components/dialogs/vacancy-listing-filters'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  getVacancyManagementFiltersFromCookie,
  removeVacancyManagementFiltersFromCookie,
  setVacancyManagementFiltersToCookie
} from '@/utils/functions'
import VacancyListingTableView from './VacancyTableView'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancies } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import type {
  ViewMode,
  VacancyFilters,
  PaginationState,
  Vacancy,
  DebouncedInputProps,
  SelectedTabs
} from '@/types/vacancy'

const VacancyListingPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { vacancies, totalCount, currentPage, limit, error } = useAppSelector(state => state.vacancyManagementReducer)

  console.log(totalCount, limit, currentPage)

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [addMoreFilters, setAddMoreFilters] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState<VacancyFilters>({
    location: [],
    department: [],
    employmentType: [],
    experience: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const [appliedFilters, setAppliedFilters] = useState<VacancyFilters>({
    location: [],
    department: [],
    employmentType: [],
    experience: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 1,
    limit: 10,
    display_numbers_count: 10
  })

  const [selectedTabs, setSelectedTabs] = useState<SelectedTabs>({})

  const FiltersFromCookie = getVacancyManagementFiltersFromCookie()

  useEffect(() => {
    setVacancyManagementFiltersToCookie({ selectedFilters, appliedFilters })
  }, [selectedFilters, appliedFilters])

  useEffect(() => {
    const cookieFilters = FiltersFromCookie

    if (cookieFilters?.selectedFilters) setSelectedFilters(cookieFilters.selectedFilters)
    if (cookieFilters?.appliedFilters) setAppliedFilters(cookieFilters.appliedFilters)
  }, [])

  useEffect(() => {
    if (vacancies?.length) {
      setSelectedTabs(vacancies.reduce((acc, vacancy: Vacancy) => ({ ...acc, [vacancy.id]: 0 }), {} as SelectedTabs))
    }
  }, [vacancies])

  useEffect(() => {
    dispatch(fetchVacancies({ page: paginationState.page, limit: paginationState.limit }))
  }, [dispatch, paginationState.page, paginationState.limit])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) =>
    setPaginationState(prev => ({ ...prev, page: value }))

  const handleChangeLimit = (value: any) => setPaginationState(prev => ({ ...prev, limit: value }))

  const handleTabChange = (vacancyId: any, newValue: number) =>
    setSelectedTabs(prev => ({ ...prev, [vacancyId]: newValue }))

  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => setValue(initialValue), [initialValue])
    useEffect(() => {
      const timeout = setTimeout(() => onChange(value), debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const CheckAllFiltersEmpty = (filters: VacancyFilters): boolean =>
    Object.entries(filters).every(([key, value]) =>
      Array.isArray(value)
        ? key === 'salaryRange'
          ? value[0] === 0 && value[1] === 0
          : !value.length
        : !value?.trim?.()
    )

  const handleResetFilters = () => {
    setSelectedFilters({
      location: [],
      department: [],
      employmentType: [],
      experience: [],
      skills: [],
      salaryRange: [0, 0],
      jobRole: ''
    })
    removeVacancyManagementFiltersFromCookie()
  }

  const removeSelectedFilterItem = (category: keyof VacancyFilters, value: string) =>
    setSelectedFilters(prev => ({
      ...prev,
      [category]: category === 'jobRole' ? '' : (prev[category] as string[]).filter(item => item !== value)
    }))

  const toggleFilter = (filterType: keyof VacancyFilters, filterValue: any) =>
    setAppliedFilters(prev => {
      if (filterType === 'salaryRange') {
        return {
          ...prev,
          salaryRange:
            prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1] ? [0, 0] : filterValue
        }
      }

      if (filterType === 'jobRole') {
        return { ...prev, jobRole: prev.jobRole === filterValue ? '' : filterValue }
      }

      return {
        ...prev,
        [filterType]: prev[filterType]?.includes(filterValue)
          ? (prev[filterType] as string[]).filter(item => item !== filterValue)
          : [...((prev[filterType] as string[]) || []), filterValue]
      }
    })

  const renderFilterChips = (category: keyof VacancyFilters) => {
    switch (category) {
      case 'location':
      case 'department':
      case 'employmentType':
      case 'experience':
      case 'skills':
        return selectedFilters[category].map((val: string) => (
          <Chip
            key={val}
            label={val}
            variant='outlined'
            color={appliedFilters[category].includes(val) ? 'primary' : 'default'}
            onClick={() => toggleFilter(category, val)}
            onDelete={() => removeSelectedFilterItem(category, val)}
          />
        ))
      case 'salaryRange':
        return selectedFilters.salaryRange[0] !== 0 || selectedFilters.salaryRange[1] !== 0 ? (
          <Chip
            key='salary-range'
            label={`${selectedFilters.salaryRange[0]} - ${selectedFilters.salaryRange[1]}`}
            variant='outlined'
            color={appliedFilters.salaryRange[0] !== 0 || appliedFilters.salaryRange[1] !== 0 ? 'primary' : 'default'}
            onClick={() => toggleFilter('salaryRange', selectedFilters.salaryRange)}
            onDelete={() => setSelectedFilters({ ...selectedFilters, salaryRange: [0, 0] })}
          />
        ) : null
      case 'jobRole':
        return selectedFilters.jobRole ? (
          <Chip
            key='job-role'
            label={selectedFilters.jobRole}
            variant='outlined'
            color={appliedFilters.jobRole === selectedFilters.jobRole ? 'primary' : 'default'}
            onClick={() => toggleFilter('jobRole', selectedFilters.jobRole)}
            onDelete={() => removeSelectedFilterItem('jobRole', '')}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className=''>
      <VacancyManagementFilters
        open={addMoreFilters}
        setOpen={setAddMoreFilters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setAppliedFilters={setAppliedFilters}
        handleResetFilters={handleResetFilters}
      />
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
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-3 border-bs gap-3 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-3 flex-wrap'>
            <DebouncedInput
              label='Search Vacancy'
              value=''
              onChange={() => {}}
              placeholder='Search by Job Title or skill...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ mt: 5 }}>
              <DynamicButton
                label='Add more filters'
                variant='tonal'
                icon={<i className='tabler-plus' />}
                position='start'
                onClick={() => setAddMoreFilters(true)}
                children='Add more filters'
              />
            </Box>
            <Box sx={{ mt: 5, cursor: CheckAllFiltersEmpty(selectedFilters) ? 'not-allowed' : 'pointer' }}>
              <DynamicButton
                label='Reset Filters'
                variant='outlined'
                icon={<RestartAlt />}
                position='start'
                onClick={handleResetFilters}
                children='Reset Filters'
                disabled={CheckAllFiltersEmpty(selectedFilters)}
              />
            </Box>
          </Box>
          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 5 }}>
            <DynamicButton
              label='New Vacancy'
              variant='contained'
              icon={<i className='tabler-plus' />}
              position='start'
              onClick={() => router.push(`/vacancy-management/add/new-vacancy`)}
              children='New Vacancy'
            />
            <Box
              sx={{
                display: 'flex',
                gap: 0.5, // Reduced gap
                alignItems: 'center',
                padding: '2px', // Slightly larger than 0.5px but still compact
                backgroundColor: '#f5f5f5',
                borderRadius: '6px', // Slightly smaller radius
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
                width: 'fit-content' // Adjusts to content size
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton
                  color={viewMode === 'grid' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('grid')}
                  size='small' // Smaller IconButton
                  sx={{ p: 0.5 }} // Reduced padding
                >
                  <GridViewIcon fontSize='small' /> {/* Smaller icon */}
                </IconButton>
              </Tooltip>
              <Tooltip title='Table View'>
                <IconButton
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('table')}
                  size='small' // Smaller IconButton
                  sx={{ p: 0.5 }} // Reduced padding
                >
                  <TableChartIcon fontSize='small' /> {/* Smaller icon */}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box>
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
        </Box>
      </Card>

      {/* {error && (
        <Box sx={{ mb: 4, mx: 6 }}>
          <Alert severity='error' variant='filled'>
            <Typography>{error}</Typography>
          </Alert>
        </Box>
      )} */}

      {error && (
        <Box sx={{ mb: 4, mx: 6 }}>
          <Typography variant='h6' color='error'>
            Error: {error}
          </Typography>
        </Box>
      )}

      <Box className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          vacancies?.map((vacancy: Vacancy) => (
            <Box
              onClick={() => router.push(`/vacancy-management/view/${vacancy.id}`)}
              key={vacancy.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
              sx={{ cursor: 'pointer', minHeight: '150px' }}
            >
              <Box className='pt-3 pl-4 pb-1 pr-2 flex justify-between items-center'>
                <Typography mt={2} fontWeight='bold' fontSize='13px' gutterBottom>
                  {vacancy.designationName}
                </Typography>
                <Box className='flex'>
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
                </Box>
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
                </Tabs>
                <Box className='mt-4'>
                  {selectedTabs[vacancy.id] === 0 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-y-2'>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Category Type:</strong> {vacancy.employeeCategoryType}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Grade:</strong> {vacancy.gradeName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Band:</strong> {vacancy.bandName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Business Unit:</strong> {vacancy.businessUnitName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Branch:</strong> {vacancy.branchesName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Department:</strong> {vacancy.departmentName}
                      </Typography>
                      <Chip
                        variant='tonal'
                        label={`Start Date: ${vacancy.createdAt.split('T')[0]}`}
                        color='success'
                        size='small'
                        sx={{ fontWeight: 'bold', fontSize: '8px', textTransform: 'uppercase', width: 125 }}
                      />
                      <Chip
                        variant='tonal'
                        label={`End Date: ${vacancy.updatedAt.split('T')[0]}`}
                        color='error'
                        size='small'
                        sx={{ fontWeight: 'bold', fontSize: '8px', textTransform: 'uppercase', width: 125 }}
                      />
                    </Box>
                  )}
                  {selectedTabs[vacancy.id] === 1 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-2'>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>State:</strong> {vacancy.stateName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>City:</strong> {vacancy.districtName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Region:</strong> {vacancy.regionName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Zone:</strong> {vacancy.zoneName}
                      </Typography>
                      <Typography variant='body2' fontSize='10px'>
                        <strong>Area:</strong> {vacancy.areaName}
                      </Typography>
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

      {viewMode !== 'table' && (
        <Box className='flex items-center justify-end mt-6'>
          <FormControl size='small' sx={{ minWidth: 70 }}>
            <InputLabel>Count</InputLabel>
            <Select
              value={paginationState?.limit}
              onChange={e => handleChangeLimit(e.target.value)}
              label='Limit per page'
            >
              {[10, 25, 50, 100].map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Pagination
            color='primary'
            shape='rounded'
            showFirstButton
            showLastButton
            count={paginationState?.display_numbers_count}
            page={paginationState?.page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </div>
  )
}

export default VacancyListingPage
