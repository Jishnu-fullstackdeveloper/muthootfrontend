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

//import DataUploadTable from './DataUploadTable'

const DataUploadListingPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Predefined categories for Autocomplete
  const categories = ['Employee data', 'Resignation data']

  // Debounced search effect
  useEffect(() => {
    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      // Update search query for client-side filtering
      setSearchQuery(searchQuery)
    }, 300) // 300ms delay, consistent with EmployeeListingPage

    // Cleanup function to clear timeout
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery])

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

  const handleSubmit = () => {
    if (selectedFile && selectedCategory) {
      console.log('Submitting:', {
        fileName: selectedFile.name,
        category: selectedCategory
      })

      // Add logic to handle file upload (e.g., API call)
    } else {
      console.log('Please select a file and category')
    }

    handleDialogClose()
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
                sx={{ minWidth: '80px', textTransform: 'none' }}
                size='small'
              >
                <FileUploadOutlinedIcon fontSize='small' />
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
              renderInput={params => <TextField {...params} label='Category' size='small' />}
              fullWidth
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
            disabled={!selectedFile || !selectedCategory}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DataUploadListingPage
