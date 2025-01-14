'use client'
import React, { useState } from 'react'
import { Box, Typography, Grid, Button, LinearProgress, Card } from '@mui/material'
import { useRouter } from 'next/navigation'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WarningIcon from '@mui/icons-material/Warning'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import WarningDialog from '@/@core/components/dialogs/accept-all-recruitment-request'

const approvers = [
  {
    name: 'Software Engineer',
    requests: 10,
    requestType: 'Resignation',
    daysSinceCreated: 2,
    warning: '2 days remaining',
    warningColor: '#f44336',
    approvalLevels: ['Branch Manager', 'HR Manager', 'Director'],
    branchDetails: 'Branch A',
    bubblePositionsCount: 4
  },
  {
    name: 'Operations Manager',
    requests: 5,
    requestType: 'Manual Creation',
    daysSinceCreated: 5,
    warning: '5 days remaining',
    warningColor: '#ff9800',
    approvalLevels: ['HR Manager', 'Director'],
    branchDetails: 'Branch B',
    bubblePositionsCount: 3
  },
  {
    name: 'Sales Executive',
    requests: 3,
    requestType: 'Business Expansion',
    daysSinceCreated: 8,
    warning: '8 days remaining',
    warningColor: '#4caf50',
    approvalLevels: ['Director'],
    branchDetails: 'Branch C',
    bubblePositionsCount: 2
  }
]

const DesignationOverview = () => {
  const router = useRouter()
  const [acceptAllConfirmed, setAcceptAllConfirmed] = useState(false)
  const [acceptAllDialogOpen, setAcceptAllDialogOpen] = useState(false)

  const handleApproveAll = () => {
    // alert('All requests approved!')
    setAcceptAllDialogOpen(true)
  }

  const handleViewRequest = (name: any) => {
    router.push(`/requests/${name.toLowerCase().replace(' ', '-')}`)
  }

  const handleConfirmAllRequestAccepted = (val: boolean) => {
    setAcceptAllConfirmed(val)
  }

  const progressBar = approvers.map(approver => {
    const daysRemaining = approver.daysSinceCreated
    return Math.max(0, 100 - daysRemaining * 10)
  })

  return (
    <>
      <WarningDialog
        open={acceptAllDialogOpen}
        tooltipText={'Are you sure you want accept all requests?'}
        HeadingText={'Accept All Requests'}
        setOpen={setAcceptAllDialogOpen}
        setAcceptAllConfirmed={setAcceptAllConfirmed}
      />
      <Box sx={{ padding: 4, minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333' }}>
            Recruitment Request Overview
          </Typography>
          <Button
            variant='contained'
            color='success'
            size='medium'
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleApproveAll}
          >
            Approve All Requests
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3 }}>
                Request Progress Overview
              </Typography>
              {approvers.map((approver, index) => (
                <Box key={approver.name} sx={{ marginBottom: 2, pb: 4 }}>
                  <Typography variant='body1' sx={{ color: '#555' }}>
                    {approver.name} - {approver.requests} Requests
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={progressBar[index]}
                    sx={{
                      height: 5,
                      borderRadius: 10,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 10,
                        backgroundColor: custom_theme_settings?.theme?.primaryColor || '#0095da'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon sx={{ color: approver.warningColor, marginRight: 1 }} />
                      <Typography variant='body2' sx={{ color: approver.warningColor, fontWeight: 'bold' }}>
                        {approver.warning}
                      </Typography>
                    </Box>
                    {/* <VisibilityIcon
                    sx={{ cursor: 'pointer', color: '#0095da' }}
                    onClick={() => handleViewRequest(approver.name)}
                  /> */}
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 5 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333' }}>
            Request Summary
          </Typography>
          <Grid container spacing={4} sx={{ marginTop: 2 }}>
            {approvers.map((approver, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#333' }}>
                    {approver.name}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555' }}>
                    <strong>Request Type:</strong> {approver.requestType}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555' }}>
                    <strong>Requests:</strong> {approver.requests}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555' }}>
                    <strong>Bubble Positions: </strong> {approver.bubblePositionsCount}
                  </Typography>

                  <Typography variant='body1' sx={{ color: '#777' }}>
                    <strong>Branch:</strong> {approver.branchDetails}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#777' }}>
                    <strong>Approval Levels:</strong> {approver.approvalLevels.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <WarningIcon sx={{ color: approver.warningColor, marginRight: 1 }} />
                    <Typography variant='body1' sx={{ color: approver.warningColor, fontWeight: 'bold' }}>
                      {approver.warning}
                    </Typography>
                  </Box>
                  <Button
                    variant='outlined'
                    color='primary'
                    fullWidth
                    sx={{ marginTop: 2 }}
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewRequest(approver.name)}
                  >
                    View Request
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default DesignationOverview
