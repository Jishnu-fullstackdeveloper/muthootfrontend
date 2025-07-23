'use client'
import React, { useState } from 'react'

import { Box, Card, Tab, Tabs } from '@mui/material'

import CandidateOverview from './CandidateOverview'

const CandidateDetails = () => {
  const [activeTab, setActiveTab] = useState<number>(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <div>
      <Card
        className='mb-3 p-0.5'
        sx={{
          bgcolor: '#F9FAFB',
          '& .MuiTabs-indicator': { backgroundColor: 'transparent', display: 'none' }, // Hide underline
          '& .MuiTabs-root': { borderBottom: 'none' }
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: theme => theme.palette.primary.main,
                bgcolor: '#FFFFFF', // White background for active tab
                borderRadius: 2, // Chip-like rounded corners
                mx: 0.5,
                boxShadow: 1,
                my: 1
              },
              '&:hover': { textDecoration: 'none', color: 'inherit', borderBottom: 'none' } // Remove underline on hover
            }
          }}
        >
          <Tab label='Screened' />
          <Tab label='Candidate Overview' />
          <Tab label='Interview' />
          <Tab label='Communication' />
        </Tabs>
      </Card>

      <Box>
        {activeTab === 0 && <div>Screening</div>}
        {activeTab === 1 && <CandidateOverview />}
        {activeTab === 2 && <div>Interview Content</div>}
        {activeTab === 3 && <div>Communication Content</div>}
      </Box>
    </div>
  )
}

export default CandidateDetails
