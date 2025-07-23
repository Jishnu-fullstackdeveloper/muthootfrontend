'use client'
import React, { useState } from 'react'

import {
  Box,
  Typography,
  Card,
  Stack,
  Grid,
  Avatar,
  Link,
  useTheme,
  useMediaQuery,
  Tooltip,
  CardContent,
  TextField,
  MenuItem,
  Autocomplete,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import dayjs, { Dayjs } from 'dayjs'

import Rating from '@mui/material/Rating'
import DeleteIcon from '@mui/icons-material/Delete'

import resumeIcon from '@/assets/images/resume_icon_cut.png'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const CandidateOverview = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedJob, setSelectedJob] = useState('ab9247f9-0d8a-4e53-80da-5f1f57065dc0')
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [ratings, setRatings] = useState([])
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null)

  const interviewers = [
    {
      name: 'Nathan Reed',
      role: 'Software Engineer',
      avatar:
        'https://img.freepik.com/free-photo/portrait-delighted-hipster-male-student-with-crisp-hair_176532-8157.jpg?semt=ais_hybrid&w=740'
    },
    {
      name: 'Chloe Harper',
      role: 'Product Manager',
      avatar:
        'https://static.vecteezy.com/system/resources/thumbnails/054/007/118/small/a-young-man-with-a-backpack-and-plaid-shirt-photo.jpg'
    },
    {
      name: 'Oliver Bennett',
      role: 'UX Designer',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/054/007/048/non_2x/asian-young-man-with-backpack-and-white-shirt-photo.jpg'
    }
  ]

  const candidates = [
    {
      name: 'Emily Carter',
      appliedFor: 'Software Engineer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Noah Thompson',
      appliedFor: 'Product Manager',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      name: 'Isabella Scott',
      appliedFor: 'UX Designer',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/054/007/048/non_2x/asian-young-man-with-backpack-and-white-shirt-photo.jpg'
    }
  ]

  const appliedJobs = [
    {
      id: 'ab9247f9-0d8a-4e53-80da-5f1f57065dc0',
      deletedBy: null,
      jobRole: 'Software Engineer',
      jobTitle: 'Frontend Developer',
      grade: 'G5',
      designation: 'GOLD INSPECTOR',
      department: 'Engineering'
    },
    {
      id: '123',
      jobRole: 'Product Manager',
      designation: 'Product Lead',
      jobTitle: 'Product Management'
    },
    {
      id: '456',
      jobRole: 'UI/UX Designer',
      designation: 'Senior Designer',
      jobTitle: 'Design and User Experience'
    },
    {
      id: '789',
      jobRole: 'DevOps Engineer',
      designation: 'DevOps Specialist',
      jobTitle: 'Infrastructure and Operations'
    },
    {
      id: '112',
      jobRole: 'QA Analyst',
      designation: 'Quality Assurance Lead',
      jobTitle: 'Quality Assurance and Testing'
    }
  ]

  const feedbackData = [
    {
      name: 'Nathan Reed',
      date: 'July 16, 2024',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      designation: 'L1 Manager',
      ratings: [
        { skill: 'Technical Skills', value: 3.5 },
        { skill: 'Communication', value: 4 },
        { skill: 'Problem Solving', value: 3 }
      ],
      comment:
        'Emily demonstrated strong technical skills and a good understanding of software engineering principles. Her experience aligns well with the requirements of the role.'
    },
    {
      name: 'Chloe Harper',
      date: 'July 16, 2024',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      designation: 'L2 Manager',
      ratings: [
        { skill: 'Technical Skills', value: 4 },
        { skill: 'Communication', value: 4.5 },
        { skill: 'Team Fit', value: 4 }
      ],
      comment:
        'Emily is an excellent candidate with a strong background and impressive skills. She is highly recommended for the Software Engineer position.'
    }
  ]

  const skillOptions = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL', 'Java', 'AWS', 'Docker']

  const handleAddSkill = (skill: string | null) => {
    if (skill && !ratings.find(s => s.skill.toLowerCase() === skill.toLowerCase())) {
      setRatings(prev => [...prev, { skill, rating: 0 }])
      setSelectedSkill(null)
    }
  }

  const handleRatingChange = (skill: string, value: number | null) => {
    setRatings(prev => prev.map(s => (s.skill === skill ? { ...s, rating: value ?? 0 } : s)))
  }

  const handleRemoveSkill = (skill: string) => {
    setRatings(prev => prev.filter(s => s.skill !== skill))
  }

  const PersonRow = ({ name, sub, avatar }: { name: string; sub: string; avatar: string }) => (
    <Box display='flex' alignItems='center' mb={2}>
      <Avatar src={avatar} alt={name} sx={{ width: 40, height: 40, mr: 2 }} />
      <Box>
        <Typography fontWeight={600}>{name}</Typography>
        <Typography variant='body2' color='text.secondary'>
          {sub}
        </Typography>
      </Box>
    </Box>
  )

  const handleReschedule = () => {
    // Add form submission logic here
    console.log('Rescheduled to:', selectedDate, selectedTime)
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Main Content */}
      <Grid container spacing={1}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} md={8} pr={isSmallScreen ? 0 : 3}>
          {/* Header: Candidate Info */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 1,
              p: isSmallScreen ? 2 : 3,
              mb: isSmallScreen ? 2 : 3
            }}
          >
            <Box display='flex' alignItems='center' gap={2}>
              <Avatar
                src='https://www.shutterstock.com/image-photo/headshot-close-face-portrait-young-600nw-2510015507.jpg'
                alt='Emily Carter'
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  Emily Carter
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Applied for Multple Positions
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <TextField
                select
                fullWidth
                label='Job Applied by Emily Carter'
                value={selectedJob}
                onChange={e => setSelectedJob(e.target.value)}
                variant='outlined'
                margin='normal'
                size='small'
              >
                {appliedJobs.map((job, index) => (
                  <MenuItem key={index} value={job?.id}>
                    {job?.jobRole}
                    {job?.jobTitle && ', ' + job?.jobTitle}
                    {job?.grade && ', ' + job?.grade}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Main Card Sections */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: isSmallScreen ? 2 : 3 }}>
            {/* Applied Job Details Card */}
            <Card variant='outlined' sx={{ p: isSmallScreen ? 2 : 3 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#3e3636', mb: 2 }}>
                Applied Job Details
              </Typography>

              <Stack direction='column' spacing={1}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* jobRole: 'QA Analyst',
                      designation: 'Quality Assurance Lead',
                      jobTitle: 'Quality Assurance and Testing' */}

                  <Typography variant='body2' color='text.secondary'>
                    Job Role
                  </Typography>
                  <Typography variant='body1'>
                    {appliedJobs?.find(job => job.id === selectedJob)?.jobRole || 'N/A'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Designation
                  </Typography>
                  <Typography variant='body1'>
                    {appliedJobs?.find(job => job.id === selectedJob)?.designation || 'N/A'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Job Title
                  </Typography>
                  <Typography variant='body1' sx={{ color: 'green', fontWeight: 'bold' }}>
                    <Typography variant='body1'>
                      {appliedJobs?.find(job => job.id === selectedJob)?.jobTitle || 'N/A'}
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            </Card>
            {/* Resume Info Card */}
            <Card variant='outlined' sx={{ p: isSmallScreen ? 2 : 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Emily Carter&apos;s Resume
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Software Engineer
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#3e3636' }}>
                      Screening Results
                    </Typography>

                    <Stack direction='column' spacing={1} sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Resume Score
                        </Typography>
                        <Typography variant='body1'>85/100</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Skill Match
                        </Typography>
                        <Typography variant='body1'>90%</Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderRadius: 1,
                          mt: 2
                        }}
                      >
                        <Typography variant='body2' color='text.secondary'>
                          Status
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#DFF5E1',
                            color: '#1B5E20',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}
                        >
                          ✔ Selected
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                <Tooltip title='View Resume' placement='top'>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      display: 'flex',
                      justifyContent: isSmallScreen ? 'center' : 'flex-end',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        width: 120, // ✅ Set width here
                        backgroundColor: '#d6d1d1',
                        borderRadius: 2,
                        cursor: 'pointer'
                      }}
                    >
                      <Box
                        component='img'
                        src={resumeIcon.src}
                        alt='Resume'
                        sx={{
                          width: '100%', // ✅ Fill the container width (160px)
                          height: 'auto',
                          padding: 5,
                          borderRadius: 2,
                          boxShadow: 3
                        }}
                      />
                    </Box>
                  </Grid>
                </Tooltip>
              </Grid>
            </Card>

            {/* Interview Details Card */}
            <Card variant='outlined' sx={{ p: isSmallScreen ? 2 : 3 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#3e3636', mb: 2 }}>
                Interview Details
              </Typography>

              <Stack direction='column' spacing={1}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Interview Level
                  </Typography>
                  <Typography variant='body1'>L1</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Scheduled Time
                  </Typography>
                  <Typography variant='body1'>July 15, 2025, 10:00 AM - 11:00 AM</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Teams Interview Link
                  </Typography>
                  <Typography variant='body1' sx={{ color: 'green', fontWeight: 'bold' }}>
                    <Link href='' target='_blank' rel='noopener noreferrer' sx={{ textDecoration: 'none' }}>
                      Link (Message Sent)
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Additional Information Card */}
            <Card variant='outlined' sx={{ p: isSmallScreen ? 2 : 3 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#3e3636', mb: 2 }}>
                Additional Information
              </Typography>

              <Stack direction='column' spacing={1}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Expected Salary
                  </Typography>
                  <Typography variant='body1'>$12000</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Whatsapp
                  </Typography>
                  <Typography variant='body1' sx={{ color: 'green', fontWeight: 'bold' }}>
                    <Link href='' target='_blank' rel='noopener noreferrer' sx={{ textDecoration: 'none' }}>
                      Contact Details
                    </Link>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Email
                  </Typography>
                  <Typography variant='body1'>emily.carter@gmail.com</Typography>
                </Box>
              </Stack>
            </Card>

            {/* Interviewer's Feedback section */}
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant='h6' fontWeight='bold' mb={2}>
                  Interview Feedback
                </Typography>

                {feedbackData.map((feedback, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${index}`}
                      id={`panel-${index}`}
                    >
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar src={feedback.avatar} alt={feedback.name} sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Typography fontWeight='medium'>{feedback.name}</Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {feedback.designation} • Submitted on {feedback.date}
                          </Typography>
                        </Box>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display='flex' flexDirection='column' gap={1} mb={2}>
                        {feedback.ratings.map((rating, i) => (
                          <Box key={i} display='flex' alignItems='center' gap={2}>
                            <Typography variant='body2' sx={{ minWidth: 150 }}>
                              {rating.skill}
                            </Typography>
                            <Rating value={rating.value} precision={0.5} readOnly />
                          </Box>
                        ))}
                      </Box>
                      <Typography variant='h6' mt={4} sx={{ color: '#131313 !important' }}>
                        Comments
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: '#F9F9F9',
                          border: '1px solid #E0E0E0',
                          borderRadius: 1,
                          padding: 2,
                          mt: 1,
                          color: '#333'
                        }}
                      >
                        <Typography variant='body2'>{feedback.comment}</Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}

                {/* Feedback Submission */}
                <Box mt={4}>
                  <Typography variant='h6' fontWeight='bold' mb={2}>
                    Submit Your Feedback
                  </Typography>

                  <TextField
                    id='feedback'
                    name='feedback'
                    placeholder="We'd love to hear your thoughts..."
                    multiline
                    rows={5}
                    fullWidth
                    variant='outlined'
                    sx={{ mb: 2 }}
                  />

                  <Box display='flex' justifyContent='flex-end'>
                    <Button variant='contained' color='primary'>
                      Submit
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: isSmallScreen ? 2 : 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isSmallScreen ? 2 : 3 }}>
              <Box
                sx={{
                  p: 2,
                  width: 360,
                  fontFamily: 'sans-serif'
                }}
              >
                <Typography variant='h6' fontWeight={600} mb={2}>
                  Interview Scheduling
                </Typography>

                <Typography variant='subtitle2' fontWeight={500} mb={1}>
                  Interviewers
                </Typography>
                {interviewers.map(person => (
                  <PersonRow key={person.name} name={person.name} sub={person.role} avatar={person.avatar} />
                ))}

                <Typography variant='subtitle2' fontWeight={500} mt={5} mb={1}>
                  Candidates
                </Typography>
                {candidates.map(person => (
                  <PersonRow
                    key={person.name}
                    name={person.name}
                    sub={`Applied for ${person.appliedFor}`}
                    avatar={person.avatar}
                  />
                ))}
              </Box>

              {/* Communication Leg */}
              <Box sx={{ mt: 4 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Communication Log
                </Typography>

                <Card variant='outlined' sx={{ mb: 2, bgcolor: 'white', borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant='subtitle1' fontWeight='bold' color='#454545' gutterBottom>
                      WhatsApp
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1.5 }}>
                      Hi Emily, we&apos;re excited to schedule your interview. Please let us know your availability.
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Sent: July 14, 2024, 2:30 PM
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant='outlined' sx={{ mt: 2, bgcolor: 'white', borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant='subtitle1' fontWeight='bold' color='#454545' gutterBottom>
                      Email
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1.5 }}>
                      Dear Emily, thank you for applying. We’d like to invite you for an interview.
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Sent: July 14, 2024, 2:30 PM
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
                  <Autocomplete
                    id='disable-close-on-select'
                    options={skillOptions}
                    value={selectedSkill}
                    disableCloseOnSelect
                    onChange={(event, newValue) => handleAddSkill(newValue)}
                    renderInput={params => <TextField {...params} label='Apply Skill Rating' variant='outlined' />}
                    sx={{ mb: 3 }}
                  />

                  {/* Scrollable Skill Rating Section */}
                  <Box
                    sx={{
                      maxHeight: 250, // Adjust height as needed
                      overflowY: 'auto',
                      pr: 1 // Add padding for scrollbar
                    }}
                    className='custom-scrollbar'
                  >
                    {ratings.map(({ skill, rating }) => (
                      <Box
                        key={skill}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                          p: 2,
                          border: '1px solid #ccc',
                          borderRadius: 2,
                          backgroundColor: '#fafafa'
                        }}
                      >
                        <Typography sx={{ width: 100 }}>{skill}</Typography>
                        <Rating
                          name={`rating-${skill}`}
                          precision={0.5}
                          value={rating}
                          onChange={(_, newValue) => handleRatingChange(skill, newValue)}
                        />
                        <IconButton onClick={() => handleRemoveSkill(skill)} size='small' sx={{ ml: 2 }}>
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <div className='bg-white p-3 rounded-xl shadow-md max-w-md mx-auto mt-6'>
                  <Typography variant='h6' className='mb-4 font-semibold text-gray-800'>
                    Reschedule Interview
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='flex flex-col gap-4'>
                      <DatePicker
                        label='Select New Date'
                        value={selectedDate}
                        onChange={newValue => setSelectedDate(newValue)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />

                      <TimePicker
                        label='Select New Time'
                        value={selectedTime}
                        onChange={newValue => setSelectedTime(newValue)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </div>
                  </LocalizationProvider>

                  <div className='pt-3 pb-4'>
                    <TextField
                      label='Reason for Rescheduling'
                      id='feedback'
                      name='feedback'
                      placeholder='Put you reason here...'
                      multiline
                      rows={3}
                      fullWidth
                      variant='outlined'
                    />
                  </div>

                  <div className='flex justify-end mt-2'>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleReschedule}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Reschedule
                    </Button>
                  </div>
                </div>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CandidateOverview
