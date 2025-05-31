'use client'
import type { ChangeEvent } from 'react'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Paper,
  CardContent,
  CardActions,
  TextField,
  List,
  ListItem,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LinkIcon from '@mui/icons-material/Link'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// Import the staticCandidates data
import { interviewCandidates } from '@/utils/sampleData/InterviewManagement/InterviewDetailData'

export interface InterviewCandidate {
  id: string
  candidateName: string
  email: string
  mobileNumber: string
  designationApplied: string
  screeningStatus: 'Shortlisted' | 'Rejected' | 'Pending' | 'Interviewed'
  interviewDate?: string
  resumeUrl?: string
  round1Status?: 'Pending' | 'Completed'
  round1Feedback?: string
  round2Status?: 'Pending' | 'Completed'
  round2Feedback?: string
  aptitudeTestStatus?: 'Pass' | 'Fail' | 'NA'
  aptitudeTestResultUrl?: string
  preOfferDocuments?: { name: string; url: string }[]
  proposedSalary?: string
  negotiationHistory?: { date: string; salary: string; notes: string }[]
  offerLetterUrl?: string
  profileComplete?: number // Percentage (0-100)
  profileMatchPercent?: number // Percentage (0-100)
  source?: string // e.g., LinkedIn, Referral
  sourceDetails?: string // e.g., Referred by John Smith
}

const InterviewDetailedPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [candidate, setCandidate] = useState<InterviewCandidate | null>(null)
  const [updatedScreeningStatus, setUpdatedScreeningStatus] = useState<string>('')
  const [round1Feedback, setRound1Feedback] = useState<string>('')
  const [round2Feedback, setRound2Feedback] = useState<string>('')
  const [activeStep, setActiveStep] = useState(0) // For Stepper
  const [tabValue, setTabValue] = useState(0) // For Tabs

  // Fetch candidate based on ID from query params
  useEffect(() => {
    const id = searchParams.get('id')

    if (id) {
      const foundCandidate = interviewCandidates.find(c => c.id === id)

      setCandidate(foundCandidate || null)
      setUpdatedScreeningStatus(foundCandidate?.screeningStatus || '')
      setRound1Feedback(foundCandidate?.round1Feedback || '')
      setRound2Feedback(foundCandidate?.round2Feedback || '')
    }
  }, [searchParams])

  // Set activeStep to 0 (Screening) when the Hiring Process tab is opened
  useEffect(() => {
    if (tabValue === 1) {
      setActiveStep(0) // Default to Screening section
    }
  }, [tabValue])

  const handleScreeningStatusChange = (event: ChangeEvent<{ value: unknown }>) => {
    const newStatus = event.target.value as 'Shortlisted' | 'Rejected' | 'Pending' | 'Interviewed'

    setUpdatedScreeningStatus(newStatus)

    // Simulate updating the candidate's screening status (in a real app, this would be an API call)
    console.log(`Updated screening status for ${candidate?.candidateName} to ${newStatus}`)
  }

  const handleFeedbackSubmit = (round: 'round1' | 'round2') => {
    const feedback = round === 'round1' ? round1Feedback : round2Feedback

    console.log(`Submitted feedback for ${candidate?.candidateName} - ${round}: ${feedback}`)

    // In a real app, this would be an API call to save feedback
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>, type: 'aptitude' | 'preOffer') => {
    const file = event.target.files?.[0]

    if (file) {
      console.log(`Uploaded ${type} file for ${candidate?.candidateName}: ${file.name}`)

      // In a real app, this would upload the file to a server and update the candidate's data
    }
  }

  const handleGenerateOfferLetter = () => {
    console.log(`Generating offer letter for ${candidate?.candidateName}`)

    // In a real app, this would generate a PDF or document and provide a URL
    const mockOfferLetterUrl = `https://example.com/offers/${candidate?.id}_offer_letter.pdf`

    console.log(`Offer letter generated: ${mockOfferLetterUrl}`)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
  }

  if (!candidate) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6'>Candidate not found</Typography>
        {/* <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/hiring-management/interview-listing')}
          sx={{ mt: 2 }}
        >
          Back to Listing
        </Button> */}
      </Box>
    )
  }

  const steps = [
    'Screening',
    'Interview Round 1',
    'Interview Feedback Form',
    'Interview Round 2',
    'Aptitude Test',
    'Pre-Offer Document Upload',
    'Salary Offer',
    'Offer Letter Creation'
  ]

  return (
    <Box>
      {/* First Section: Candidate Summary Card */}
      <Card sx={{ p: 4, mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {/* <IconButton onClick={() => router.push('/hiring-management/interview-listing')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton> */}
          <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
            Candidate Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: 30, color: 'white' }}>
            {candidate.candidateName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 2 }}>
                {candidate.candidateName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant='outlined'
                  startIcon={<DownloadIcon />}
                  href={candidate.resumeUrl || '#'}
                  target='_blank'
                  disabled={!candidate.resumeUrl}
                >
                  Download Resume
                </Button>
                {/* <Button
                  variant='outlined'
                  startIcon={<DescriptionOutlinedIcon />}
                  href={candidate.resumeUrl || '#'}
                  target='_blank'
                  disabled={!candidate.resumeUrl}
                >
                  View Resume
                </Button> */}
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailOutlinedIcon fontSize='small' color='action' />
                <Typography variant='body1'>
                  <strong>Email:</strong> {candidate.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneOutlinedIcon fontSize='small' color='action' />
                <Typography variant='body1'>
                  <strong>Phone:</strong> {candidate.mobileNumber}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkOutlineIcon fontSize='small' color='action' />
                <Typography variant='body1'>
                  <strong>Designation:</strong> {candidate.designationApplied}
                </Typography>
              </Box>
              {/* <Typography variant='body1'>
                <strong>Profile Complete:</strong> {candidate.profileComplete || 0}%
              </Typography> */}

              {/* <Typography variant='body1'>
                <strong>Profile Match:</strong> {candidate.profileMatchPercent || 0}%
              </Typography> */}
              {/* <Typography variant='body1'>
                <strong>Source:</strong> {candidate.source || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Source Details:</strong> {candidate.sourceDetails || 'N/A'}
              </Typography> */}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 1 }}>
                {/* Profile Complete Circular Progress */}
                <Tooltip title='Profile complete'>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant='determinate'
                      value={candidate.profileComplete || 0}
                      size={40}
                      thickness={5}
                      sx={{ color: 'success.main' }}
                      aria-label={`Profile Complete: ${candidate.profileComplete || 0}%`}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant='caption' component='div' color='text.secondary'>
                        {`${Math.round(candidate.profileComplete || 0)}%`}
                      </Typography>
                    </Box>
                    {/* <Typography variant='body2' fontSize='10px' sx={{ textAlign: 'center', mt: 0.5 }}>
                    <strong>Profile Complete</strong>
                  </Typography> */}
                  </Box>
                </Tooltip>

                {/* Profile Match Circular Progress */}
                <Tooltip title='Profile match'>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant='determinate'
                      value={candidate.profileMatchPercent || 0}
                      size={40}
                      thickness={5}
                      sx={{
                        color:
                          (candidate.profileMatchPercent || 0) >= 80
                            ? 'success.main'
                            : (candidate.profileMatchPercent || 0) >= 50
                              ? 'warning.main'
                              : 'error.main'
                      }}
                      aria-label={`Profile Match: ${candidate.profileMatchPercent || 0}%`}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant='caption' component='div' color='text.secondary'>
                        {`${Math.round(candidate.profileMatchPercent || 0)}%`}
                      </Typography>
                    </Box>
                    {/* <Typography variant='body2' fontSize='10px' sx={{ textAlign: 'center', mt: 0.5 }}>
                    <strong>Profile Match</strong>
                  </Typography> */}
                  </Box>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon fontSize='small' color='action' />
                <Typography variant='body1'>
                  <strong>Source:</strong> {candidate.source || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlinedIcon fontSize='small' color='action' />
                <Typography variant='body1'>
                  <strong>Source Details:</strong> {candidate.sourceDetails || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Second Section: Stepper for Hiring Process */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
            Hiring Process Timeline
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step
                key={label}
                onClick={() => handleStepClick(index)}
                onKeyDown={e => e.key === 'Enter' && handleStepClick(index)}
                role='button'
                tabIndex={0}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    cursor: 'pointer'
                  },
                  '& .MuiStepLabel-root': {
                    cursor: 'pointer'
                  },
                  '& .MuiStepIcon-root': {
                    cursor: 'pointer'
                  }
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Card>

      {/* Third Section: Tabs */}
      <Card sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label='Candidate Overview' />
          <Tab label='Hiring Process' />
          <Tab label='Workflow History' />
          <Tab label='Candidate History' />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Candidate Overview
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              This section would contain a detailed overview of the candidate, such as their skills, experience,
              education, and other relevant information.
            </Typography>
          </Card>
        )}

        {tabValue === 1 && (
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Hiring Process Details
            </Typography>

            {/* Conditionally render sections based on activeStep */}
            {activeStep === 0 && (
              <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Screening
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title='Status'>
                    <Chip
                      variant='tonal'
                      label={`${updatedScreeningStatus}`}
                      color={
                        updatedScreeningStatus === 'Shortlisted'
                          ? 'success'
                          : updatedScreeningStatus === 'Rejected'
                            ? 'error'
                            : updatedScreeningStatus === 'Interviewed'
                              ? 'info'
                              : 'warning'
                      }
                    />
                  </Tooltip>
                  <FormControl size='small'>
                    <InputLabel>Update Status</InputLabel>
                    <Select value={updatedScreeningStatus} label='Update Status' onChange={handleScreeningStatusChange}>
                      <MenuItem value='Shortlisted'>Shortlisted</MenuItem>
                      <MenuItem value='Rejected'>Rejected</MenuItem>
                      <MenuItem value='Pending'>Pending</MenuItem>
                      <MenuItem value='Interviewed'>Interviewed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            )}

            {activeStep === 1 && (
              <Card sx={{ mb: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Interview Round 1
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Status:</strong> {candidate.round1Status || 'Pending'}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {activeStep === 2 && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', border: 0.5, borderRadius: 2 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Interview Feedback Form
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body1' sx={{ mb: 1 }}>
                    <strong>Feedback for Round 1:</strong>
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    placeholder='Enter feedback for Round 1'
                    value={round1Feedback}
                    onChange={e => setRound1Feedback(e.target.value)}
                    fullWidth
                    variant='outlined'
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleFeedbackSubmit('round1')}
                    sx={{ mt: 2 }}
                  >
                    Submit Feedback
                  </Button>
                </Box>
                {/* <Box>
                  <Typography variant='body1' sx={{ mb: 1 }}>
                    <strong>Feedback for Round 2:</strong>
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    placeholder='Enter feedback for Round 2'
                    value={round2Feedback}
                    onChange={e => setRound2Feedback(e.target.value)}
                    fullWidth
                    variant='outlined'
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleFeedbackSubmit('round2')}
                    sx={{ mt: 1 }}
                  >
                    Submit Feedback
                  </Button>
                </Box> */}
              </Box>
            )}

            {activeStep === 3 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Interview Round 2
                </Typography>
                <List sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 1 }}>
                  <ListItem>
                    <Typography variant='body1'>
                      <strong>Status:</strong> {candidate.round2Status || 'Pending'}
                    </Typography>
                  </ListItem>
                </List>
              </Box>
            )}

            {activeStep === 4 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Aptitude Test
                </Typography>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body1'>
                      <strong>Status:</strong> {candidate.aptitudeTestStatus || 'NA'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {candidate.aptitudeTestStatus !== 'NA' && (
                        <Button
                          variant='outlined'
                          startIcon={<DownloadIcon />}
                          href={candidate.aptitudeTestResultUrl || '#'}
                          target='_blank'
                          disabled={!candidate.aptitudeTestResultUrl}
                        >
                          Download Test Result
                        </Button>
                      )}
                      <Button variant='outlined' component='label' startIcon={<UploadFileIcon />}>
                        Upload Test Result
                        <input type='file' hidden onChange={e => handleFileUpload(e, 'aptitude')} />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 5 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Pre-Offer Document Upload
                </Typography>
                <Button variant='outlined' component='label' startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
                  Upload Document
                  <input type='file' hidden onChange={e => handleFileUpload(e, 'preOffer')} />
                </Button>
                {candidate.preOfferDocuments && candidate.preOfferDocuments.length > 0 ? (
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                              Document Name
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                              Action
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidate.preOfferDocuments.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>
                              <Button variant='text' startIcon={<DownloadIcon />} href={doc.url} target='_blank'>
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant='body2' color='textSecondary'>
                    No documents uploaded.
                  </Typography>
                )}
              </Box>
            )}

            {activeStep === 6 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                  Salary Offer
                </Typography>
                <Stack spacing={2} sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                  <Typography variant='body1'>
                    <strong>Proposed Salary:</strong> {candidate.proposedSalary || 'Not specified'}
                  </Typography>
                  {candidate.negotiationHistory && candidate.negotiationHistory.length > 0 && (
                    <Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant='body1' sx={{ fontWeight: 'bold', mb: 1 }}>
                        Negotiation History:
                      </Typography>
                      <Stack spacing={1}>
                        {candidate.negotiationHistory.map((entry, index) => (
                          <Typography key={index} variant='body2'>
                            {entry.date}: {entry.salary} - {entry.notes}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}

            {activeStep === 7 && (
              <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    Offer Letter Creation
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {candidate.offerLetterUrl ? (
                    <Button
                      variant='outlined'
                      startIcon={<DownloadIcon />}
                      href={candidate.offerLetterUrl}
                      target='_blank'
                    >
                      View/Download Offer Letter
                    </Button>
                  ) : (
                    <Button variant='contained' color='primary' onClick={handleGenerateOfferLetter}>
                      Generate Offer Letter
                    </Button>
                  )}
                </CardActions>
              </Card>
            )}
          </Card>
        )}

        {tabValue === 2 && (
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Workflow History
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              This section would display the workflow history, such as status changes, actions taken, and timestamps.
            </Typography>
          </Card>
        )}

        {tabValue === 3 && (
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
              Candidate History
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              This section would show the candidate history, such as previous applications, interactions, or
              communications.
            </Typography>
          </Card>
        )}
      </Card>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Tooltip title='Shortlist'>
          <Button
            variant='contained'
            color='success'
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => console.log(`Shortlist candidate ${candidate.candidateName}`)}
          >
            Shortlist
          </Button>
        </Tooltip>
        <Tooltip title='Reject'>
          <Button
            variant='contained'
            color='error'
            startIcon={<CancelOutlinedIcon />}
            onClick={() => console.log(`Reject candidate ${candidate.candidateName}`)}
          >
            Reject
          </Button>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default InterviewDetailedPage
