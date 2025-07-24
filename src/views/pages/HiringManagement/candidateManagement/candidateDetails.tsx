'use client'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'

interface InterviewCandidate {
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
}

const staticCandidates: InterviewCandidate[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+1234567890',
    designationApplied: 'Software Engineer',
    screeningStatus: 'Shortlisted',
    interviewDate: '2025-05-10T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/john_doe.pdf',
    round1Status: 'Completed',
    round1Feedback: 'Good technical knowledge, confident communicator.',
    round2Status: 'Pending',
    round2Feedback: '',
    aptitudeTestStatus: 'Pass',
    aptitudeTestResultUrl: 'https://example.com/results/john_doe_aptitude.pdf',
    preOfferDocuments: [
      { name: 'ID Proof', url: 'https://example.com/docs/john_doe_id.pdf' },
      { name: 'Certificate', url: 'https://example.com/docs/john_doe_cert.pdf' }
    ],
    proposedSalary: '$80,000',
    negotiationHistory: [
      { date: '2025-05-12', salary: '$75,000', notes: 'Initial offer' },
      { date: '2025-05-14', salary: '$80,000', notes: 'Candidate requested higher salary' }
    ],
    offerLetterUrl: ''
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobileNumber: '+1987654321',
    designationApplied: 'Product Manager',
    screeningStatus: 'Pending',
    interviewDate: '2025-05-11T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/jane_smith.pdf',
    round1Status: 'Pending',
    round2Status: 'Pending',
    aptitudeTestStatus: 'NA',
    preOfferDocuments: [],
    proposedSalary: '$90,000',
    negotiationHistory: [],
    offerLetterUrl: ''
  },
  {
    id: '3',
    candidateName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    mobileNumber: '+1123456789',
    designationApplied: 'UI/UX Designer',
    screeningStatus: 'Rejected',
    interviewDate: '2025-05-12T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/alice_johnson.pdf',
    round1Status: 'Completed',
    round1Feedback: 'Lacks experience in advanced design tools.',
    round2Status: 'Pending',
    aptitudeTestStatus: 'Fail',
    preOfferDocuments: [],
    proposedSalary: '$65,000',
    offerLetterUrl: ''
  },
  {
    id: '4',
    candidateName: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    mobileNumber: '+1098765432',
    designationApplied: 'Data Analyst',
    screeningStatus: 'Interviewed',
    interviewDate: '2025-05-13T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/bob_wilson.pdf',
    round1Status: 'Completed',
    round2Status: 'Completed',
    round2Feedback: 'Strong analytical skills, good fit for the team.',
    aptitudeTestStatus: 'Pass',
    preOfferDocuments: [],
    proposedSalary: '$70,000',
    offerLetterUrl: 'https://example.com/offers/bob_wilson_offer.pdf'
  },
  {
    id: '5',
    candidateName: 'Emma Brown',
    email: 'emma.brown@example.com',
    mobileNumber: '+1345678901',
    designationApplied: 'DevOps Engineer',
    screeningStatus: 'Shortlisted',
    interviewDate: '2025-05-14T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/emma_brown.pdf',
    round1Status: 'Pending',
    round2Status: 'Pending',
    aptitudeTestStatus: 'NA',
    preOfferDocuments: [],
    proposedSalary: '$85,000',
    offerLetterUrl: ''
  },
  {
    id: '6',
    candidateName: 'Michael Lee',
    email: 'michael.lee@example.com',
    mobileNumber: '+1789012345',
    designationApplied: 'QA Engineer',
    screeningStatus: 'Pending',
    interviewDate: '2025-05-15T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/michael_lee.pdf',
    round1Status: 'Pending',
    round2Status: 'Pending',
    aptitudeTestStatus: 'NA',
    preOfferDocuments: [],
    proposedSalary: '$60,000',
    offerLetterUrl: ''
  },
  {
    id: '7',
    candidateName: 'Sarah Davis',
    email: 'sarah.davis@example.com',
    mobileNumber: '+1567890123',
    designationApplied: 'Backend Developer',
    screeningStatus: 'Rejected',
    interviewDate: '2025-05-16T00:00:00Z',
    resumeUrl: 'https://example.com/resumes/sarah_davis.pdf',
    round1Status: 'Completed',
    round1Feedback: 'Needs improvement in system design.',
    round2Status: 'Pending',
    aptitudeTestStatus: 'Fail',
    preOfferDocuments: [],
    proposedSalary: '$75,000',
    offerLetterUrl: ''
  }
]

const InterviewDetailedPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [candidate, setCandidate] = useState<InterviewCandidate | null>(null)
  const [updatedScreeningStatus, setUpdatedScreeningStatus] = useState<string>('')
  const [round1Feedback, setRound1Feedback] = useState<string>('')
  const [round2Feedback, setRound2Feedback] = useState<string>('')

  // Fetch candidate based on ID from query params
  useEffect(() => {
    const id = searchParams.get('id')

    if (id) {
      const foundCandidate = staticCandidates.find(c => c.id === id)

      setCandidate(foundCandidate || null)
      setUpdatedScreeningStatus(foundCandidate?.screeningStatus || '')
      setRound1Feedback(foundCandidate?.round1Feedback || '')
      setRound2Feedback(foundCandidate?.round2Feedback || '')
    }
  }, [searchParams])

  if (!candidate) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Candidate not found
        </Typography>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/hiring-management/interview-listing')}
          sx={{ mt: 2 }}
        >
          Back to Listing
        </Button>
      </Box>
    )
  }

  const handleScreeningStatusChange = (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value as 'Shortlisted' | 'Rejected' | 'Pending' | 'Interviewed'

    setUpdatedScreeningStatus(newStatus)

    // Simulate updating the candidate's screening status (in a real app, this would be an API call)
    console.log(`Updated screening status for ${candidate.candidateName} to ${newStatus}`)
  }

  const handleFeedbackSubmit = (round: 'round1' | 'round2') => {
    const feedback = round === 'round1' ? round1Feedback : round2Feedback

    console.log(`Submitted feedback for ${candidate.candidateName} - ${round}: ${feedback}`)

    // In a real app, this would be an API call to save feedback
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'aptitude' | 'preOffer') => {
    const file = event.target.files?.[0]

    if (file) {
      console.log(`Uploaded ${type} file for ${candidate.candidateName}: ${file.name}`)

      // In a real app, this would upload the file to a server and update the candidate's data
    }
  }

  const handleGenerateOfferLetter = () => {
    console.log(`Generating offer letter for ${candidate.candidateName}`)

    // In a real app, this would generate a PDF or document and provide a URL
    const mockOfferLetterUrl = `https://example.com/offers/${candidate.id}_offer_letter.pdf`

    console.log(`Offer letter generated: ${mockOfferLetterUrl}`)
  }

  return (
    <Box>
      {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.push('/hiring-management/interview-listing')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          Candidate Details
        </Typography>
      </Box> */}

      <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {/* <IconButton onClick={() => router.push('/hiring-management/interview-listing')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton> */}
          <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
            Candidate Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            {candidate.candidateName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title='Screening Status'>
              <FormControl size='small'>
                <InputLabel>Screening Status</InputLabel>
                <Select value={updatedScreeningStatus} label='Screening Status' onChange={handleScreeningStatusChange}>
                  <MenuItem value='Shortlisted'>Shortlisted</MenuItem>
                  <MenuItem value='Rejected'>Rejected</MenuItem>
                  <MenuItem value='Pending'>Pending</MenuItem>
                  <MenuItem value='Interviewed'>Interviewed</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
            <Button
              variant='outlined'
              startIcon={<DescriptionOutlinedIcon />}
              href={candidate.resumeUrl || '#'}
              target='_blank'
              disabled={!candidate.resumeUrl}
            >
              View/Download Resume
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Personal Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Personal Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailOutlinedIcon fontSize='small' color='action' />
              <Typography variant='body1'>
                <strong>Email:</strong> {candidate.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneOutlinedIcon fontSize='small' color='action' />
              <Typography variant='body1'>
                <strong>Mobile:</strong> {candidate.mobileNumber}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Interview Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Interview Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkOutlineIcon fontSize='small' color='action' />
              <Typography variant='body1'>
                <strong>Designation Applied:</strong> {candidate.designationApplied}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayOutlinedIcon fontSize='small' color='action' />
              <Typography variant='body1'>
                <strong>Interview Date:</strong>
                {candidate.interviewDate ? candidate.interviewDate.split('T')[0] : '-'}
              </Typography>
            </Box>
          </Box>

          {/* Interview Round 1 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
              Interview Round 1
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant='body1'>
                <strong>Status:</strong> {candidate.round1Status || 'Pending'}
              </Typography>
            </Box>
            <Box>
              <Typography variant='body1' sx={{ mb: 1 }}>
                <strong>Feedback:</strong>
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder='Enter feedback for Round 1'
                value={round1Feedback}
                onChange={e => setRound1Feedback(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
              />
              <Button variant='contained' color='primary' onClick={() => handleFeedbackSubmit('round1')} sx={{ mt: 1 }}>
                Submit Feedback
              </Button>
            </Box>
          </Box>

          {/* Interview Round 2 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
              Interview Round 2
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant='body1'>
                <strong>Status:</strong> {candidate.round2Status || 'Pending'}
              </Typography>
            </Box>
            <Box>
              <Typography variant='body1' sx={{ mb: 1 }}>
                <strong>Feedback:</strong>
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder='Enter feedback for Round 2'
                value={round2Feedback}
                onChange={e => setRound2Feedback(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
              />
              <Button variant='contained' color='primary' onClick={() => handleFeedbackSubmit('round2')} sx={{ mt: 1 }}>
                Submit Feedback
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Aptitude Test */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Aptitude Test
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant='body1'>
              <strong>Status:</strong> {candidate.aptitudeTestStatus || 'NA'}
            </Typography>
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
          </Box>
          <Button variant='outlined' component='label' startIcon={<UploadFileIcon />}>
            Upload Test Result
            <input type='file' hidden onChange={e => handleFileUpload(e, 'aptitude')} />
          </Button>
        </Box>

        {/* Pre-Offer Document Upload */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Pre-Offer Document Upload
          </Typography>
          <Button variant='outlined' component='label' startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
            Upload Document
            <input type='file' hidden onChange={e => handleFileUpload(e, 'preOffer')} />
          </Button>
          {candidate.preOfferDocuments && candidate.preOfferDocuments.length > 0 ? (
            <Box>
              <Typography variant='body1' sx={{ mb: 1 }}>
                <strong>Uploaded Documents:</strong>
              </Typography>
              {candidate.preOfferDocuments.map((doc, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant='body2'>{doc.name}</Typography>
                  <Button variant='text' startIcon={<DownloadIcon />} href={doc.url} target='_blank'>
                    Download
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant='body2' color='textSecondary'>
              No documents uploaded.
            </Typography>
          )}
        </Box>

        {/* Salary Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Salary Details
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant='body1'>
              <strong>Proposed Salary:</strong> {candidate.proposedSalary || 'Not specified'}
            </Typography>
          </Box>
          {candidate.negotiationHistory && candidate.negotiationHistory.length > 0 && (
            <Box>
              <Typography variant='body1' sx={{ mb: 1 }}>
                <strong>Negotiation History:</strong>
              </Typography>
              {candidate.negotiationHistory.map((entry, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant='body2'>
                    {entry.date}: {entry.salary} - {entry.notes}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Offer Letter Creation */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Offer Letter
          </Typography>
          {candidate.offerLetterUrl ? (
            <Button variant='outlined' startIcon={<DownloadIcon />} href={candidate.offerLetterUrl} target='_blank'>
              View/Download Offer Letter
            </Button>
          ) : (
            <Button variant='contained' color='primary' onClick={handleGenerateOfferLetter}>
              Generate Offer Letter
            </Button>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
      </Card>
    </Box>
  )
}

export default InterviewDetailedPage
