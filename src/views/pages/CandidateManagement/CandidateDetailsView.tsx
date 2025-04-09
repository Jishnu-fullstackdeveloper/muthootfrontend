'use client'
import React from 'react'

import { useRouter, useParams } from 'next/navigation'

//import { useParams } from 'next/navigation'

import { Box, Typography, Card, CardContent, Chip, Button, Divider, Stack, Avatar } from '@mui/material'
import { styled } from '@mui/material/styles'
import DownloadIcon from '@mui/icons-material/Download'

// Sample candidate data with job descriptions (replace with actual data source in production)
import { candidateDetails } from '@/utils/sampleData/CandidateManagement/CandidateDetailsData'

// Styled component for document buttons
const DocumentButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[300]
  }
}))

const CandidateDetails = () => {
  const router = useRouter()
  const { id } = useParams()

  const candidateId = Number(id)
  const candidate = candidateDetails.find(c => c.id === candidateId)

  const handleDownload = (url: string, fileName: string) => {
    console.log(`Downloading ${fileName} from ${url}`)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!candidate) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='h6' color='error' gutterBottom>
          Candidate Not Found
        </Typography>
        <Button variant='contained' onClick={() => router.push('/candidate-management')}>
          Back to List
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {/* Header with Profile Photo and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }} justifyContent={'space-between'}>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              {candidate.name}
            </Typography>
            {/* <Avatar
              src={candidate.profilePhoto}
              alt={candidate.name}
              sx={{ width: 150, height: 150, mr: 2, border: '2px solid', borderColor: 'primary.main' }}
            /> */}
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Candidate Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant='body1'>
                <strong>Applied Post:</strong> {candidate.appliedPost}
              </Typography>
              <Typography variant='body1'>
                <strong>Email:</strong> {candidate.email}
              </Typography>
              <Typography variant='body1'>
                <strong>Phone Number:</strong> {candidate.phoneNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant='body1'>
                <strong>Experience:</strong> {candidate.experience} years
              </Typography>
              <Typography variant='body1'>
                <strong>Job Portal:</strong> {candidate.jobPortal}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant='body1'>
                  <strong>ATS Score:</strong>
                </Typography>
                <Chip
                  label={`${candidate.atsScore}%`}
                  color={candidate.atsScore > 75 ? 'success' : candidate.atsScore > 50 ? 'warning' : 'error'}
                  size='small'
                  sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant='body1'>
                  <strong>Status:</strong>
                </Typography>
                <Chip
                  label={candidate.status}
                  color={
                    candidate.status === 'Shortlisted'
                      ? 'success'
                      : candidate.status === 'Rejected'
                        ? 'error'
                        : 'warning'
                  }
                  size='small'
                  sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                />
              </Box>
            </Box>
          </Box>

          {/* Job Description */}
          <Divider sx={{ my: 3 }} />
          <Typography variant='h6' sx={{ fontWeight: 'medium', mb: 1 }}>
            Job Description
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {candidate.jobDescription}
          </Typography>

          {/* Documents Section */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ fontWeight: 'medium' }}>
              Documents
            </Typography>
            <Stack direction='row' spacing={1}>
              <DocumentButton
                variant='contained'
                size='small'
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(candidate.documents.resume, `${candidate.name}_resume.pdf`)}
              >
                Resume
              </DocumentButton>
              <DocumentButton
                variant='contained'
                size='small'
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(candidate.documents.panCard, `${candidate.name}_pan_card.pdf`)}
              >
                Pan Card
              </DocumentButton>
              <DocumentButton
                variant='contained'
                size='small'
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(candidate.documents.paySlip, `${candidate.name}_pay_slip.pdf`)}
              >
                Pay Slip
              </DocumentButton>
            </Stack>
          </Box>

          {/* Back Button */}
          <Box sx={{ mt: 4 }}>
            <Button
              variant='outlined'
              size='small'
              color='primary'
              onClick={() => router.push('/candidate-management')}
            >
              Back to List
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CandidateDetails
