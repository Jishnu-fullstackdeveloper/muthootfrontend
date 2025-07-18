import React from 'react'

import { Box, Card, Grid, Typography } from '@mui/material'

interface BubblePositionsOverviewProps {
  bubblePositionData: { position: string; actualCount: number; requiredCount: number; employees: any[] }[]
  loading: boolean
  failure: boolean
  failureMessage: string
}

const BubblePositionsOverview: React.FC<BubblePositionsOverviewProps> = ({
  bubblePositionData,
  loading,
  failure,
  failureMessage
}) => {
  if (loading) {
    return (
      <Typography variant='body1' sx={{ textAlign: 'center', p: 4 }}>
        Loading bubble positions...
      </Typography>
    )
  }

  if (failure) {
    return (
      <Typography variant='body1' color='error' sx={{ textAlign: 'center', p: 4 }}>
        Error: {failureMessage}
      </Typography>
    )
  }

  if (bubblePositionData.length === 0) {
    return (
      <Typography variant='body1' sx={{ textAlign: 'center', p: 4 }}>
        No bubble positions found.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 3 }}>
        Bubble Positions Overview
      </Typography>
      {bubblePositionData.map((position, index) => (
        <Card key={index} sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6' color='primary'>
                  {position.position}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, backgroundColor: '#e3f2fd', p: '8px 16px', borderRadius: 8 }}>
                  <Typography color='error'>
                    <strong>Excess:</strong> {position.actualCount - position.requiredCount}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 2 }}>
                Assigned Employees:
              </Typography>
              <Grid container spacing={2}>
                {position.employees.map((employee, empIndex) => (
                  <Grid key={empIndex} item xs={12} md={4}>
                    <Card sx={{ p: 2, backgroundColor: '#ffffff' }}>
                      <Typography variant='subtitle1'>{employee.name}</Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Employee ID: {employee.employeeCode}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Joining Date: {employee.joiningDate}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid> */}
          </Grid>
        </Card>
      ))}
    </Box>
  )
}

export default BubblePositionsOverview
