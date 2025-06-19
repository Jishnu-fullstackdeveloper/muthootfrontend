import React from 'react'

import { Box, Card, Typography } from '@mui/material'

interface VacancyManagementOverviewProps {
  vacanciesData: any[] // Adjust type based on fetchVacanciesData.data structure
  loading: boolean
  failure: boolean
  failureMessage: string
}

const VacancyManagementOverview: React.FC<VacancyManagementOverviewProps> = ({
  vacanciesData,
  loading

  // failure,
  // failureMessage
}) => {
  if (loading) {
    return (
      <Typography variant='body1' sx={{ textAlign: 'center', p: 4 }}>
        Loading vacancies...
      </Typography>
    )
  }

  // if (failure) {
  //   return (
  //     <Typography variant='body1' color='error' sx={{ textAlign: 'center', p: 4 }}>
  //       Error: {failureMessage}
  //     </Typography>
  //   )
  // }

  if (vacanciesData?.length === 0 || !vacanciesData) {
    return (
      <Typography variant='body1' sx={{ textAlign: 'center', p: 4 }}>
        No vacancies found
      </Typography>
    )
  }

  const filteredVacancies = vacanciesData.filter(item => item.designations)

  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 3 }}>
        Vacancy Management Overview
      </Typography>
      {filteredVacancies.map((vacancy, index) => (
        <Card key={index} sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant='body1'>
            <strong>Position:</strong> {vacancy.designations}
          </Typography>
          <Typography variant='body1'>
            <strong>Vacancies:</strong> {vacancy.count}
          </Typography>
          {/* <Typography variant='body1'>
            <strong>Applications Received:</strong> 5
          </Typography>
          <Typography variant='body1' color='error'>
            <strong>Open Vacancies:</strong> {2 - 5}
          </Typography> */}
        </Card>
      ))}
    </Box>
  )
}

export default VacancyManagementOverview
