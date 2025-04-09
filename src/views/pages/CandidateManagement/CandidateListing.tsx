'use client'
import React, { useEffect, useState } from 'react'

import { Box, Card, InputAdornment, Typography } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

import DynamicButton from '@/components/Button/dynamicButton'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  getVacancyManagementFiltersFromCookie,
  removeVacancyManagementFiltersFromCookie,
  setVacancyManagementFiltersToCookie
} from '@/utils/functions'
import VacancyManagementFilters from '@/@core/components/dialogs/vacancy-listing-filters'
import CandidateTableList from './CandidateTableList'

const CandidateListing = () => {
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
    setVacancyManagementFiltersToCookie({ selectedFilters, appliedFilters })
  }, [selectedFilters, appliedFilters])

  useEffect(() => {
    if (FiltersFromCookie?.selectedFilters) {
      setSelectedFilters(FiltersFromCookie?.selectedFilters)
    }

    if (FiltersFromCookie?.appliedFilters) {
      setAppliedFilters(FiltersFromCookie?.appliedFilters)
    }
  }, [])

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
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField variant='filled' {...props} value={value} onChange={e => setValue(e.target.value)} />
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

  // Placeholder for API fetch (adjust as needed for candidates)
  //   useEffect(() => {
  //     dispatch(fetchVacancies({ page: 1, limit: 10 })) // Replace with fetchCandidates if available
  //   }, [dispatch])

  return (
    <>
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
              label='Search Candidates'
              value=''
              onChange={() => {}}
              placeholder='Search by Name or skill...'
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
          </div>
        </div>
      </Card>
      {/* <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
        Candidate List
      </Typography> */}
      <CandidateTableList />
    </>
  )
}

export default CandidateListing
