'use client'
import React from 'react'

import { useRouter, useParams } from 'next/navigation'

//import { useParams } from 'next/navigation'

import { Box, Typography, Card, CardContent, Chip, Button, Divider, Stack, Avatar } from '@mui/material'
import { styled } from '@mui/material/styles'
import DownloadIcon from '@mui/icons-material/Download'

// Sample candidate data with job descriptions (replace with actual data source in production)
const candidates = [
  {
    id: 1,
    name: 'John Doe',
    appliedPost: 'Software Engineer',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    experience: 3,
    jobPortal: 'LinkedIn',
    atsScore: 85,
    status: 'Pending',
    jobDescription:
      'Responsible for designing, developing, and maintaining software applications. Requires expertise in JavaScript, Node.js, and cloud technologies.',
    documents: {
      resume: '/documents/john_doe_resume.pdf',
      panCard: '/documents/john_doe_pan.pdf',
      paySlip: '/documents/john_doe_payslip.pdf'
    },
    profilePhoto: '/images/john_doe.jpg' // Placeholder image path
  },
  {
    id: 2,
    name: 'Jane Smith',
    appliedPost: 'Frontend Developer',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    experience: 2,
    jobPortal: 'Indeed',
    atsScore: 70,
    status: 'Shortlisted',
    jobDescription:
      'Develops user-facing features using React.js and ensures responsive design across devices. Proficiency in CSS and UX principles is essential.',
    documents: {
      resume: '/documents/jane_smith_resume.pdf',
      panCard: '/documents/jane_smith_pan.pdf',
      paySlip: '/documents/jane_smith_payslip.pdf'
    },
    profilePhoto: '/images/jane_smith.jpg'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    appliedPost: 'Backend Developer',
    email: 'michael.johnson@example.com',
    phoneNumber: '555-666-7777',
    experience: 5,
    jobPortal: 'Glassdoor',
    atsScore: 90,
    status: 'Pending',
    jobDescription:
      'Builds and maintains server-side logic using Python and Django. Focuses on database optimization and API development.',
    documents: {
      resume: '/documents/michael_johnson_resume.pdf',
      panCard: '/documents/michael_johnson_pan.pdf',
      paySlip: '/documents/michael_johnson_payslip.pdf'
    },
    profilePhoto: '/images/michael_johnson.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    appliedPost: 'UI/UX Designer',
    email: 'emily.davis@example.com',
    phoneNumber: '111-222-3333',
    experience: 4,
    jobPortal: 'Monster',
    atsScore: 60,
    status: 'Rejected',
    jobDescription:
      'Designs intuitive user interfaces and conducts user research. Skilled in Figma, Adobe XD, and prototyping.',
    documents: {
      resume: '/documents/emily_davis_resume.pdf',
      panCard: '/documents/emily_davis_pan.pdf',
      paySlip: '/documents/emily_davis_payslip.pdf'
    },
    profilePhoto: '/images/emily_davis.jpg'
  },
  {
    id: 5,
    name: 'Robert Brown',
    appliedPost: 'Data Scientist',
    email: 'robert.brown@example.com',
    phoneNumber: '444-555-6666',
    experience: 6,
    jobPortal: 'CareerBuilder',
    atsScore: 40,
    status: 'Pending',
    jobDescription: 'Analyzes large datasets to derive insights using Python, R, and machine learning techniques.',
    documents: {
      resume: '/documents/robert_brown_resume.pdf',
      panCard: '/documents/robert_brown_pan.pdf',
      paySlip: '/documents/robert_brown_payslip.pdf'
    },
    profilePhoto: '/images/robert_brown.jpg'
  },
  {
    id: 6,
    name: 'Robert Downy Jr',
    appliedPost: 'Data Analyst',
    email: 'robert.downy@example.com',
    phoneNumber: '444-999-6666',
    experience: 5,
    jobPortal: 'LinkedIn',
    atsScore: 80,
    status: 'Shortlisted',
    jobDescription:
      'Interprets data trends and creates reports using SQL, Excel, and Tableau for business decision-making.',
    documents: {
      resume: '/documents/robert_downy_jr_resume.pdf',
      panCard: '/documents/robert_downy_jr_pan.pdf',
      paySlip: '/documents/robert_downy_jr_payslip.pdf'
    },
    profilePhoto: '/images/robert_downy_jr.jpg'
  }
]

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
  const candidate = candidates.find(c => c.id === candidateId)

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
            <Avatar
              src={candidate.profilePhoto}
              alt={candidate.name}
              sx={{ width: 150, height: 150, mr: 2, border: '2px solid', borderColor: 'primary.main' }}
            />
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
