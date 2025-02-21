import React, { useState } from 'react'

import dynamic from 'next/dynamic'

import {
  Box,
  Card,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  IconButton
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { green, yellow, red } from '@mui/material/colors'
import { Visibility } from '@mui/icons-material'
import VisibilityIcon from '@mui/icons-material/Visibility'

const MyRequestCard = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [openDialogViewJD, setOpenDialogViewJD] = useState(false)

  const ViewJd = dynamic(() => import('../JDManagement/viewJD'), { ssr: false })

  const handleViewJD = () => {
    setOpenDialogViewJD(true)
  }

  // Function to close the Dialog
  const handleCloseDialogViewJD = () => {
    setOpenDialogViewJD(false)
  }

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  const progressData: Record<'resignation' | 'transfer' | 'salaryHike', { manager: string; hr: string; ceo: string }> =
    {
      resignation: {
        manager: 'Approved',
        hr: 'Approved',
        ceo: 'Rejected'
      },
      transfer: {
        manager: 'Approved',
        hr: 'Approved',
        ceo: 'Pending'
      },
      salaryHike: {
        manager: 'Approved',
        hr: 'Pending',
        ceo: 'Rejected'
      }
    }

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return green[500]
    if (status === 'Pending') return yellow[700]
    
return red[500]
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <CheckIcon />
    if (status === 'Rejected') return <ClearIcon />
    
return <CheckIcon />
  }

  return (
    <>
      <Card
        sx={{
          cursor: 'pointer',
          padding: 2,
          boxShadow: 1,
          borderBottom: '4px solid #F59E0B'
        }}
        onClick={handleClickOpen}
      >
        <Box className='flex justify-between items-center mb-2'>
          <Typography variant='h6' component='div'>
            My Dashboard
          </Typography>
        </Box>
        <Typography variant='body2' color='textSecondary'>
          Here you can see the status of your request and the approval you need to complete{' '}
        </Typography>
      </Card>

      {/* Main Dialog for My Requests */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          '& .MuiDialog-paper': {
            width: '600px', // Set the width of the dialog
            maxWidth: '90%', // Ensure it does not overflow the viewport
            height: '80%', // Set the height of the dialog
            maxHeight: '90%' // Ensure it does not overflow the viewport vertically
          }
        }}
      >
        <DialogTitle>My Request Details</DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label='request tabs'>
            <Tab label='My Requests' />
            <Tab label='Approvals' />
          </Tabs>

          {tabIndex === 0 && (
            <>
              <br />
              <Typography variant='body2' paragraph>
                Here you can see your approval status for various requests.
              </Typography>

              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                  <Typography variant='h6'>Resignation Approval</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant='body2' color='textSecondary'>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.resignation.manager === 'Approved'}
                          icon={getStatusIcon(progressData.resignation.manager)}
                          checkedIcon={getStatusIcon(progressData.resignation.manager)}
                          sx={{
                            color: getStatusColor(progressData.resignation.manager)
                          }}
                        />
                      }
                      label={`Manager: ${progressData.resignation.manager}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.resignation.hr === 'Approved'}
                          icon={getStatusIcon(progressData.resignation.hr)}
                          checkedIcon={getStatusIcon(progressData.resignation.hr)}
                          sx={{
                            color: getStatusColor(progressData.resignation.hr)
                          }}
                        />
                      }
                      label={`HR: ${progressData.resignation.hr}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.resignation.ceo === 'Approved'}
                          icon={getStatusIcon(progressData.resignation.ceo)}
                          checkedIcon={getStatusIcon(progressData.resignation.ceo)}
                          sx={{
                            color: getStatusColor(progressData.resignation.ceo)
                          }}
                        />
                      }
                      label={`CEO: ${progressData.resignation.ceo}`}
                    />
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary aria-controls='panel2-content' id='panel2-header'>
                  <Typography variant='h6'>Transfer Approval</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant='body2' color='textSecondary'>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.transfer.manager === 'Approved'}
                          icon={getStatusIcon(progressData.transfer.manager)}
                          checkedIcon={getStatusIcon(progressData.transfer.manager)}
                          sx={{
                            color: getStatusColor(progressData.transfer.manager)
                          }}
                        />
                      }
                      label={`Manager: ${progressData.transfer.manager}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.transfer.hr === 'Approved'}
                          icon={getStatusIcon(progressData.transfer.hr)}
                          checkedIcon={getStatusIcon(progressData.transfer.hr)}
                          sx={{
                            color: getStatusColor(progressData.transfer.hr)
                          }}
                        />
                      }
                      label={`HR: ${progressData.transfer.hr}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.transfer.ceo === 'Approved'}
                          icon={getStatusIcon(progressData.transfer.ceo)}
                          checkedIcon={getStatusIcon(progressData.transfer.ceo)}
                          sx={{
                            color: getStatusColor(progressData.transfer.ceo)
                          }}
                        />
                      }
                      label={`CEO: ${progressData.transfer.ceo}`}
                    />
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary aria-controls='panel3-content' id='panel3-header'>
                  <Typography variant='h6'>Salary Hike Approval</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant='body2' color='textSecondary'>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.salaryHike.manager === 'Approved'}
                          icon={getStatusIcon(progressData.salaryHike.manager)}
                          checkedIcon={getStatusIcon(progressData.salaryHike.manager)}
                          sx={{
                            color: getStatusColor(progressData.salaryHike.manager)
                          }}
                        />
                      }
                      label={`Manager: ${progressData.salaryHike.manager}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.salaryHike.hr === 'Approved'}
                          icon={getStatusIcon(progressData.salaryHike.hr)}
                          checkedIcon={getStatusIcon(progressData.salaryHike.hr)}
                          sx={{
                            color: getStatusColor(progressData.salaryHike.hr)
                          }}
                        />
                      }
                      label={`HR: ${progressData.salaryHike.hr}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={progressData.salaryHike.ceo === 'Approved'}
                          icon={getStatusIcon(progressData.salaryHike.ceo)}
                          checkedIcon={getStatusIcon(progressData.salaryHike.ceo)}
                          sx={{
                            color: getStatusColor(progressData.salaryHike.ceo)
                          }}
                        />
                      }
                      label={`CEO: ${progressData.salaryHike.ceo}`}
                    />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </>
          )}

          <br />
          {tabIndex === 1 && (
            <>
              <Typography variant='body2' paragraph>
                You have the following pending requests to approve.
              </Typography>

              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary aria-controls='panel4-content' id='panel4-header'>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                    <Typography variant='h6'>JD Approval</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='body2' color='textSecondary'>
                      Job Description Approval
                    </Typography>
                    <Box>
                      <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => console.log('Rejected Leave Request')}
                        sx={{ marginRight: 1 }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant='contained'
                        color='success'
                        size='small'
                        onClick={() => console.log('Accepted Leave Request')}
                      >
                        Accept
                      </Button>
                      <Button

                        // variant='contained'
                        // color='primary'
                        size='small'
                        onClick={handleViewJD}
                        sx={{ marginLeft: 1 }}
                      >
                        <VisibilityIcon fontSize='small' /> {/* Eye Icon */}
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Dialog Box */}
              <Dialog
                open={openDialogViewJD}
                onClose={handleCloseDialogViewJD}
                sx={{
                  '& .MuiDialog-paper': {
                    width: '80%', // Set the width as a percentage
                    maxWidth: 'none' // Remove the default maxWidth
                  }
                }}
              >
                <DialogContent>
                  {/* Close Button in Dialog Header */}
                  <Box display='flex' justifyContent='flex-end'>
                    <IconButton onClick={handleCloseDialogViewJD} sx={{ color: 'gray' }}>
                      <Button>Close</Button>
                    </IconButton>
                  </Box>
                  <ViewJd mode='edit' id={123} />
                </DialogContent>
              </Dialog>

              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary aria-controls='panel4-content' id='panel4-header'>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                    <Typography variant='h6'>Leave Approval</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='body2' color='textSecondary'>
                      Employee requested leave for 5 days.
                    </Typography>
                    <Box>
                      <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => console.log('Rejected Leave Request')}
                        sx={{ marginRight: 1 }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant='contained'
                        color='success'
                        size='small'
                        onClick={() => console.log('Accepted Leave Request')}
                      >
                        Accept
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary aria-controls='panel5-content' id='panel5-header'>
                  <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                    <Typography variant='h6'>Remote Work Request</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='body2' color='textSecondary'>
                      Employee requested remote work for 3 days.
                    </Typography>
                    <Box>
                      <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => console.log('Rejected Leave Request')}
                        sx={{ marginRight: 1 }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant='contained'
                        color='success'
                        size='small'
                        onClick={() => console.log('Accepted Leave Request')}
                      >
                        Accept
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyRequestCard
