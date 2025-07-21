import { useState } from 'react'

import { Box, Tabs, Tab } from '@mui/material'

import CandidateListing from './candidateListing'
import JdDetails from './jdDetails'
import VacancyDetails from './vaccancyDetails'

export default function Home() {
  const [activeTab, setActiveTab] = useState('Vacancy Details')

  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 'medium',
              color: 'grey.500',
              minWidth: 'auto',
              px: 2,
              py: 1
            },
            '& .Mui-selected': {
              color: 'blue.500'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'blue.500'
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
