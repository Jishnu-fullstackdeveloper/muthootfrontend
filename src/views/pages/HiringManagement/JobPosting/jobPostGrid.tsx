'use client'

import React from 'react' // { useState }

import { useRouter } from 'next/navigation'

import { Box, Card, CardContent, Grid, Typography, Button, CircularProgress } from '@mui/material' //Drawer, IconButton
import { Business as BusinessIcon } from '@mui/icons-material' // Close as CloseIcon
import { styled } from '@mui/material/styles'

interface JobPosting {
  id: string
  designation: string
  jobRole: string
  location: string
  status: 'Pending' | 'Posted' | 'Closed'
  openings: number
  jobGrade: string
  postedDate: string
  department?: string
  manager?: string
  employeeCategory?: string
  branch?: string
  attachments?: string[]
  businessUnit?: string
  branchBusiness?: string
  zone?: string
  area?: string
  state?: string
  band?: string
  date?: string
}

interface JobPostGridProps {
  data: JobPosting[]
  loading: boolean
  page: number
  totalCount: number
  onLoadMore: (newPage: number) => void
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  gap: '16px',
  width: '370.67px', // Adjusted to match HeaderWrapper width
  height: '264px',
  background: '#fff',
  boxShadow: '0px 6.84894px 12.1759px rgba(208, 210, 218, 0.15)',
  borderRadius: '14px',
  fontFamily: "'Public Sans', 'Roboto', sans-serif"
}))

const HeaderWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 0 16px',
  gap: '8px',
  width: '326.67px',
  borderBottom: '1px solid #eee',
  height: '64px'
})

const IconFrame = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '8px',
  width: '167px',
  height: '48px'
})

const IconWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '48px',
  height: '48px',
  background: '#F2F3FF',
  borderRadius: '100px'
})

const DataWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '4px',
  width: '111px',
  height: '39px'
})

const StatusBadge = styled(Typography)(({}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '7px 18px',
  width: '91px',
  height: '28px',
  background: 'rgba(237, 159, 11, 0.2)',
  border: '1px solid #eee',
  borderRadius: '6px',
  fontFamily: "'Public Sans', 'Roboto', sans-serif",
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '14px',
  textTransform: 'uppercase'
}))

const statusColors: Record<string, string> = {
  Pending: '#ED960B',

  // Posted: '#FFA500',
  CREATED: '#1E90FF',
  Closed: '#FF4500',
  Posted: '#90EE90'
}

const Row = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '0px',
  width: '420px',
  height: '38px'
})

const Col = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '8px',
  width: '250px',
  height: '38px'
})

const ViewDetailsButton = styled(Button)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 20px',
  width: '326.67px',
  height: '36px',
  border: '1px solid #0096DA',
  borderRadius: '8px',
  fontFamily: "'Public Sans', 'Roboto', sans-serif",
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '16px',
  color: '#0096DA',
  textTransform: 'none',
  '&:hover': {
    border: '1px solid #007BB8',
    background: 'rgba(0, 150, 218, 0.05)'
  }
})

// interface DrawerContentProps {
//   status: 'Pending' | 'Posted' | 'Closed'
// }

// const DrawerContent = styled(Box, {
//   shouldForwardProp: prop => prop !== 'status'
// })<DrawerContentProps>(({ status }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'flex-start',
//   padding: 0,
//   width: '560px',
//   height: '1038px',
//   background: '#FFFFFF',
//   borderRadius: '8px',
//   position: 'absolute',
//   right: 0,
//   top: 0,
//   '& > div:first-child': {
//     boxSizing: 'border-box',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '20px',
//     gap: '351px',
//     width: '560px',
//     height: '64px',
//     borderBottom: '1px solid #EEEEEE',
//     '& h6': {
//       width: '103px',
//       height: '24px',
//       fontFamily: "'Public Sans', 'Roboto', sans-serif",
//       fontStyle: 'normal',
//       fontWeight: 600,
//       fontSize: '20px',
//       lineHeight: '24px',
//       color: '#23262F'
//     },
//     '& button': {
//       width: '24px',
//       height: '24px'
//     }
//   },
//   '& > div:nth-child(2)': {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     padding: '20px',
//     gap: '16px',
//     width: '560px',
//     height: '698px',
//     overflowY: 'auto', // Enable scrolling for the body
//     '& > div:first-child': {
//       boxSizing: 'border-box',
//       display: 'flex',
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '0px 0px 16px',
//       gap: '8px',
//       width: '520px',
//       height: '64px',
//       borderBottom: '1px solid #EEEEEE',
//       '& > div:first-child': {
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: '0px',
//         gap: '8px',
//         width: '167px',
//         height: '48px',
//         '& > div:first-child': {
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           padding: '0px',
//           gap: '10px',
//           width: '48px',
//           height: '48px',
//           background: '#F2F3FF',
//           borderRadius: '100px',
//           '& svg': {
//             width: '24px',
//             height: '24px',
//             color: '#3D459E'
//           }
//         },
//         '& > div:nth-child(2)': {
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//           padding: '0px',
//           gap: '4px',
//           width: '111px',
//           height: '39px',
//           '& > p:first-child': {
//             width: '111px',
//             height: '19px',
//             fontFamily: "'Public Sans', 'Roboto', sans-serif",
//             fontStyle: 'normal',
//             fontWeight: 600,
//             fontSize: '16px',
//             lineHeight: '19px',
//             color: '#23262F'
//           },
//           '& > p:nth-child(2)': {
//             width: '111px',
//             height: '16px',
//             fontFamily: "'Public Sans', 'Roboto', sans-serif",
//             fontStyle: 'normal',
//             fontWeight: 400,
//             fontSize: '12px',
//             lineHeight: '16px',
//             color: '#23262F'
//           }
//         }
//       },
//       '& > div:nth-child(2)': {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '7px 18px',
//         gap: '10px',
//         width: '91px',
//         height: '28px',
//         background: 'rgba(237, 150, 11, 0.2)',
//         border: '1px solid #EEEEEE',
//         borderRadius: '6px',
//         '& > span': {
//           fontFamily: "'Public Sans', 'Roboto', sans-serif",
//           fontStyle: 'normal',
//           fontWeight: 500,
//           fontSize: '12px',
//           lineHeight: '14px',
//           color: statusColors[status] || '#000'
//         }
//       }
//     },
//     '& > div:nth-child(2)': {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'flex-start',
//       padding: '0px',
//       gap: '16px',
//       width: '520px',
//       height: 'auto' // Allow dynamic height with scrolling
//     }
//   }
// }))

const dummyJobs: JobPosting[] = [
  {
    id: '1',
    designation: 'Senior Customer Service Executive',
    jobRole: 'Manager',
    location: 'TVM, India',
    status: 'Pending',
    openings: 2,
    jobGrade: 'JM2-60',
    postedDate: '12-08-2024',
    department: 'Customer Service',
    manager: 'Manager or Lateral',
    employeeCategory: 'Employee Type',
    branch: 'Permanent',
    attachments: ['www.google.com', 'www.example.com'],
    businessUnit: 'XCC',
    branchBusiness: 'Territory',
    zone: 'Kerala South',
    area: 'Mangalore',
    state: 'Kerala'
  },
  {
    id: '2',
    designation: 'Product Manager',
    jobRole: 'Technical PM',
    location: 'New York, NY',
    status: 'Pending',
    openings: 2,
    jobGrade: 'JM2-60',
    postedDate: '10-08-2024',
    department: 'Product Development',
    manager: 'John Doe',
    employeeCategory: 'Full-time',
    branch: 'Head Office',
    attachments: ['www.report.pdf'],
    businessUnit: 'Tech Division',
    branchBusiness: 'North America',
    zone: 'East Coast',
    area: 'NY Metro',
    state: 'New York'
  },
  {
    id: '3',
    designation: 'UX Designer',
    jobRole: 'UI/UX Specialist',
    location: 'Remote',
    status: 'Pending',
    openings: 1,
    jobGrade: 'JM2-60',
    postedDate: '08-08-2024',
    department: 'Design',
    manager: 'Jane Smith',
    employeeCategory: 'Contract',
    branch: 'Remote Team',
    attachments: ['www.design.doc'],
    businessUnit: 'Creative Unit',
    branchBusiness: 'Global',
    zone: 'Online',
    area: 'Virtual',
    state: 'N/A'
  },
  {
    id: '4',
    designation: 'Data Scientist',
    jobRole: 'ML Engineer',
    location: 'Boston, MA',
    status: 'Closed',
    openings: 2,
    jobGrade: 'JM2-60',
    postedDate: '05-08-2024',
    department: 'Data Science',
    manager: 'Alex Brown',
    employeeCategory: 'Full-time',
    branch: 'Research Center',
    attachments: ['www.data.xlsx', 'www.model.pdf'],
    businessUnit: 'Analytics',
    branchBusiness: 'East Region',
    zone: 'New England',
    area: 'Boston Area',
    state: 'Massachusetts'
  },
  {
    id: '5',
    designation: 'Software Engineer',
    jobRole: 'Backend Developer',
    location: 'San Francisco, CA',
    status: 'Posted',
    openings: 3,
    jobGrade: 'JM2-60',
    postedDate: '03-08-2024',
    department: 'Engineering',
    manager: 'Sarah Lee',
    employeeCategory: 'Full-time',
    branch: 'Main Office',
    attachments: ['www.code.zip'],
    businessUnit: 'DevOps',
    branchBusiness: 'West Coast',
    zone: 'California',
    area: 'Bay Area',
    state: 'California'
  }
]

const JobPostGrid = ({ data = dummyJobs, loading }: JobPostGridProps) => {
  const router = useRouter()

  // const [drawerOpen, setDrawerOpen] = useState(false)
  // const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)

  // const handleView = (job: JobPosting) => {
  //   setSelectedJob(job)
  //   setDrawerOpen(true)
  // }

  const handleCloseDrawer = () => {
    // setDrawerOpen(false)
    // setSelectedJob(null)
  }

  const handleNavigate = (jobId: string) => {
    router.push(`/hiring-management/job-posting/view/${jobId}`)
    handleCloseDrawer()
  }

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {data.map(job => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <StyledCard>
              <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <HeaderWrapper>
                  <IconFrame>
                    <IconWrapper>
                      <BusinessIcon sx={{ width: '24px', height: '24px', color: '#3D459E' }} />
                    </IconWrapper>
                    <DataWrapper>
                      <Typography
                        sx={{
                          fontFamily: "'Public Sans', 'Roboto', sans-serif",
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '19px',
                          color: '#23262F',
                          width: '111px'
                        }}
                      >
                        {job.designation}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Public Sans', 'Roboto', sans-serif",
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: '#23262F',
                          width: '111px'
                        }}
                      >
                        Internal job posting
                      </Typography>
                    </DataWrapper>
                  </IconFrame>
                  <StatusBadge sx={{ color: statusColors[job.status] || '#000' }}>{job.status}</StatusBadge>
                </HeaderWrapper>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Band
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {job.band}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Posted
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {new Date(job.date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Openings
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {job.openings}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Area
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {job.location}
                    </Typography>
                  </Col>
                </Row>
                {/* <ViewDetailsButton onClick={() => handleView(job)} aria-label={`View details for ${job.designation}`}> */}
                <ViewDetailsButton
                  onClick={() => handleNavigate(job.id)}
                  aria-label={`View details for ${job.designation}`}
                >
                  View Details
                </ViewDetailsButton>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {/* <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: '576px', height: '1054px', position: 'absolute', right: 0, top: 0 } }}
      >
        {selectedJob && (
          <DrawerContent status={selectedJob.status}>
            <Box>
              <Typography variant='h6'>Job Details</Typography>
              <IconButton onClick={handleCloseDrawer} aria-label='Close drawer'>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <HeaderWrapper>
                <IconFrame>
                  <IconWrapper>
                    <BusinessIcon sx={{ width: '24px', height: '24px', color: '#3D459E' }} />
                  </IconWrapper>
                  <DataWrapper>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '19px',
                        color: '#23262F',
                        width: '111px'
                      }}
                    >
                      {selectedJob.manager || '-'}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: '#23262F',
                        width: '111px'
                      }}
                    >
                      {selectedJob.jobRole || '-'}
                    </Typography>
                  </DataWrapper>
                </IconFrame>
                <StatusBadge sx={{ color: statusColors[selectedJob.status] || '#000' }}>
                  {selectedJob.status}
                </StatusBadge>
              </HeaderWrapper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '520px', padding: '0px' }}>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Band
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.jobGrade}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Posted
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.postedDate}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Openings
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.openings}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Area
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.location}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      ID
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.id}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Job Role
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.jobRole}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Job Title
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.designation}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Grade
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.manager || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Department
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.department || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Campus Or Lateral
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.manager || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Employee Category
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.employeeCategory || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Employee Type
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.branch || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Attachments
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#0096DA',
                        textDecoration: 'underline'
                      }}
                    >
                      {selectedJob.attachments?.join(', ') || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Company
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.businessUnit || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Business Unit
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.businessUnit || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Branch Business
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.branchBusiness || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Zone
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.zone || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Region
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.area || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Area
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.area || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      City
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.area || '-'}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      State
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.state || '-'}
                    </Typography>
                  </Col>
                  <Col>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: '#5E6E78'
                      }}
                    >
                      Date
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Public Sans', 'Roboto', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#23262F'
                      }}
                    >
                      {selectedJob.postedDate || '-'}
                    </Typography>
                  </Col>
                </Row>
              </Box>
              <Button
                variant='contained'
                sx={{
                  mt: 2,
                  backgroundColor: '#0096DA',
                  color: '#fff',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#007BB8' }
                }}
                onClick={() => handleNavigate(selectedJob.id)}
                aria-label={`Go to full details for ${selectedJob.designation}`}
              >
                Go to Full Details
              </Button>
            </Box>
          </DrawerContent>
        )}
      </Drawer> */}
    </Box>
  )
}

export default JobPostGrid
