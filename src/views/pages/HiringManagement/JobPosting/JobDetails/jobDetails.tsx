import { useState } from 'react'

import { Box, Tabs, Tab } from '@mui/material'

import CandidateListing from './candidateListing'
import JdDetails from './jdDetails'
import VacancyDetails from './vaccancyDetails'

export default function Home() {
  const [activeTab, setActiveTab] = useState('Vacancy Details')

  return (
    <Box sx={{}}>
      {/* Tab Navigation */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#F9FAFB',

          '& .MuiTabs-indicator': { backgroundColor: 'transparent', display: 'none' } // Hide underline
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: '#23262F',
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
          <Tab label='Vacancy Details' value='Vacancy Details' />
          <Tab label='Jd Details' value='Jd Details' />
          <Tab label='Candidate Listing' value='Candidate Listing' />
        </Tabs>
      </Box>
      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {activeTab === 'Jd Details' && <JdDetails />}
        {activeTab === 'Vacancy Details' && <VacancyDetails />}
        {activeTab === 'Candidate Listing' && <CandidateListing />}
      </Box>
    </Box>
  )
}
