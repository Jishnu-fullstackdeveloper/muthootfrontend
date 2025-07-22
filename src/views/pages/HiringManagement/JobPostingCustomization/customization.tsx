'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import {
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  TextField,
  Typography,
  Card,
  InputAdornment,
  Autocomplete,
  Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import DynamicTable from '@/components/Table/dynamicTable' // Adjust path as needed

interface PlatformPair {
  platform: string[]
  band: string[]
  department: string[]
  businessUnit: string[] // Added businessUnit property
}

interface Posting {
  id: number
  pairs: PlatformPair[]
}

// Interface for flattened table data
interface TableRow {
  platform: string // Joined array for display
  band: string // Joined array for display
  department: string // Joined array for display
  businessUnit: string // Added businessUnit for display
}

const CustomizedJobPosting = () => {
  const [postings, setPostings] = useState<Posting[]>([
    { id: Date.now(), pairs: [{ platform: [], band: [], department: [], businessUnit: [] }] }
  ])

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [newPosting, setNewPosting] = useState<Posting>({
    id: 0,
    pairs: [{ platform: [], band: [], department: [], businessUnit: [] }] // Added businessUnit to newPosting
  })

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const platforms = ['LinkedIn', 'Naukri', 'Internal portal', 'Indeed']
  const bands = ['MM2', 'SM3', 'SM2', 'MM1', 'MM3', 'SM1', 'MM4', 'TM1']
  const departments = ['Internal Audit', 'QA', 'BRANCHES', 'BUSINESS']
  const businessUnit = []

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
        businessUnit: pair.businessUnit.join(', '),
        platform: pair.platform.join(', '),
        band: pair.band.join(', '),
        department: pair.department.join(', ')
      }))
    )

    if (debouncedSearchText) {
      filteredData = filteredData.filter(
        row =>
          row.platform.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
          row.band.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
          row.department.toLowerCase().includes(debouncedSearchText.toLowerCase())
      )
    }

    return filteredData
  }, [postings, debouncedSearchText])

  const totalCount = tableData.length

  // Update a specific pair in newPosting
  const updateNewPostingPair = (pairIndex: number, field: keyof PlatformPair, value: string[]) => {
    const updatedPairs = newPosting.pairs.map((pair, index) =>
      index === pairIndex ? { ...pair, [field]: value } : pair
    )

    setNewPosting({ ...newPosting, pairs: updatedPairs })
  }

  // Remove a specific pair from newPosting
  const removePairFromNewPosting = (pairIndex: number) => {
    const updatedPairs = newPosting.pairs.filter((_, index) => index !== pairIndex)

    setNewPosting({ ...newPosting, pairs: updatedPairs })
  }

  // Add new posting to postings list
  const addNewPosting = () => {
    // Basic validation to ensure at least one field has a selection
    const hasValidPair = newPosting.pairs.some(
      pair => pair.platform.length > 0 || pair.band.length > 0 || pair.department.length > 0
    )

    if (hasValidPair) {
      setPostings([...postings, { ...newPosting, id: Date.now() }])
      setNewPosting({ id: 0, pairs: [{ platform: [], band: [], department: [], businessUnit: [] }] })
      setDrawerOpen(false)
    }
  }

  // Toggle drawer
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)

    if (!open) {
      setNewPosting({ id: 0, pairs: [{ platform: [], band: [], department: [], businessUnit: [] }] })
    }
  }

  // Define columns for DynamicTable
  const columnHelper = createColumnHelper<TableRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('band', {
        header: 'Band',
        cell: ({ row }) => row.original.band
      }),
      columnHelper.accessor('businessUnit', {
        header: 'BusinessUnit',
        cell: ({ row }) => row.original.businessUnit
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: ({ row }) => row.original.department
      }),

      columnHelper.accessor('platform', {
        header: 'Platform',
        cell: ({ row }) => row.original.platform
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
          Add New
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
              {/* Band Autocomplete */}
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  multiple
                  options={bands}
                  value={pair.band}
                  onChange={(_, value) => updateNewPostingPair(pairIndex, 'band', value)}
                  renderInput={params => <TextField {...params} label='Band' placeholder='Select bands' />}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
                  }
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                />
              </Grid>

              {/* BusinessUnit Autocomplete */}
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  multiple
                  options={businessUnit}
                  value={pair.businessUnit}
                  onChange={(_, value) => updateNewPostingPair(pairIndex, 'businessUnit', value)}
                  renderInput={params => (
                    <TextField {...params} label='businessUnit' placeholder='Select businessUnit' />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
                  }
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                />
              </Grid>

              {/* Department Autocomplete */}
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  multiple
                  options={departments}
                  value={pair.department}
                  onChange={(_, value) => updateNewPostingPair(pairIndex, 'department', value)}
                  renderInput={params => <TextField {...params} label='Department' placeholder='Select departments' />}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
                  }
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                />
              </Grid>

              {/* Platform Autocomplete */}
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  multiple
                  options={platforms}
                  value={pair.platform}
                  onChange={(_, value) => updateNewPostingPair(pairIndex, 'platform', value)}
                  renderInput={params => <TextField {...params} label='Platform' placeholder='Select platforms' />}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
                  }
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                />
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

          {/* Save Posting Button */}
          <Button onClick={addNewPosting} variant='contained' sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default CustomizedJobPosting
