'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  InputAdornment
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import DynamicTable from '@/components/Table/dynamicTable' // Adjust path as needed

interface TimePlatformPair {
  startDate: string
  platform: string
}

interface Posting {
  id: number
  pairs: TimePlatformPair[]
  endDate: string // Kept for compatibility, remains unused
}

// Interface for flattened table data
interface TableRow {
  postingId: number
  startDate: string
  platform: string
}

const TimeBasedJobPosting = () => {
  const [postings, setPostings] = useState<Posting[]>([
    { id: Date.now(), pairs: [{ startDate: '', platform: '' }], endDate: '' }
  ])

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [newPosting, setNewPosting] = useState<Posting>({
    id: 0,
    pairs: [{ startDate: '', platform: '' }],
    endDate: ''
  })

  const [errors, setErrors] = useState<Record<number, { startDate?: string }[]>>({})
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const platforms = ['LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'CareerBuilder']

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setPage(1) // Reset to first page on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchText])

  // Flatten and filter postings for table display
  const tableData: TableRow[] = useMemo(() => {
    let filteredData = postings.flatMap(posting =>
      posting.pairs.map(pair => ({
        postingId: posting.id,
        startDate: pair.startDate,
        platform: pair.platform
      }))
    )

    if (debouncedSearchText) {
      filteredData = filteredData.filter(
        row =>
          row.platform.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
          (row.startDate &&
            new Date(row.startDate).toLocaleString().toLowerCase().includes(debouncedSearchText.toLowerCase()))
      )
    }

    return filteredData
  }, [postings, debouncedSearchText])

  const totalCount = tableData.length

  // Validate a single time-platform pair
  const validatePair = (pair: TimePlatformPair) => {
    const newErrors: { startDate?: string } = {}
    const now = new Date()
    const start = pair.startDate ? new Date(pair.startDate) : null

    if (start && start < now) {
      newErrors.startDate = 'Start date and time must be in the present or future.'
    }

    return newErrors
  }

  // Validate all pairs in a posting
  const validatePosting = (posting: Posting) => {
    return posting.pairs.map(pair => validatePair(pair))
  }

  // Add a new pair to the newPosting
  const addPairToNewPosting = () => {
    setNewPosting({
      ...newPosting,
      pairs: [...newPosting.pairs, { startDate: '', platform: '' }]
    })
  }

  // Update a specific pair in newPosting
  const updateNewPostingPair = (pairIndex: number, field: keyof TimePlatformPair, value: string) => {
    const updatedPairs = newPosting.pairs.map((pair, index) =>
      index === pairIndex ? { ...pair, [field]: value } : pair
    )

    setNewPosting({ ...newPosting, pairs: updatedPairs })

    // Validate the updated posting
    const postingErrors = validatePosting({ ...newPosting, pairs: updatedPairs })

    setErrors(prev => ({
      ...prev,
      [newPosting.id || 0]: postingErrors
    }))
  }

  // Remove a specific pair from newPosting
  const removePairFromNewPosting = (pairIndex: number) => {
    const updatedPairs = newPosting.pairs.filter((_, index) => index !== pairIndex)

    setNewPosting({
      ...newPosting,
      pairs: updatedPairs
    })

    // Update errors for the remaining pairs
    setErrors(prev => {
      const newErrors = { ...prev }
      const postingErrors = updatedPairs.map(pair => validatePair(pair))

      newErrors[newPosting.id || 0] = postingErrors

      return newErrors
    })
  }

  // Add new posting to postings list
  const addNewPosting = () => {
    const postingErrors = validatePosting(newPosting)
    const hasErrors = postingErrors.some(error => Object.keys(error).length > 0)

    if (!hasErrors) {
      setPostings([...postings, { ...newPosting, id: Date.now() }])
      setNewPosting({ id: 0, pairs: [{ startDate: '', platform: '' }], endDate: '' })
      setErrors({})
      setDrawerOpen(false)
    } else {
      setErrors({ [newPosting.id || 0]: postingErrors })
    }
  }

  // Toggle drawer
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)

    if (!open) {
      setNewPosting({ id: 0, pairs: [{ startDate: '', platform: '' }], endDate: '' })
      setErrors({})
    }
  }

  // Define columns for DynamicTable
  const columnHelper = createColumnHelper<TableRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('startDate', {
        header: 'Start Date & Time',
        cell: ({ row }) => (row.original.startDate ? new Date(row.original.startDate).toLocaleString() : 'Not set')
      }),
      columnHelper.accessor('platform', {
        header: 'Platform',
        cell: ({ row }) => row.original.platform || 'Not set'
      })
    ],
    [columnHelper]
  )

  return (
    <Box>
      {/* Search Input */}
      <Card
        sx={{
          mb: 4,
          p: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <TextField
          label='Search Postings'
          variant='outlined'
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          placeholder='Search postings...'
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {searchText && (
                  <IconButton sx={{ color: '#d3d3d3' }} size='small' onClick={() => setSearchText('')} edge='end'>
                    <ClearIcon />
                  </IconButton>
                )}
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <Button onClick={toggleDrawer(true)} variant='contained' startIcon={<AddIcon />} sx={{ mb: 4 }}>
          Add New Posting
        </Button>
      </Card>

      {/* Dynamic Table for listing postings */}
      <Card sx={{ mb: 4 }}>
        <DynamicTable
          tableName='Job Postings List'
          columns={columns}
          data={tableData}
          pagination={{ pageIndex: page - 1, pageSize: limit }}
          totalCount={totalCount}
          onPageChange={newPage => setPage(newPage + 1)}
          onRowsPerPageChange={newLimit => setLimit(newLimit)}
          sorting={undefined}
          onSortingChange={undefined}
          initialState={undefined}
        />
      </Card>

      {/* Right-side Drawer for adding new posting */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, p: 4 } }}
      >
        <Box sx={{ mb: 4, p: 4, border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Add New Posting
          </Typography>
          {newPosting.pairs.map((pair, pairIndex) => (
            <Grid container spacing={2} alignItems='flex-start' key={pairIndex} sx={{ mb: 2 }}>
              {/* Start Date and Time */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Start Date & Time ${pairIndex + 1}`}
                  type='datetime-local'
                  value={pair.startDate}
                  onChange={e => updateNewPostingPair(pairIndex, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors[newPosting.id || 0]?.[pairIndex]?.startDate}
                  helperText={errors[newPosting.id || 0]?.[pairIndex]?.startDate}
                  sx={{ minWidth: { xs: '100%', sm: 150 }, maxWidth: { sm: 180 } }}
                />
              </Grid>

              {/* Platform Dropdown */}
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={pair.platform}
                    onChange={e => updateNewPostingPair(pairIndex, 'platform', e.target.value)}
                    label='Platform'
                    sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { sm: 120 } }}
                  >
                    <MenuItem value='' disabled>
                      Select a platform
                    </MenuItem>
                    {platforms.map(platform => (
                      <MenuItem key={platform} value={platform}>
                        {platform}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Delete Pair Button */}
              {newPosting.pairs.length > 1 && (
                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => removePairFromNewPosting(pairIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}

          {/* Add Another Pair Button */}
          <Button onClick={addPairToNewPosting} variant='outlined' startIcon={<AddIcon />} sx={{ mt: 2, mr: 2 }}>
            Add
          </Button>

          {/* Save Posting Button */}
          <Button onClick={addNewPosting} variant='contained' sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default TimeBasedJobPosting
