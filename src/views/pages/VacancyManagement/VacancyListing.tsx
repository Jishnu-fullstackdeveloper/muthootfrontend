'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

import type { TextFieldProps } from '@mui/material/TextField'

import GridViewIcon from '@mui/icons-material/GridView' // Replace with your icon library if different
//import ViewListIcon from '@mui/icons-material/ViewList'
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

//import ConfirmModal from '@/@core/components/dialogs/Delete_confirmation_Dialog'
//import { vacancyList } from '@/utils/sampleData/VacancyListingData'

const VacancyListingPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { vacancies, totalCount, currentPage, limit, loading, error } = useAppSelector(
    state => state.vacancyManagementReducer
  )

  console.log(totalCount, limit, currentPage)

  // const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [viewMode, setViewMode] = useState('grid')
  const [addMoreFilters, setAddMoreFilters] = useState<any>(false)

  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    department: [],
    employmentType: [],
    experience: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const [appliedFilters, setAppliedFilters] = useState({
    location: [],
    department: [],
    employmentType: [],
    experience: [],
    skills: [],
    salaryRange: [0, 0],
    jobRole: ''
  })

  const FiltersFromCookie = getVacancyManagementFiltersFromCookie()

  useEffect(() => {
    setVacancyManagementFiltersToCookie({
      selectedFilters,
      appliedFilters
    })
  }, [selectedFilters, appliedFilters])

  const handleTabChange = (vacancyId: any, newValue: number) => {
    setSelectedTabs(prev => ({
      ...prev,
      [vacancyId]: newValue // Update the tab index for the specific vacancy
    }))
  }

  useEffect(() => {
    if (FiltersFromCookie?.selectedFilters) {
      setSelectedFilters(FiltersFromCookie?.selectedFilters)
    }

    if (FiltersFromCookie?.appliedFilters) {
      setAppliedFilters(FiltersFromCookie?.appliedFilters)
    }
  }, [])

  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 5,
    display_numbers_count: 5
  })

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationState({ ...paginationState, page: value })
  }

  const handleChangeLimit = (value: any) => {
    setPaginationState({ ...paginationState, limit: value })
  }

  const [selectedTabs, setSelectedTabs] = useState<{ [key: string]: number }>({})

  // Update selectedTabs when vacancies data is fetched to ensure Details tab (index 0) is selected by default
  useEffect(() => {
    if (vacancies && vacancies.length > 0) {
      const updatedTabs = vacancies.reduce(
        (acc, vacancy) => {
          acc[vacancy.id] = 0 // Set the default tab to 'Details' (index 0) for each vacancy

          return acc
        },
        {} as { [key: string]: number }
      )

      setSelectedTabs(updatedTabs)
    }
  }, [vacancies])

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
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const CheckAllFiltersEmpty = (filters: any): boolean => {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) {
        // For arrays, check if empty or salaryRange specifically equals [0, 0]
        return key === 'salaryRange' ? value[0] === 0 && value[1] === 0 : value.length === 0
      }

      if (typeof value === 'string') {
        // For strings, check if empty
        return value.trim() === ''
      }

      if (typeof value === 'object' && value !== null) {
        // For objects, check if they are empty
        return Object.keys(value).length === 0
      }

      return !value // Handles numbers, null, undefined, etc.
    })
  }

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

  // Function to remove a specific value from any filter array
  // Function to remove a value dynamically from a filter array
  const removeSelectedFilterItem = (category: any, value: string) => {
    setSelectedFilters((prev: any) => {
      if (category === 'jobRole') {
        setSelectedFilters({ ...selectedFilters, jobRole: '' })
      } else if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: prev[category].filter((item: string) => item !== value)
        }
      }

      return prev
    })
  }

  const toggleFilter = (filterType: any, filterValue: any) => {
    setAppliedFilters((prev: any) => {
      if (filterType === 'salaryRange') {
        // Toggle salary range: set to [0, 0] if already applied
        return {
          ...prev,
          salaryRange:
            prev.salaryRange[0] === filterValue[0] && prev.salaryRange[1] === filterValue[1]
              ? [0, 0] // Reset to default
              : filterValue
        }
      } else if (filterType === 'jobRole') {
        return {
          ...prev,
          jobRole: prev.jobRole === filterValue ? '' : filterValue // Reset if matched, otherwise set new value
        }
      } else {
        // Toggle for other filters
        return {
          ...prev,
          [filterType]: prev[filterType]?.includes(filterValue)
            ? prev[filterType].filter((item: any) => item !== filterValue) // Remove filter value
            : [...(prev[filterType] || []), filterValue] // Add filter value
        }
      }
    })
  }

  // const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  // const [vacancyIdToDelete, setVacancyIdToDelete] = useState<string | number | null>(null)

  // const handleDeleteClick = (id: string | number) => {
  //   setVacancyIdToDelete(id)
  //   setDeleteModalOpen(true)
  // }

  // const handleDeleteConfirm = (id?: string | number) => {
  //   if (id) {
  //     // Perform the delete operation here
  //     console.log('Deleting vacancy with ID:', id)
  //     // After deletion, you might want to refresh the data or remove the item from the list
  //   }
  //   setDeleteModalOpen(false)
  // }

  // Fetch vacancies when page or limit changes
  useEffect(() => {
    dispatch(fetchVacancies({ page: paginationState.page, limit: paginationState.limit }))
  }, [dispatch, paginationState.page, paginationState.limit])

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
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
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
                children='Add more filters'
                onClick={() => setAddMoreFilters(true)}
              />
            </Box>
            <Box sx={{ mt: 5, cursor: CheckAllFiltersEmpty(selectedFilters) ? 'not-allowed' : 'pointer' }}>
              <DynamicButton
                label='Reset Filters'
                variant='outlined'
                icon={<RestartAlt />} // Proper reset icon from MUI
                position='start'
                onClick={handleResetFilters}
                children='Reset Filters'
                disabled={CheckAllFiltersEmpty(selectedFilters)}
              />
            </Box>
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
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
                gap: 2, // Spacing between icons
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip> */}
              <Tooltip title='Table View'>
                <IconButton color={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
        {/* Reset Filters */}
        <Box>
          <Stack direction='row' spacing={1} ml={5}>
            {!CheckAllFiltersEmpty(selectedFilters) && (
              <Typography component='h3' color='black'>
                Filters
              </Typography>
            )}
          </Stack>
          <Stack direction='row' spacing={1} ml={5}>
            <Box
              sx={{
                overflow: 'hidden',
                maxWidth: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 1
              }}
            >
              {/* Map Experience Chips */}
              {selectedFilters.experience.map(exp => (
                <Chip
                  key={exp}
                  label={exp}
                  variant='outlined'
                  color={appliedFilters.experience.includes(exp) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('experience', exp)}
                  onDelete={() => removeSelectedFilterItem('experience', exp)}
                />
              ))}

              {/* Map Education Chips */}
              {selectedFilters.location.map(loc => (
                <Chip
                  key={loc}
                  label={loc}
                  variant='outlined'
                  color={appliedFilters.location.includes(loc) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('location', loc)}
                  onDelete={() => removeSelectedFilterItem('location', loc)}
                />
              ))}

              {/* Map Job Type Chips */}
              {selectedFilters.department.map(dept => (
                <Chip
                  key={dept}
                  label={dept}
                  variant='outlined'
                  color={appliedFilters.department.includes(dept) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('department', dept)}
                  onDelete={() => removeSelectedFilterItem('department', dept)}
                />
              ))}

              {/* Map Skills Chips */}
              {selectedFilters.employmentType.map(emp_type => (
                <Chip
                  key={emp_type}
                  label={emp_type}
                  variant='outlined'
                  color={appliedFilters.employmentType.includes(emp_type) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('employmentType', emp_type)}
                  onDelete={() => removeSelectedFilterItem('employmentType', emp_type)}
                />
              ))}

              {selectedFilters.skills.map(skill => (
                <Chip
                  key={skill}
                  label={skill}
                  variant='outlined'
                  color={appliedFilters.skills.includes(skill) ? 'primary' : 'default'}
                  onClick={() => toggleFilter('skills', skill)}
                  onDelete={() => removeSelectedFilterItem('skills', skill)}
                />
              ))}

              {/* Handle Salary Range */}
              {selectedFilters?.salaryRange[0] !== 0 || selectedFilters?.salaryRange[1] !== 0 ? (
                <Chip
                  key='salary-range'
                  label={`${selectedFilters.salaryRange[0]} - ${selectedFilters.salaryRange[1]}`}
                  variant='outlined'
                  color={
                    appliedFilters.salaryRange?.[0] !== 0 || appliedFilters.salaryRange?.[1] !== 0
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => toggleFilter('salaryRange', selectedFilters?.salaryRange)}
                  onDelete={() => {
                    setSelectedFilters({
                      ...selectedFilters,
                      salaryRange: [0, 0]
                    })
                  }}
                />
              ) : null}

              {selectedFilters?.jobRole && (
                <Chip
                  key='job-role'
                  label={selectedFilters?.jobRole}
                  variant='outlined'
                  color={appliedFilters?.jobRole === selectedFilters?.jobRole ? 'primary' : 'default'}
                  onClick={() => toggleFilter('jobRole', selectedFilters?.jobRole)}
                  onDelete={() => removeSelectedFilterItem('jobRole', '')}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Card>

      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {viewMode === 'grid' ? (
          vacancies?.map(vacancy => (
            <Box
              onClick={() => router.push(`/vacancy-management/view/${vacancy.id}`)}
              key={vacancy.id}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1`}
              sx={{
                cursor: 'pointer',
                minHeight: '150px'
              }}
            >
              {/* Header Section with Action Buttons */}
              <Box className='pt-4 pl-4 pb-3 pr-2 flex justify-between items-center'>
                <div className='flex items-center'>
                  <Typography variant='h5' mt={2} fontWeight='bold' gutterBottom>
                    {vacancy.designationName}
                  </Typography>
                </div>
                <div className='flex space-x-2'>
                  <Stack sx={{ marginTop: 2 }}>
                    {/* <Chip
                      label={vacancy.gradeName}
                      color={
                        vacancy.gradeName === 'Open'
                          ? 'success'
                          : vacancy.gradeName === 'Closed'
                            ? 'default'
                            : 'warning'
                      }
                      size='small'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.85rem', // Slightly increased font size
                        textTransform: 'uppercase'
                      }}
                    /> */}
                  </Stack>
                  <Tooltip title='Edit Vacancy' placement='top'>
                    <IconButton
                      sx={{
                        ':hover': { color: 'primary.main' }
                      }}
                      onClick={e => {
                        e.stopPropagation() // Prevent card click
                        router.push(`/vacancy-management/edit/${vacancy.id}`)
                      }}
                    >
                      <i className='tabler-edit' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete Vacancy' placement='top'>
                    <IconButton
                      sx={{
                        ':hover': { color: 'error.main' }
                      }}
                      onClick={e => {
                        e.stopPropagation() // Prevent card click
                        //handleDeleteClick(vacancy.id)
                        // Add delete logic here
                      }}
                    >
                      <i className='tabler-trash' />
                    </IconButton>
                  </Tooltip>
                </div>
              </Box>

              {/* Tabbed Details Section */}
              <Box className='p-4 border-t'>
                <Tabs
                  value={selectedTabs[vacancy.id] || 0} // Get the selected tab for the current vacancy
                  onClick={e => e.stopPropagation()}
                  onChange={(e, newValue) => handleTabChange(vacancy.id, newValue)} // Pass vacancy ID to handleTabChange
                  aria-label='vacancy details'
                >
                  {/* Tab Labels */}
                  <Tab label='Details' />
                  <Tab label='Dates' />
                  {/* <Tab label='Contact' /> */}
                </Tabs>

                {/* Tab Content */}
                <Box className='mt-4'>
                  {selectedTabs[vacancy.id] === 0 && (
                    <Box className='text-sm text-gray-700'>
                      <Box className='grid grid-cols-2 gap-y-2'>
                        <p>
                          <strong>Employee Category:</strong> {vacancy.employeeCategoryType}
                        </p>

                        <p>
                          <strong>Grade:</strong> {vacancy.gradeName}
                        </p>
                        <p>
                          <strong>Band:</strong> {vacancy.bandName}
                        </p>
                        <p>
                          <strong>Branch:</strong> {vacancy.branchesName}
                        </p>
                        <p>
                          <strong>Business Unit:</strong> {vacancy.businessUnitName}
                        </p>
                        <p>
                          <strong>Department:</strong> {vacancy.departmentName}
                        </p>

                        {/* <p>
                          <strong>State:</strong> {vacancy.stateName}
                        </p>

                        <p>
                          <strong>City:</strong> {vacancy.districtName}
                        </p>
                        <p>
                          <strong>Region:</strong> {vacancy.regionName}
                        </p>
                        <p>
                          <strong>Zone:</strong> {vacancy.zoneName}
                        </p>
                        <p>
                          <strong>Area:</strong> {vacancy.areaName}
                        </p>
                        <p>
                          <strong>Branch:</strong> {vacancy.branchesName}
                        </p> */}

                        {/* <p>
                          <strong>Positions:</strong> {vacancy.vacancyPositions}
                        </p> */}
                      </Box>
                      <Box
                        className='mt-2 shadow-md ring-white flex flex-col items-center p-4'
                        sx={{ borderRadius: 2 }}
                      >
                        <ul className=' space-y-2'>
                          <li className='text-success'>
                            <strong>State:</strong> {vacancy.stateName}
                          </li>
                          <li className='text-warning'>
                            <strong>Zone:</strong> {vacancy.zoneName}
                          </li>
                          <li className='text-primary'>
                            <strong>Region:</strong> {vacancy.regionName}
                          </li>
                          <li className='text-error'>
                            <strong>Area:</strong> {vacancy.areaName}
                          </li>
                        </ul>
                      </Box>
                    </Box>
                  )}
                  {selectedTabs[vacancy.id] === 1 && (
                    <Box className='text-sm text-gray-700 grid grid-cols-2 gap-2'>
                      <Chip
                        variant='tonal'
                        label={`Start Date: ${vacancy.createdAt.split('T')[0]}`}
                        color='secondary'
                        size='medium'
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.85rem', // Slightly increased font size
                          textTransform: 'uppercase',
                          width: 200
                        }}
                      />
                      <Chip
                        variant='tonal'
                        label={`End Date: ${vacancy.updatedAt.split('T')[0]}`}
                        color='error'
                        size='medium'
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.85rem', // Slightly increased font size
                          textTransform: 'uppercase',
                          width: 190
                        }}
                      />
                    </Box>
                  )}
                  {/* {selectedTabs[vacancy.id] === 2 && (
                    <Box className='space-y-2 text-sm text-gray-700'>
                      <p>
                        <strong>Contact Person:</strong> {vacancy.contactPerson}
                      </p>
                    </Box>
                  )} */}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <VacancyListingTableView vacancies={vacancies} count={totalCount} />
        )}
      </div>

      {viewMode !== 'table' && (
        <div className='flex items-center justify-end mt-6'>
          {/* Right-aligned Pagination */}
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
          <div>
            <Pagination
              color='primary'
              shape='rounded'
              showFirstButton
              showLastButton
              count={paginationState?.display_numbers_count} //pagination numbers display count
              page={paginationState?.page} //current page
              onChange={handlePageChange} //changing page function
            />
          </div>
        </div>
      )}
      {/* <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        id={vacancyIdToDelete}
      /> */}
    </div>
  )
}

export default VacancyListingPage
