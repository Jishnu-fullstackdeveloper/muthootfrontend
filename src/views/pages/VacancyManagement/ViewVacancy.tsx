'use client'
import React, { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import { Box, Typography, Divider, Paper, Button, Chip } from '@mui/material'

//import { LocationOn, DateRange, Person, CheckCircle, ArrowBack } from '@mui/icons-material'

//import CandidateListingTableView from './VacancyCandidateTable'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancyById } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import type { Props } from '@/types/vacancy'
import type { VacancyManagementState } from '@/types/vacancyManagement'

const tabMapping: { [key: string]: number } = {
  'vacancy-details': 0,
  'jd-details': 1
}

const JobVacancyView: React.FC<Props> = ({ vacancyTab, id }) => {
  // const router = useRouter()

  //const { id } = useParams() // Get the vacancy ID from the URL
  const params = useParams() // Get params object
  // const id = params?.editId as string | undefined // Extract id safely
  const dispatch = useAppDispatch()

  const { vacancyDetailsData, vacancyDetailsLoading, vacancyDetailsFailureMessage } = useAppSelector(
    state => state.vacancyManagementReducer
  ) as VacancyManagementState

  // const jobDetailRef = useRef<HTMLDivElement>(null)
  // const candidateListRef = useRef<HTMLDivElement>(null)

  //const [tabValue, setTabValue] = useState(0) // State for tab value
  const [activeTab, setActiveTab] = useState<number>(tabMapping[vacancyTab] || 0)

  console.log('sssssss')

  setActiveTab

  // Tab change handler
  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setActiveTab(newValue)
  //   const paths = ['vacancy-details', 'jd-details']

  //   router.push(`${paths[newValue]}?id=${id}`)
  // }

  // Fetch vacancy data when component mounts or ID changes
  useEffect(() => {
    console.log('Params:', params) // Debug full params object
    console.log('Dispatching fetchVacancyById with ID:', id)

    if (id) {
      dispatch(fetchVacancyById({ id }))
    } else {
      console.warn('No ID provided in URL')
    }
  }, [dispatch, id, params])

  console.log('Dispatching fetchVacancyById with ID:', id)

  // Log vacancyDetailsData.data changes for debugging
  useEffect(() => {
    console.log('Current vacancyDetailsData.data:', vacancyDetailsData?.data)
  }, [vacancyDetailsData?.data])

  // const handleTabChange2 = (event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue)
  // }

  // const scrollToCandidateList = () => {
  //   candidateListRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // const handleBack = () => {
  //   router.push('/vacancy-management') // Navigates to the previous page
  // }

  // Show loading or error states
  if (vacancyDetailsLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant='h6'>Loading vacancy details...</Typography>
      </Box>
    )
  }

  if (vacancyDetailsFailureMessage) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant='h6' color='error'>
          Error: {vacancyDetailsFailureMessage}
        </Typography>
        <Button variant='text' onClick={() => dispatch(fetchVacancyById({ id: id as string }))}>
          Retry
        </Button>
      </Box>
    )
  }

  if (!vacancyDetailsData?.data) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant='h6'>No vacancy data available </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Paper elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 1 }}>
        <Box mb={4} className='space-y-2'>
          {/* Tabs for Job Title and Job Details */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
              {vacancyDetailsData?.data?.jobTitle}
            </Typography>
            <Chip
              label={vacancyDetailsData.data?.status}
              size='small'
              variant='tonal'
              color={
                vacancyDetailsData.data?.status === 'Open'
                  ? 'success'
                  : vacancyDetailsData.data?.status === 'Closed'
                    ? 'error'
                    : vacancyDetailsData.data?.status === 'Freeze'
                      ? 'info'
                      : 'default'
              }
              sx={{ ml: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
            />
            {/* <Tabs value={activeTab} onChange={handleTabChange} aria-label='job tabs'>
              <Tab label='Vacancy details' />
              <Tab label='JD Details' />
            </Tabs> */}
          </Box>
          <Box>
            {activeTab === 0 && (
              <Box>
                <Box className='flex flex-row justify-between'>
                  <Box className='flex flex-row space-x-2 space-y-2'>
                    {/* <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
                      {vacancyDetailsData.data?.designation}
                    </Typography> */}
                    {/* <Typography variant='h5' color='text.secondary'>
                      Grade: {vacancyDetailsData.data?.grade}
                    </Typography> */}
                  </Box>
                  {/* <Box>
                    <Button variant="contained" onClick={scrollToCandidateList}>
                      Candidate List
                    </Button>
                  </Box> */}
                </Box>
                <Paper
                  className='mb-4 mt-2 p-5 border-primary shadow-lg rounded-lg bg-white'
                  elevation={4}
                  sx={{ margin: 'auto', borderRadius: 4 }}
                >
                  {/* Heading */}
                  <Typography variant='h6' color='text.primary' fontWeight='bold' gutterBottom>
                    Application Details
                  </Typography>

                  {/* Horizontal Divider */}
                  <Divider sx={{ mb: 3 }} />

                  {/* Grid for Details */}
                  <Box className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                    <Typography variant='body2' color='text.secondary'>
                      Designation: <strong>{vacancyDetailsData.data?.designation}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Job Role: <strong>{vacancyDetailsData.data?.jobRole}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Grade: <strong>{vacancyDetailsData.data?.grade}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Band: <strong>{vacancyDetailsData.data?.band}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Openings: <strong>{vacancyDetailsData.data?.openings}</strong>
                    </Typography>
                    {/* <Typography variant='body2' color='text.secondary'>
                      Business Role: <strong>{vacancyDetailsData.data?.businessRole}</strong>
                    </Typography> */}
                    {/* <Typography variant='body2' color='text.secondary'>
                      Experience:{' '}
                      <strong>
                        {vacancyDetailsData.data?.experienceMin} - {vacancyDetailsData.data?.experienceMax} years
                      </strong>
                    </Typography> */}
                    <Typography variant='body2' color='text.secondary'>
                      Campus/Lateral: <strong>{vacancyDetailsData.data?.campusOrLateral}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Employee Category: <strong>{vacancyDetailsData.data?.employeeCategory}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Employee Type: <strong>{vacancyDetailsData.data?.employeeType}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Hiring Manager: <strong>{vacancyDetailsData.data?.hiringManager}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Company: <strong>{vacancyDetailsData.data?.company}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Business Unit: <strong>{vacancyDetailsData.data?.businessUnit}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Department: <strong>{vacancyDetailsData.data?.department}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Starting Date: <strong>{vacancyDetailsData.data?.startingDate?.split('T')[0]}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Closing Date: <strong>{vacancyDetailsData.data?.closingDate?.split('T')[0]}</strong>
                    </Typography>
                  </Box>
                </Paper>
                {/* <Paper className='mt-4 space-x-2' elevation={4} sx={{ padding: 4, margin: 'auto', borderRadius: 1 }}>
                  <List className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                    <ListItemText
                      primary={<span className='text-green-500'>No. of openings: {vacancyDetailsData.data?.numberOfOpenings}</span>}
                    />
                    <ListItemText
                      primary={<span className='text-blue-500'>Applied: {vacancyDetailsData.data?.noOfApplicants}</span>}
                    />
                    <ListItemText
                      primary={
                        <span className='text-yellow-500'>Filled Positions: {vacancyDetailsData.data?.noOfFilledPositions}</span>
                      }
                    />
                    <ListItemText
                      primary={<span className='text-red-500'>Shortlisted: {vacancyDetailsData.data?.shortlisted}</span>}
                    />
                  </List>
                </Paper> */}
                {/* <Card elevation={3} sx={{ mb: 4, mt: 4 }}>
                  <CardContent>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Deadline
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <DateRange fontSize='small' color='action' /> <strong>Start Date:</strong>{' '}
                          {vacancyDetailsData.data?.startingDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <DateRange fontSize='small' color='action' /> <strong>End Date:</strong>{' '}
                          {vacancyDetailsData.data?.closingDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <Person fontSize='small' color='action' /> <strong>Contact Person:</strong>{' '}
                          {vacancyDetailsData.data?.contactPerson}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <strong>Status:</strong> Open
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card> */}

                <Paper
                  className='mb-4 mt-2 p-6 border-primary shadow-lg rounded-lg bg-white'
                  elevation={4}
                  sx={{ margin: 'auto', borderRadius: 4 }}
                >
                  {/* Heading */}
                  <Typography variant='h6' color='text.primary' fontWeight='bold' gutterBottom>
                    Location Details
                  </Typography>

                  {/* Horizontal Divider */}
                  <Divider sx={{ mb: 3 }} />

                  {/* Grid for Details */}
                  <Box className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                    <Typography variant='body2' color='text.secondary'>
                      Territory: <strong>{vacancyDetailsData.data?.territory}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Region: <strong>{vacancyDetailsData.data?.region}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Area: <strong>{vacancyDetailsData.data?.area}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Cluster: <strong>{vacancyDetailsData.data?.cluster}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Branch: <strong>{vacancyDetailsData.data?.branch}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Branch Code: <strong>{vacancyDetailsData.data?.branchCode}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      City: <strong>{vacancyDetailsData.data?.city}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      State: <strong>{vacancyDetailsData.data?.state}</strong>
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Origin: <strong>{vacancyDetailsData.data?.origin}</strong>
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            {/* {activeTab === 1 && (
              <Box ref={jobDetailRef}>
                <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
                  Job Details
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Job Description
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {vacancyDetailsData.data?.jobDescription || 'Not provided in API response'}
                </Typography>
                <Typography mt={2} variant='h6' fontWeight='bold' gutterBottom>
                  Role Summary
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {vacancyDetailsData.data?.roleSummary || 'Not provided in API response'}
                </Typography>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={6}>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Role Details
                    </Typography>
                    {vacancyDetailsData.data.roleDetails ? (
                      vacancyDetailsData.data.roleDetails.map((detail, index) => (
                        <Typography key={index} variant='body1' color='text.secondary'>
                          <strong>{detail.label}:</strong> {detail.value}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant='body1' color='text.secondary'>
                        Not provided in API response
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Key Skills & Attributes
                    </Typography>
                    {vacancyDetailsData.data.keySkillsAttributes ? (
                      vacancyDetailsData.data.keySkillsAttributes.map((skill, index) => (
                        <Typography key={index} variant='body1' color='text.secondary'>
                          <strong>{skill.label}:</strong> {skill.value}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant='body1' color='text.secondary'>
                        Not provided in API response
                      </Typography>
                    )}
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
                          <LocationOn fontSize='small' color='action' /> <strong>Branch:</strong>{' '}
                          {vacancyDetailsData.data?.branch}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>City:</strong> {vacancyDetailsData.data?.city}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>State/Region:</strong>{' '}
                          {vacancyDetailsData.data?.state}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          <LocationOn fontSize='small' color='action' /> <strong>Zone:</strong> {vacancyDetailsData.data?.zone}
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
                        <strong>Education:</strong>{' '}
                        {vacancyDetailsData.data?.educationalQualification || 'Not provided in API response'}
                      </Typography>
                      <Typography variant='body1'>
                        <strong>Experience:</strong> {vacancyDetailsData.data?.experienceMin} - {vacancyDetailsData.data?.experienceMax}{' '}
                        years
                      </Typography>
                      <Box mt={2}>
                        <Typography variant='body1' fontWeight='bold'>
                          Skills Needed:
                        </Typography>
                        <Stack direction='row' spacing={1} mt={1}>
                          {vacancyDetailsData.data?.skills ? (
                            vacancyDetailsData.data?.skills.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                variant='outlined'
                                color='primary'
                                sx={{ fontWeight: 'bold' }}
                              />
                            ))
                          ) : (
                            <Typography variant='body1' color='text.secondary'>
                              Not provided in API response
                            </Typography>
                          )}
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
                        {vacancyDetailsData.data?.salaryDetails || 'Not provided in API response'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box mb={4}>
                  <List>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Documents Required
                    </Typography>
                    {vacancyDetailsData.data?.documentsRequired?.map((doc, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText primary={`• ${doc}`} />
                      </ListItem>
                    )) || (
                      <Typography variant='body1' color='text.secondary'>
                        Not provided in API response
                      </Typography>
                    )}
                  </List>
                </Box>
                <Box mb={4}>
                  <List>
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Interview Process
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Number of Rounds:</strong>{' '}
                      {vacancyDetailsData.data?.interviewRounds || 'Not provided in API response'}
                    </Typography>
                    {vacancyDetailsData.data?.interviewDetails ? (
                      vacancyDetailsData.data?.interviewDetails.map((round, index) => (
                        <ListItem key={index} disableGutters>
                          <CheckCircle fontSize='small' color='success' sx={{ mr: 1 }} />
                          <ListItemText primary={round} />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant='body1' color='text.secondary'>
                        Not provided in API response
                      </Typography>
                    )}
                  </List>
                </Box>
                <Box>
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    Approvals
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    {vacancyDetailsData.data?.approvals || 'Not provided in API response'}
                  </Typography>
                </Box>
              </Box>
            )} */}
          </Box>
        </Box>
      </Paper>

      {/* Candidate Listing Table Section */}
      {/* <Paper className='mt-4 p-6' ref={candidateListRef}>
        <Typography variant='h4' color='primary' fontWeight='bold'>
          Applied Candidate Table
        </Typography>
        <Box className='mt-2'>
          <CandidateListingTableView />
        </Box>
      </Paper> */}

      {/* Back Button */}
      {/* <Box mb={2} mt={5} display='flex' justifyContent='space-between'>
        <Button startIcon={<ArrowBack />} variant='text' onClick={handleBack}>
          Back to Vacancies List
        </Button>
      </Box> */}
    </Box>
  )
}

export default JobVacancyView
