'use client'
import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Button, LinearProgress, Card, Tooltip, Badge, Chip } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import WarningIcon from '@mui/icons-material/Warning'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import WarningDialog from '@/@core/components/dialogs/accept-all-recruitment-request'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SettingsIcon from '@mui/icons-material/Settings'
import XFactorDialog from '@/components/Dialog/x-factorDialog'

const approvers = [
  {
    name: 'Software Engineer',
    requests: 10,
    requestType: 'Resignation',
    daysSinceCreated: 2,
    warning: '2 requests remaining of 10',
    warningColor: '#4caf50',
    approvalLevels: [
      { level: 'Branch Manager', status: 'Approved' },
      { level: 'HR Manager', status: 'Pending' },
      { level: 'Director', status: 'Rejected' }
    ],
    branchDetails: 'Branch A',
    bubblePositionsCount: 4
  },
  {
    name: 'Operations Manager',
    requests: 5,
    requestType: 'Manual Creation',
    daysSinceCreated: 5,
    warning: '5 requests remaining of 10',
    warningColor: '#ff9800',
    approvalLevels: [
      { level: 'HR Manager', status: 'Approved' },
      { level: 'Director', status: 'Pending' }
    ],
    branchDetails: 'Branch B',
    bubblePositionsCount: 3
  },
  {
    name: 'Sales Executive',
    requests: 3,
    requestType: 'Business Expansion',
    daysSinceCreated: 8,
    warning: '8 requests remaining of 10',
    warningColor: '#f44336',
    approvalLevels: [{ level: 'Director', status: 'Approved' }],
    branchDetails: 'Branch C',
    bubblePositionsCount: 2
  },
  {
    name: 'Marketing Manager',
    requests: 3,
    requestType: 'Business Expansion',
    daysSinceCreated: 8,
    warning: '8 requests remaining of 10',
    warningColor: '#f44336',
    approvalLevels: [{ level: 'Director', status: 'Approved' }],
    branchDetails: 'Branch C',
    bubblePositionsCount: 2
  },
  {
    name: 'Quality Analyst',
    requests: 3,
    requestType: 'Business Expansion',
    daysSinceCreated: 8,
    warning: '8 requests remaining of 10',
    warningColor: '#f44336',
    approvalLevels: [{ level: 'Director', status: 'Approved' }],
    branchDetails: 'Branch C',
    bubblePositionsCount: 2
  },
  {
    name: 'Finance Manager',
    requests: 3,
    requestType: 'Business Expansion',
    daysSinceCreated: 8,
    warning: '8 requests remaining of 10',
    warningColor: '#f44336',
    approvalLevels: [{ level: 'Director', status: 'Approved' }],
    branchDetails: 'Branch C',
    bubblePositionsCount: 2
  }
]

const DesignationOverview = () => {
  const router = useRouter()
  const [acceptAllConfirmed, setAcceptAllConfirmed] = useState(false)
  const [acceptAllDialogOpen, setAcceptAllDialogOpen] = useState(false)
  const [XFactorDialogOpen, setXFactorDialogOpen] = useState(false)
  const [xFactorValue, setXFactorValue] = useState(5)

  const handleXFactorDialogOpen = () => {
    setXFactorDialogOpen(true)
  }

  const handleXFactorDialogClose = () => {
    setXFactorDialogOpen(false)
  }

  const handleSaveXFactor = (newXFactor: number) => {
    setXFactorValue(newXFactor)
  }

  const handleApproveAll = () => setAcceptAllDialogOpen(true)
  const handleViewRequest = (name: string) => router.push(`/requests/${name.toLowerCase().replace(' ', '-')}`)
  // const handleConfirmAllRequestAccepted = (val: boolean) => setAcceptAllConfirmed(val)

  useEffect(() => {
    if (acceptAllConfirmed === true) {
      setAcceptAllConfirmed(false)
      setAcceptAllDialogOpen(false)
    }
  }, [acceptAllConfirmed])

  const progressBar = approvers.map(approver => {
    const daysRemaining = approver.daysSinceCreated
    return Math.max(0, 100 - daysRemaining * 10)
  })

  const getLevelColor = (status: any) => {
    if (status === 'Approved') return '#4caf50' // Green for Approved
    if (status === 'Pending') return '#ff9800' // Orange for Pending
    return '#f44336' // Red for Rejected
  }

  return (
    <>
      <WarningDialog
        open={acceptAllDialogOpen}
        tooltipText={'Are you sure you want accept all requests?'}
        HeadingText={'Accept All Requests'}
        setOpen={setAcceptAllDialogOpen}
        setAcceptAllConfirmed={setAcceptAllConfirmed}
      />
      <XFactorDialog
        open={XFactorDialogOpen}
        onClose={handleXFactorDialogClose}
        onSave={handleSaveXFactor}
        currentXFactor={xFactorValue}
      />
      <Box sx={{ padding: 4, minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333' }}>
            Recruitment Request Overview
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<AssessmentIcon />}
              onClick={() => router.push('/recruitment-management/resignation-report')}
            >
              Reports Dashboard
            </Button>

            <Button variant='contained' color='primary' startIcon={<SettingsIcon />} onClick={handleXFactorDialogOpen}>
              Set Data Transform Days
            </Button>
          </Box>
          {/* <Button
            variant='contained'
            color='success'
            size='medium'
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleApproveAll}
          >
            Approve All Requests
          </Button> */}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3 }}>
                Request Progress Overview
              </Typography>
              <Box
                sx={{
                  maxHeight: 400, // Set a fixed height for the scrollable area
                  overflowY: 'auto', // Enable vertical scrolling
                  paddingRight: 1, // Add padding for scrollbar spacing
                  flexGrow: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    backgroundColor: '#f0f0f0'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: custom_theme_settings?.theme?.primaryColor || '#d4d4d4',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: custom_theme_settings?.theme?.primaryColor || '#bfbfbf'
                  }
                }}
              >
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
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 10 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333' }}>
            Request Summary
          </Typography>
          {/* <Grid container spacing={4} sx={{ marginTop: 2 }}>
            {approvers.map((approver, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#333' }}>
                        {approver.name}
                      </Typography>
                      <Button
                        variant='contained'
                        color='success'
                        onClick={e => {
                          e.stopPropagation()
                        }}
                        sx={{ padding: '6px 16px' }}
                        startIcon={<i className='tabler-check' />}
                      >
                        Approve
                      </Button>
                      <Button
                        variant='contained'
                        color='error'
                        onClick={e => {
                          e.stopPropagation()
                        }}
                        sx={{ padding: '6px 16px' }}
                        startIcon={<i className='tabler-playstation-x' />}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>
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
          </Grid> */}

          <Grid container spacing={4} mt={2}>
            {approvers.map((approver, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    position: 'relative',
                    minHeight: 350,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  className='transition transform hover:-translate-y-1'
                  onClick={() => {
                    const displayName = approver.name.replace(/\s+/g, '-') // Replace spaces with dashes
                    router.push(`/recruitment-management/request-listing?filter=${displayName}`)
                  }}
                >
                  {/* Request Count Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      padding: '5px 12px',
                      background: 'linear-gradient(135deg, #42a5f5 30%, #64b5f6 90%)',
                      color: '#fff',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {approver.requests} Requests
                  </Box>

                  {/* Designation Name */}
                  <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}>
                    {approver.name}
                  </Typography>

                  {/* Bubble Position Availability */}
                  <Box sx={{ marginBottom: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: approver.bubblePositionsCount > 0 ? '#eceaea' : '#e0e0e0',
                          // color: approver.bubblePositionsCount > 0 ? '#fff' : '#555',
                          borderRadius: '12px',
                          padding: '6px 12px',
                          fontWeight: 'bold',
                          fontSize: '0.95rem'
                        }}
                      >
                        Bubble Positions:
                        {approver.bubblePositionsCount > 0 ? ` ${approver.bubblePositionsCount}` : 'No Positions'}
                      </Box>
                    </Box>
                  </Box>

                  {/* Request Type */}
                  <Typography variant='body1' sx={{ color: '#555' }}>
                    <strong>Request Type:</strong> {approver.requestType}
                  </Typography>

                  {/* Branch Details */}
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 2 }}>
                    <strong>Branch:</strong> {approver.branchDetails}
                  </Typography>

                  {/* Approval Levels */}
                  <Box
                    sx={{
                      backgroundColor: '#f9f9f9',
                      padding: 2,
                      borderRadius: 2,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      marginBottom: 2
                    }}
                  >
                    <Typography variant='body1' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      Approval Levels: {approver.approvalLevels?.length}
                    </Typography>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {approver.approvalLevels.map((level, i) => (
                        <li
                          key={i}
                          style={{
                            marginBottom: '4px',
                            color: getLevelColor(level.status),
                            fontSize: '0.95rem'
                          }}
                        >
                          {`${level.level} - ${level.status}`}
                        </li>
                      ))}
                    </ul>
                  </Box>

                  {/* Approve & Reject Buttons */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1
                    }}
                  >
                    <Tooltip title='Approve Request'>
                      <Button
                        variant='contained'
                        color='success'
                        onClick={e => {
                          e.stopPropagation()
                          handleApproveAll()
                        }}
                        sx={{ padding: '6px 16px' }}
                        startIcon={<i className='tabler-check' />}
                      >
                        Approve All
                      </Button>
                    </Tooltip>
                    <Tooltip title='Reject Request'>
                      <Button
                        variant='contained'
                        color='error'
                        onClick={e => e.stopPropagation()}
                        sx={{ padding: '6px 16px' }}
                        startIcon={<i className='tabler-playstation-x' />}
                      >
                        Reject All
                      </Button>
                    </Tooltip>
                  </Box>
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
