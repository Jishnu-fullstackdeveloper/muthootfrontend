import React, { useEffect, useState } from 'react'

import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material'
import debounce from 'lodash/debounce'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchJobPostings } from '@/redux/JobPosting/jobListingSlice'

const JobFilterAutoComplete = ({ selectedJob, setSelectedJob, disabled }: any) => {
  const [filteredJobs, setFilteredJobs] = useState<any>([])
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [CMScurrentLimit, setCMSCurrentLimit] = useState(10)
  const [CMSsearchQuery, setSearchQuery] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const dispatch = useAppDispatch()

  const jobPostsStates = useAppSelector((state: any) => state.JobPostingReducer)
  const { jobPostingsData = [], isJobPostingsLoading, jobPostingMeta } = jobPostsStates

  const debouncedSearch = debounce((query: string) => {
    dispatch(fetchJobPostings({ page: 1, limit: 50, search: query }))
  }, 500)

  useEffect(() => {
    if (jobPostingsData?.length > 0) {
      setFilteredJobs(jobPostingsData)
    }
  }, [jobPostingsData])

  const handleCMSDropdownOpen = () => {
    dispatch(fetchJobPostings({ page: 1, limit: 50 }))
    setDropDownOpen(true)
    setCMSCurrentLimit(50)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value

    //for minimum 2 charactors
    if (query?.length >= 2) {
      setSearchQuery(query)
      debouncedSearch(query)
    }
  }

  const handleCMSListScroll = async (event: React.UIEvent<HTMLUListElement>) => {
    const listbox = event.currentTarget
    const isNearBottom = listbox.scrollTop + listbox.clientHeight >= listbox.scrollHeight - 20

    if (isNearBottom && !isLoadingMore && jobPostingMeta?.current_count < jobPostingMeta?.total_count) {
      setIsLoadingMore(true)
      const newLimit = CMScurrentLimit + 50

      try {
        await dispatch(fetchJobPostings({ page: 1, limit: newLimit, search: CMSsearchQuery || '' }))
        setCMSCurrentLimit(newLimit)
      } finally {
        setIsLoadingMore(false)
      }
    }
  }

  return (
    <Box width={'100%'} sx={{ position: 'relative' }}>
      <Typography
        sx={{
          fontSize: '11.5px',
          fontWeight: 550,
          mb: 0.5,
          color: theme => (disabled ? theme.palette.text.disabled : '#686464')
        }}
      >
        Filter By Job
      </Typography>
      <Autocomplete
        sx={{
          p: 0,
          '& .MuiAutocomplete-inputRoot': {
            paddingTop: '4px !important',
            paddingBottom: '4px !important',
            minHeight: '40px' // Adjust this to make it smaller
          },
          '& .MuiOutlinedInput-root': {
            paddingTop: '4px !important',
            paddingBottom: '4px !important'
          }
        }}
        id='contact-autocomplete'
        fullWidth
        options={filteredJobs}
        getOptionLabel={option => `${option.jobRole}, ${option.jobTitle}, ${option.designation}, ${option.location}`}
        value={selectedJob}
        onChange={(_, newValue) => {
          setSelectedJob(newValue)
        }}
        disabled={disabled}
        open={dropDownOpen}
        onOpen={handleCMSDropdownOpen}
        onClose={() => setDropDownOpen(false)}
        ListboxProps={{
          style: { maxHeight: 200, overflow: 'auto' },
          onScroll: handleCMSListScroll
        }}
        renderInput={params => (
          <TextField
            {...params}
            placeholder='Select a Contact'
            onChange={handleSearch}
            value={CMSsearchQuery}
            size='small' // This makes it more compact
            InputProps={{
              ...params.InputProps,
              sx: {
                paddingTop: '4px',
                paddingBottom: '4px'
              },
              endAdornment: (
                <>
                  {isJobPostingsLoading && <CircularProgress size={18} sx={{ color: '#008000', mr: 1 }} />}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    </Box>
  )
}

export default JobFilterAutoComplete
