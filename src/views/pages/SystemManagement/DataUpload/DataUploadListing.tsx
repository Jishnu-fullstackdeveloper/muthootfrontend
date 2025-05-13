'use client'
import React, { useState, useEffect, useRef } from 'react'

import {
  Box,
  Card,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'

import DataUploadTableList from './DataUploadTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDataUploads, createDataUpload, fetchUploadCategories } from '@/redux/DataUpload/dataUploadSlice'

//import DataUploadTable from './DataUploadTable'

const DataUploadListingPage = () => {
  const dispatch = useAppDispatch()
  const { categories, categoriesStatus, categoriesError } = useAppSelector(state => state.dataUploadReducer)
  const [searchQuery, setSearchQuery] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const hasFetchedCategories = useRef(false) // Track if categories have been fetched
  const prevSearchQuery = useRef('') // Track previous search query

  // Fetch categories only once on mount
  useEffect(() => {
    if (!hasFetchedCategories.current && categoriesStatus === 'idle') {
      console.log('Fetching upload categories') // Debug log
      dispatch(fetchUploadCategories())
      hasFetchedCategories.current = true
    }
  }, [dispatch]) // Removed categoriesStatus from dependencies

  // Debounced search effect
  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      const trimmedQuery = searchQuery.trim()

      // Only dispatch if query has changed
      if (trimmedQuery !== prevSearchQuery.current) {
        console.log('Fetching data uploads with search:', trimmedQuery) // Debug log
        dispatch(
          fetchDataUploads({
            page: 1, // Reset to first page on new search
            limit: 5, // Consistent with DataUploadTableList
            search: trimmedQuery || undefined // Send search query if not empty
          })
        )
        prevSearchQuery.current = trimmedQuery
      }
    }, 300) // 300ms delay, consistent with EmployeeListingPage

    // Cleanup function to clear timeout
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery, dispatch])

  const handleUploadClick = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedFile(null)
    setSelectedCategory(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (selectedFile && selectedCategory) {
      try {
        const type = selectedCategory

        // Dispatch the createDataUpload thunk
        const result = await dispatch(
          createDataUpload({
            file: selectedFile,
            type
          })
        ).unwrap()

        console.log('File uploaded successfully:', result)

        // Refresh the data after successful upload
        dispatch(
          fetchDataUploads({
            page: 1,
            limit: 5,
            search: searchQuery.trim() || undefined
          })
        )
      } catch (error) {
        console.error('File upload failed:', error)
      }

      handleDialogClose()
    } else {
      console.log('Please select a file and category')
    }
  }

  return (
    <>
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
        <Box className='flex justify-between flex-col items-start md:flex-row md:items-start p-4 border-bs gap-4 custom-scrollbar-xaxis'>
          <Box className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap mt-2'>
            <TextField
              label='Search by File Name'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ width: '400px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box className='flex items-center mt-2'>
            <Tooltip title='Upload file'>
              <Button
                variant='contained'
                color='primary'
                onClick={handleUploadClick}
                sx={{ minWidth: '70px', textTransform: 'none' }}
                size='small'
                startIcon={<FileUploadOutlinedIcon fontSize='medium' />}
              >
                Upload
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Card>
      {/* <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
        Data Upload List
      </Typography> */}
      <DataUploadTableList />
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth='sm' fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label='Select File'
              type='file'
              InputLabelProps={{ shrink: true }}
              onChange={handleFileChange}
              inputProps={{ accept: '.pdf,.csv,.xlsx,.doc,.docx' }} // Restrict file types
              fullWidth
              size='small'
            />
            <Autocomplete
              options={categories}
              value={selectedCategory}
              onChange={(event, newValue) => setSelectedCategory(newValue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Type/Category'
                  size='small'
                  error={categoriesStatus === 'failed'}
                  helperText={categoriesStatus === 'failed' ? categoriesError : undefined}
                />
              )}
              fullWidth
              disabled={categoriesStatus === 'loading'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color='primary'
            variant='contained'
            disabled={!selectedFile || !selectedCategory || categoriesStatus === 'loading'}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DataUploadListingPage
