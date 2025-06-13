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

import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined'

import { toast, ToastContainer } from 'react-toastify'

import DataUploadTableList from './DataUploadTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDataUploads, createDataUpload, fetchUploadCategories } from '@/redux/DataUpload/dataUploadSlice'

// Import react-toastify for toast messages
import 'react-toastify/dist/ReactToastify.css'

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
  const [fileError, setFileError] = useState<string | null>(null)

  // Fetch categories only once on mount
  useEffect(() => {
    if (!hasFetchedCategories.current && categoriesStatus === 'idle') {
      console.log('Fetching upload categories') // Debug log
      dispatch(fetchUploadCategories())
      hasFetchedCategories.current = true
    }
  }, [dispatch]) // Removed categoriesStatus from dependencies

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const trimmedQuery = searchQuery.trim()

      console.log('Fetching data uploads with search:', trimmedQuery) // Debug log
      dispatch(
        fetchDataUploads({
          page: 1,
          limit: 5,
          search: trimmedQuery || undefined
        })
      )
      prevSearchQuery.current = trimmedQuery
    }, 300)

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

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null

  //   setSelectedFile(file)
  // }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    setSelectedFile(file)
    setFileError(file ? null : 'Please select a file')
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setFileError('Please select a file')
    }

    if (!selectedCategory) {
      return // Autocomplete will handle its own validation
    }

    if (!selectedFile || !selectedCategory) return

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

        // Show success toast message
        toast.success(result.message || 'File uploaded successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })

        // Refresh the data after successful upload
        dispatch(
          fetchDataUploads({
            page: 1,
            limit: 5,
            search: searchQuery.trim() || undefined
          })
        )
      } catch (error: any) {
        console.error('File upload failed:', error)

        // Show error toast message
        toast.error(error || 'Failed to upload file. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }

      handleDialogClose()
    } else {
      console.log('Please select a file and category')

      // Show warning toast if file or category is missing
      toast.warn('Please select a file and category', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
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
              sx={{ width: '300px' }}
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
                sx={{
                  minWidth: '70px',
                  textTransform: 'none',
                  boxShadow: 3,
                  border: '2px solid white',
                  borderRadius: 2
                }}
                size='small'
                startIcon={<UploadOutlinedIcon fontSize='large' />}
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
            {/* <TextField
              label='Select File'
              type='file'
              InputLabelProps={{ shrink: true }}
              onChange={handleFileChange}
              inputProps={{ accept: '.pdf,.csv,.xlsx,.doc,.docx' }} // Restrict file types
              fullWidth
              size='small'
            /> */}

            <TextField
              label='Select File'
              type='file'
              InputLabelProps={{ shrink: true }}
              onChange={handleFileChange}
              inputProps={{ accept: '.pdf,.csv,.xlsx,.doc,.docx' }}
              fullWidth
              size='small'
              error={!!fileError}
              helperText={fileError}
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

      {/* Add ToastContainer for toast messages */}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default DataUploadListingPage
