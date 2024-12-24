import React from 'react'
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
  Button
} from '@mui/material'
import { LocationOn, Work, DateRange, Person, MonetizationOn, CheckCircle } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

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
    numberOfOpenings: 5,
    branch: 'Head Office',
    city: 'Bangalore',
    stateRegion: 'Karnataka',
    country: 'India',
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
    approvals: 'Approved by HR and Technical Manager'
  }
  const router = useRouter()

  const handleBack = () => {
    router.push('/vacancy-management') // Navigates to the previous page
  }

  return (
    <Paper elevation={4} sx={{ padding: 6, margin: 'auto', borderRadius: 2 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
          {vacancy?.title}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          {vacancy?.jobType}
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Job Description */}
      <Box mb={4}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Job Description
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {vacancy?.jobDescription}
        </Typography>
      </Box>

      {/* Number of Openings */}
      <Box mb={4}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Number of Openings
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {vacancy?.numberOfOpenings}
        </Typography>
      </Box>

      {/* Job Details */}
      <Card elevation={3} sx={{ mb: 4 }}>
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
                <LocationOn fontSize='small' color='action' /> <strong>State/Region:</strong> {vacancy?.stateRegion}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <LocationOn fontSize='small' color='action' /> <strong>Country:</strong> {vacancy?.country}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Qualification */}
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
              <Chip key={index} label={skill} variant='outlined' color='primary' sx={{ fontWeight: 'bold' }} />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Salary Details */}
      <Box mb={4}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Salary Details
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {vacancy?.salaryDetails}
        </Typography>
      </Box>

      {/* Application Details */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h6' fontWeight='bold' gutterBottom>
            Application Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <DateRange fontSize='small' color='action' /> <strong>Start Date:</strong> {vacancy?.startDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <DateRange fontSize='small' color='action' /> <strong>End Date:</strong> {vacancy?.endDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <Person fontSize='small' color='action' /> <strong>Contact Person:</strong> {vacancy?.contactPerson}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <strong>Status:</strong> Open
                {/* <Chip
                  label={vacancy?.applicationStatus}
                  variant='outlined'
                  color={
                    vacancy?.applicationStatus === 'Open'
                      ? 'success'
                      : vacancy?.applicationStatus === 'Closed'
                        ? 'default'
                        : 'warning'
                  }
                /> */}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Documents Required */}
      <Box mb={4}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Documents Required
        </Typography>
        <List>
          {vacancy?.documentsRequired?.map((doc, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText primary={`• ${doc}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Interview Process */}
      <Box mb={4}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Interview Process
        </Typography>
        <Typography variant='body1'>
          <strong>Number of Rounds:</strong> {vacancy?.interviewRounds}
        </Typography>
        <List>
          {vacancy?.interviewDetails.map((round, index) => (
            <ListItem key={index} disableGutters>
              <CheckCircle fontSize='small' color='success' sx={{ mr: 1 }} />
              <ListItemText primary={round} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Approvals */}
      <Box>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Approvals
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {vacancy?.approvals}
        </Typography>
      </Box>

      {/* Back Button */}
      <Box mb={2} mt={5} display='flex' justifyContent='space-between'>
        <Button variant='outlined' onClick={handleBack}>
          Back to listing page
        </Button>
      </Box>
    </Paper>
  )
}

export default JobVacancyView
