import React, { useRef, useState } from 'react'
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab
} from '@mui/material'
import { LocationOn, DateRange, Person, CheckCircle, ArrowBack } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import CandidateListingTableView from './VacancyCandidateTable'

type Props = {
  mode: any
  id: any
}

const JobVacancyView: React.FC<Props> = ({ mode, id }) => {
  const vacancy = {
    title: 'Software Engineer',
    jobType: 'Full-Time',
    jobDescription:
      'We are providing services for reviews, follows, likes for our clients social media pages as part of their company development. We seek employees for the same as part-time jobs, work-at-home options. Remunerations are calculated based on the counting of reviews, follows, or likes which you provide on the given links. Interested candidates can apply.',
    roleSummary:
      'Proven hands-on experience in leadership and full-stack development within a corporate setting. Candidates should demonstrate strong decision-making and communication skills, with proven expertise in technical design and agile project delivery.',
    roleDetails: [
      { label: 'Company Name', value: 'ABC Ltd' },
      { label: 'Reporting To', value: 'John Doe' },
      { label: 'Function/Department', value: 'Research & Development' },
      { label: 'Written By', value: 'HR Department' }
    ],
    keySkillsAttributes: [
      { label: 'Factor/Category', value: 'Technical Expertise' },
      { label: 'Competencies', value: 'Java, Spring Boot, API Integration' },
      { label: 'Definitions', value: 'Java development, Backend design' },
      { label: 'Behavioral Attributes', value: 'Adaptability, Problem-solving' }
    ],
    numberOfOpenings: 5,
    branch: 'Head Office',
    grade: 'A',
    city: 'Bangalore',
    stateRegion: 'Karnataka',
    country: 'India',
    zone: 'Bellari',
    educationalQualification: "Bachelor's Degree in Computer Science or related field",
    experience: 3,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    salaryDetails: '₹8,00,000 - ₹12,00,000 per annum',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    contactPerson: 'John Doe',
    applicationStatus: 'Open',
    documentsRequired: ['Resume', 'Cover Letter', 'Portfolio'],
    interviewRounds: 3,
    interviewDetails: ['Technical Round', 'Managerial Round', 'HR Round'],
    approvals: 'Approved by HR and Technical Manager',
    noOfFilledPositions: 3,
    noOfApplicants: 40,
    shortlisted: 21
  }

  const router = useRouter()
  const jobDetailRef = useRef<HTMLDivElement>(null)
  const candidateListRef = useRef<HTMLDivElement>(null)
  const [tabValue, setTabValue] = useState(0) // State for tab value

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // const scrollToCandidateList = () => {
  //   candidateListRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }

  const handleBack = () => {
    router.push('/vacancy-management') // Navigates to the previous page
  }

  return (
    <Box>
      <Paper elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 2 }}>
        <Box mb={4} className='space-y-2'>
          {/* Tabs for Job Title and Job Details */}
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label='job tabs'>
              <Tab label='Job Title' />
              <Tab label='Job Details' />
            </Tabs>
          </Box>
          <Box>
            {tabValue === 0 && (
              <Box>
                <Box className='flex flex-row justify-between'>
                  <Box className='flex flex-row space-x-2 space-y-2'>
                    <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
                      {vacancy?.title}
                    </Typography>
                    <Typography variant='h5' color='text.secondary'>
                      Grade: {vacancy?.grade}
                    </Typography>
                  </Box>
                  {/* <Box>
                    <Button variant="contained" onClick={scrollToCandidateList}>
                      Candidate List
                    </Button>
                  </Box> */}
                </Box>
                <Paper
                  className='grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-6 border-primary shadow-lg rounded-sm bg-white'
                  elevation={4}
                  sx={{ margin: 'auto', borderRadius: 1 }}
                >
                  <Typography variant='subtitle1' color='text.secondary'>
                    {vacancy?.jobType}
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    Experience: {vacancy?.experience}
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    Branch: {vacancy?.branch}
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    City: {vacancy?.city}
                  </Typography>
                </Paper>
                <Paper className='mt-4 space-x-2' elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 1 }}>
                  <List className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                    <ListItemText
                      primary={<span className='text-green-500'>No. of openings: {vacancy?.numberOfOpenings}</span>}
                    />
                    <ListItemText primary={<span className='text-blue-500'>Applied: {vacancy?.noOfApplicants}</span>} />
                    <ListItemText
                      primary={
                        <span className='text-yellow-500'>Filled Positions: {vacancy?.noOfFilledPositions}</span>
                      }
                    />
                    <ListItemText primary={<span className='text-red-500'>Shortlisted: {vacancy?.shortlisted}</span>} />
                  </List>
                </Paper>
                <Card elevation={3} sx={{ mb: 4, mt: 4 }}>
                  <CardContent>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Application Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <DateRange fontSize='small' color='action' /> <strong>Start Date:</strong>{' '}
                          {vacancy?.startDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <DateRange fontSize='small' color='action' /> <strong>End Date:</strong> {vacancy?.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <Person fontSize='small' color='action' /> <strong>Contact Person:</strong>{' '}
                          {vacancy?.contactPerson}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <strong>Status:</strong> Open
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
            {tabValue === 1 && (
              <Box ref={jobDetailRef}>
                <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
                  Job Details
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Job Description
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {vacancy?.jobDescription}
                </Typography>
                <Typography mt={2} variant='h6' fontWeight='bold' gutterBottom>
                  Role Summary
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {vacancy?.roleSummary}
                </Typography>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={6}>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Role Details
                    </Typography>
                    {vacancy.roleDetails.map((detail, index) => (
                      <Typography key={index} variant='body1' color='text.secondary'>
                        <strong>{detail.label}:</strong> {detail.value}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Key Skills & Attributes
                    </Typography>
                    {vacancy.keySkillsAttributes.map((skill, index) => (
                      <Typography key={index} variant='body1' color='text.secondary'>
                        <strong>{skill.label}:</strong> {skill.value}
                      </Typography>
                    ))}
                  </Grid>
                </Grid>
                <Card elevation={3} sx={{ mb: 4, mt: 4 }}>
                  <CardContent>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Job Location Details
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>Branch:</strong> {vacancy?.branch}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>City:</strong> {vacancy?.city}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>State/Region:</strong>{' '}
                          {vacancy?.stateRegion}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>Zone:</strong> {vacancy?.zone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box mb={4}>
                      <Typography variant='h6' fontWeight='bold' gutterBottom>
                        Qualification Needed
                      </Typography>
                      <Typography variant='body1'>
                        <strong>Education:</strong> {vacancy?.educationalQualification}
                      </Typography>
                      <Typography variant='body1'>
                        <strong>Experience:</strong> {vacancy?.experience} years
                      </Typography>
                      <Box mt={2}>
                        <Typography variant='body1' fontWeight='bold'>
                          Skills Needed:
                        </Typography>
                        <Stack direction='row' spacing={1} mt={1}>
                          {vacancy?.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              variant='outlined'
                              color='primary'
                              sx={{ fontWeight: 'bold' }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={4}>
                      <Typography variant='h6' fontWeight='bold' gutterBottom>
                        Salary Details
                      </Typography>
                      <Typography variant='body1' color='text.secondary'>
                        {vacancy?.salaryDetails}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box mb={4}>
                  <List>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Documents Required
                    </Typography>
                    {vacancy?.documentsRequired?.map((doc, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText primary={`• ${doc}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box mb={4}>
                  <List>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Interview Process
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Number of Rounds:</strong> {vacancy?.interviewRounds}
                    </Typography>
                    {vacancy?.interviewDetails.map((round, index) => (
                      <ListItem key={index} disableGutters>
                        <CheckCircle fontSize='small' color='success' sx={{ mr: 1 }} />
                        <ListItemText primary={round} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    Approvals
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    {vacancy?.approvals}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Candidate Listing Table Section */}
      <Paper className='mt-4 p-6' ref={candidateListRef}>
        <Typography variant='h4' color='primary' fontWeight='bold'>
          Applied Candidate Table
        </Typography>
        <Box className='mt-2'>
          <CandidateListingTableView />
        </Box>
      </Paper>

      {/* Back Button */}
      <Box mb={2} mt={5} display='flex' justifyContent='space-between'>
        <Button startIcon={<ArrowBack />} variant='text' onClick={handleBack}>
          Back to Vacancies List
        </Button>
      </Box>
    </Box>
  )
}

export default JobVacancyView
