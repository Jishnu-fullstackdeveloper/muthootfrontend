'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Card, TextField, InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import InterviewCustomizationTable from './InterviewCustomTable'

const InterviewCustomizationPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

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
              label='Search Customization'
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
          {/* <Button
            variant='contained'
            color='primary'
            className='self-center'
            size='medium'
            onClick={() => router.push('/interview-management/customization-history')}
          >
            Customization History
          </Button> */}
        </Box>
      </Card>
      <InterviewCustomizationTable />
    </>
  )
}

export default InterviewCustomizationPage
