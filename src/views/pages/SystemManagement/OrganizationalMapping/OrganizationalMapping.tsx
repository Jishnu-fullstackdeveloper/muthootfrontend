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
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  fetchDesignation,
  fetchDesignationDismiss,
  fetchDepartment,
  fetchDepartmentDismiss,
  fetchDepartmentDesignation,
  fetchDepartmentDesignationDismiss,
  addDepartmentDesignation,
  updateDepartmentDesignation
} from '@/redux/OrganizationalMapping/organizationalMappingSlice'
import DynamicTable from '@/components/Table/dynamicTable'

interface Mapping {
  id: number
  pairs: { designation: string[]; department: string[]; locationType: string[] }[]
}

interface TableRow {
  id: string
  designation: string
  department: string
  locationType: string
}

interface MappingData {
  id: string
  designationName: string
  departments: { name: string; id: string }[]
  locationType: string
}

const OrganizationalMapping = () => {
  const locationType = ['Territory', 'Zone', 'Region', 'Area', 'Cluster', 'Branch']
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [newMapping, setNewMapping] = useState<Mapping>({
    id: 0,
    pairs: [{ designation: [], department: [], locationType: [] }]
  })

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const {
    designationData,
    isDesignationLoading,
    departmentData,
    isDepartmentLoading,
    departmentDesignationData,
    isDepartmentDesignationLoading,
    isAddDepartmentDesignationLoading,
    addDepartmentDesignationSuccess,
    addDepartmentDesignationFailure,
    addDepartmentDesignationFailureMessage,
    isUpdateDepartmentDesignationLoading,
    updateDepartmentDesignationSuccess,
    updateDepartmentDesignationFailure,
    updateDepartmentDesignationFailureMessage
  } = useAppSelector((state: any) => state.OrganizationalMappingReducer)

  const designations = designationData?.data?.map((d: any) => d.name) || []
  const departments = departmentData?.data?.map((d: any) => ({ name: d.name, id: d.id })) || []
  const mappingsData: MappingData[] = departmentDesignationData?.data || []

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchDesignation({ page: 1, limit: 100 }))
    dispatch(fetchDepartment({ page: 1, limit: 100 }))
    dispatch(fetchDepartmentDesignation({ page: 1, limit: 100 }))

    return () => {
      dispatch(fetchDesignationDismiss())
      dispatch(fetchDepartmentDismiss())
      dispatch(fetchDepartmentDesignationDismiss())
    }
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    if (addDepartmentDesignationSuccess || updateDepartmentDesignationSuccess) {
      setSnackbarMessage(isEditing ? 'Mapping updated successfully!' : 'Mapping added successfully!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      setDrawerOpen(false)
      setNewMapping({ id: 0, pairs: [{ designation: [], department: [], locationType: [] }] })
      setIsEditing(false)
      setEditId(null)
      dispatch(fetchDepartmentDesignation({ page: 1, limit: 100 }))
    } else if (addDepartmentDesignationFailure) {
      setSnackbarMessage(
        Array.isArray(addDepartmentDesignationFailureMessage)
          ? addDepartmentDesignationFailureMessage.join(', ')
          : addDepartmentDesignationFailureMessage || 'Failed to add mapping'
      )
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } else if (updateDepartmentDesignationFailure) {
      setSnackbarMessage(
        Array.isArray(updateDepartmentDesignationFailureMessage)
          ? updateDepartmentDesignationFailureMessage.join(', ')
          : updateDepartmentDesignationFailureMessage || 'Failed to update mapping'
      )
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }, [
    addDepartmentDesignationSuccess,
    addDepartmentDesignationFailure,
    addDepartmentDesignationFailureMessage,
    updateDepartmentDesignationSuccess,
    updateDepartmentDesignationFailure,
    updateDepartmentDesignationFailureMessage,
    dispatch,
    isEditing
  ])

  const tableData: TableRow[] = useMemo(() => {
    let filteredData = mappingsData.map(mapping => ({
      id: mapping.id,
      designation: mapping.designationName || '',
      department: mapping.departments.map(dept => dept.name).join(', ') || '',
      locationType: mapping.locationType || ''
    }))

    if (debouncedSearchText) {
      filteredData = filteredData.filter(
        row =>
          row.designation.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
          row.department.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
          row.locationType.toLowerCase().includes(debouncedSearchText.toLowerCase())
      )
    }

    return filteredData
  }, [mappingsData, debouncedSearchText])

  const totalCount = departmentDesignationData?.pagination?.totalItems || tableData.length

  const updateNewMappingPair = (pairIndex: number, field: keyof Mapping['pairs'][number], value: string[]) => {
    const updatedPairs = newMapping.pairs.map((pair, index) =>
      index === pairIndex ? { ...pair, [field]: value } : pair
    )

    setNewMapping({ ...newMapping, pairs: updatedPairs })
  }

  const removePairFromNewMapping = (pairIndex: number) => {
    const updatedPairs = newMapping.pairs.filter((_, index) => index !== pairIndex)

    setNewMapping({ ...newMapping, pairs: updatedPairs })
  }

  const handleEditClick = (row: TableRow) => {
    if (!row.id) {
      setSnackbarMessage('Invalid mapping ID')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)

      return
    }

    const mapping = mappingsData.find(m => m.id === row.id)

    if (!mapping) {
      setSnackbarMessage('Mapping not found')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)

      return
    }

    setNewMapping({
      id: 0,
      pairs: [
        {
          designation: mapping.designationName ? [mapping.designationName] : [],
          department: mapping.departments.map(dept => dept.name),
          locationType: mapping.locationType ? [mapping.locationType] : []
        }
      ]
    })
    setEditId(row.id)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const saveMapping = () => {
    const hasValidPair = newMapping.pairs.some(
      pair => pair.designation.length > 0 && pair.department.length > 0 && pair.locationType.length > 0
    )

    if (!hasValidPair) {
      setSnackbarMessage('Please select at least one designation, department, and location type')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)

      return
    }

    const pair = newMapping.pairs[0]

    const payload = {
      designationName: pair.designation[0],
      departmentIds: pair.department
        .map(name => departments.find(dept => dept.name === name)?.id)
        .filter((id): id is string => id !== undefined),
      locationType: pair.locationType[0]
    }

    if (isEditing && editId) {
      dispatch(updateDepartmentDesignation({ id: editId, data: payload }))
      dispatch(fetchDepartmentDesignation({ page: 1, limit: 100 }))
    } else {
      dispatch(addDepartmentDesignation(payload))
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)

    if (!open) {
      setNewMapping({ id: 0, pairs: [{ designation: [], department: [], locationType: [] }] })
      setIsEditing(false)
      setEditId(null)
    }
  }

  const columnHelper = createColumnHelper<TableRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('designation', { header: 'Designation' }),
      columnHelper.accessor('department', { header: 'Department' }),
      columnHelper.accessor('locationType', { header: 'Location Type' }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <IconButton onClick={() => handleEditClick(row.original)}>
            <i className='tabler-eye' />
          </IconButton>
        )
      })
    ],
    [columnHelper]
  )

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ mb: 4, p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label='Search Mappings'
          variant='outlined'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder='Search mappings...'
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {searchText && (
                  <IconButton size='small' onClick={() => setSearchText('')}>
                    <ClearIcon />
                  </IconButton>
                )}
                <SearchIcon />
              </InputAdornment>
            )
          }}
          disabled={isDesignationLoading || isDepartmentLoading}
        />
        <Button
          onClick={toggleDrawer(true)}
          variant='contained'
          startIcon={<AddIcon />}
          disabled={isDesignationLoading || isDepartmentLoading}
        >
          Add New Mapping
        </Button>
      </Card>

      <Card sx={{ mb: 4 }}>
        {isDepartmentDesignationLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DynamicTable
            tableName='Organizational Mappings'
            columns={columns}
            data={tableData}
            pagination={{ pageIndex: page - 1, pageSize: limit }}
            totalCount={totalCount}
            onPageChange={newPage => setPage(newPage + 1)}
            onRowsPerPageChange={newLimit => setLimit(newLimit)}
          />
        )}
      </Card>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, p: 4 } }}
      >
        <Box sx={{ mb: 4, p: 4, border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {isEditing ? 'Edit Organizational Mapping' : 'Add New Organizational Mapping'}
          </Typography>
          {newMapping.pairs.map((pair, pairIndex) => (
            <Grid container spacing={2} alignItems='flex-start' key={pairIndex} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={designations}
                  value={pair.designation[0] || null}
                  onChange={(_, value) => updateNewMappingPair(pairIndex, 'designation', value ? [value] : [])}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Designation'
                      placeholder='Select designation'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isDesignationLoading && <CircularProgress color='inherit' size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  disabled={isDesignationLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={departments.map(dept => dept.name)}
                  value={pair.department}
                  onChange={(_, value) => updateNewMappingPair(pairIndex, 'department', value || [])}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Department'
                      placeholder='Select departments'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isDepartmentLoading && <CircularProgress color='inherit' size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
                  }
                  disabled={isDepartmentLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={locationType}
                  value={pair.locationType[0] || null}
                  onChange={(_, value) => updateNewMappingPair(pairIndex, 'locationType', value ? [value] : [])}
                  renderInput={params => (
                    <TextField {...params} label='Location Type' placeholder='Select location type' />
                  )}
                  disabled={isDesignationLoading}
                />
              </Grid>
              {newMapping.pairs.length > 1 && (
                <Grid item xs={12}>
                  <IconButton onClick={() => removePairFromNewMapping(pairIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
          <Button
            onClick={saveMapping}
            variant='contained'
            sx={{ mt: 2 }}
            disabled={
              isDesignationLoading ||
              isDepartmentLoading ||
              isAddDepartmentDesignationLoading ||
              isUpdateDepartmentDesignationLoading
            }
          >
            {isAddDepartmentDesignationLoading || isUpdateDepartmentDesignationLoading ? (
              <CircularProgress size={24} />
            ) : isEditing ? (
              'Update Mapping'
            ) : (
              'Save Mapping'
            )}
          </Button>
        </Box>
      </Drawer>

     <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%', backgroundColor: snackbarSeverity === 'success' ? '#4caf50' : '#f44336', opacity: 1 , color: 'white'}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OrganizationalMapping
