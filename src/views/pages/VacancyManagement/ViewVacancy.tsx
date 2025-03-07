import React, { useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

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

import CandidateListingTableView from './VacancyCandidateTable'
import { viewVacancy } from '@/utils/sampleData/VacancyManagement/ViewVacancyData'
import type { Props } from '@/types/vacancy'

const JobVacancyView: React.FC<Props> = () => {
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
                      {viewVacancy?.title}
                    </Typography>
                    <Typography variant='h5' color='text.secondary'>
                      Grade: {viewVacancy?.grade}
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
                    {viewVacancy?.jobType}
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    Experience: {viewVacancy?.experience}
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    Branch: {viewVacancy?.branch}
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    City: {viewVacancy?.city}
                  </Typography>
                </Paper>
                <Paper className='mt-4 space-x-2' elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 1 }}>
                  <List className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                    <ListItemText
                      primary={<span className='text-green-500'>No. of openings: {viewVacancy?.numberOfOpenings}</span>}
                    />
                    <ListItemText
                      primary={<span className='text-blue-500'>Applied: {viewVacancy?.noOfApplicants}</span>}
                    />
                    <ListItemText
                      primary={
                        <span className='text-yellow-500'>Filled Positions: {viewVacancy?.noOfFilledPositions}</span>
                      }
                    />
                    <ListItemText
                      primary={<span className='text-red-500'>Shortlisted: {viewVacancy?.shortlisted}</span>}
                    />
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
                          {viewVacancy?.startDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <DateRange fontSize='small' color='action' /> <strong>End Date:</strong>{' '}
                          {viewVacancy?.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <Person fontSize='small' color='action' /> <strong>Contact Person:</strong>{' '}
                          {viewVacancy?.contactPerson}
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
                  {viewVacancy?.jobDescription}
                </Typography>
                <Typography mt={2} variant='h6' fontWeight='bold' gutterBottom>
                  Role Summary
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {viewVacancy?.roleSummary}
                </Typography>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={6}>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Role Details
                    </Typography>
                    {viewVacancy.roleDetails.map((detail, index) => (
                      <Typography key={index} variant='body1' color='text.secondary'>
                        <strong>{detail.label}:</strong> {detail.value}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Key Skills & Attributes
                    </Typography>
                    {viewVacancy.keySkillsAttributes.map((skill, index) => (
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
                          <LocationOn fontSize='small' color='action' /> <strong>Branch:</strong> {viewVacancy?.branch}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>City:</strong> {viewVacancy?.city}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>State/Region:</strong>{' '}
                          {viewVacancy?.stateRegion}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>Zone:</strong> {viewVacancy?.zone}
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
                        <strong>Education:</strong> {viewVacancy?.educationalQualification}
                      </Typography>
                      <Typography variant='body1'>
                        <strong>Experience:</strong> {viewVacancy?.experience} years
                      </Typography>
                      <Box mt={2}>
                        <Typography variant='body1' fontWeight='bold'>
                          Skills Needed:
                        </Typography>
                        <Stack direction='row' spacing={1} mt={1}>
                          {viewVacancy?.skills.map((skill, index) => (
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
                        {viewVacancy?.salaryDetails}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box mb={4}>
                  <List>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Documents Required
                    </Typography>
                    {viewVacancy?.documentsRequired?.map((doc, index) => (
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
                      <strong>Number of Rounds:</strong> {viewVacancy?.interviewRounds}
                    </Typography>
                    {viewVacancy?.interviewDetails.map((round, index) => (
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
                    {viewVacancy?.approvals}
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
