import React from 'react'
import { Box, Typography, Grid, Divider, Button, Paper, Chip } from '@mui/material'
import { Email, Phone, Business, CalendarToday, LocationCity, ArrowBack, Edit } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

type Props = {
  mode: string
  id: string
}

const ViewEmployee: React.FC<Props> = ({ mode, id }) => {
  const router = useRouter()
  // Sample employee data
  const employee = {
    employeeCode: 'EMP001',
    employmentStatus: 'Resigned',
    employmentType: 'Full-time',
    title: 'Mr.',
    employeeName: 'John Doe',
    company: 'ABC Corp',
    department: 'IT',
    territory: 'North Zone',
    zone: 'Zone A',
    region: 'Region 1',
    area: 'Area 5',
    cluster: 'Cluster X',
    branch: 'Main Branch',
    branchCode: 'BR001',
    cityClassification: 'Metro',
    state: 'California',
    personalEmail: 'johndoe@example.com',
    officeEmail: 'johnd@abccorp.com',
    dateOfJoining: '2015-06-15',
    groupDOJ: '2015-06-15',
    designation: 'Software Engineer',
    employeeCategory: 'Technical',
    employeeType: 'Permanent',
    noticePeriod: '30 days',
    mobileNumber: '+1-234-567-8901',
    dateOfResignation: '2024-12-01',
    lastWorkingDay: '2025-01-01',
    additionalDetails:
      'Relocating to another city for personal reasons. Leaving your job might seem like a daunting task. However, under certain circumstances, quitting might be beneficial for you. As of 2024, 88% of professionals in India are considering a new job.* Some of the common reasons are work-life balance and higher compensation. Several professionals also consider leaving their jobs to upskill themselves. Education not only adds more skills but can also help one find their purpose. As per one LinkedIn study, 8 out of 10 people say that learning adds purpose to their work.'
  }

  return (
    <Paper
      sx={{
        minHeight: '80vh',
        padding: 4,
        borderRadius: 4,
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header Section */}
      <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={4}>
        <Button startIcon={<ArrowBack />} variant='text' onClick={() => router.push('/recruitment-management')}>
          Back to Employee List
        </Button>
      </Box>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          padding: 3,
          borderRadius: 2,
          marginBottom: 4,
          boxShadow: 3,
          //   transition: 'all 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
          //   '&:hover': {
          //     transform: 'translateY(-8px)',
          //     boxShadow: 6,
          //     cursor: 'pointer'
          //   }
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: '700',
              color: '#2e2e2e',
              fontSize: '25px',
              marginBottom: 0.5,
              textTransform: 'capitalize'
            }}
          >
            {employee.title} {employee.employeeName}
          </Typography>

          <Typography
            variant='body1'
            sx={{
              color: '#555',
              marginBottom: 0.5,
              fontWeight: '500'
            }}
          >
            {employee.designation} - {employee.department}
          </Typography>

          <Typography
            variant='body2'
            sx={{
              color: '#777',
              marginBottom: 1
            }}
          >
            {employee.company}
          </Typography>
        </Box>

        <Chip
          label={employee.employmentStatus}
          color={employee.employmentStatus === 'Resigned' ? 'error' : 'success'}
          sx={{
            fontWeight: '600',
            paddingX: 3,
            paddingY: 1,
            borderRadius: '20px',
            boxShadow: 2,
            textTransform: 'capitalize',
            backgroundColor: employee.employmentStatus === 'Resigned' ? '#ffebee' : '#e8f5e9',
            color: employee.employmentStatus === 'Resigned' ? '#d32f2f' : '#388e3c',
            maxWidth: '120px' // Restrict the chip size for better visual balance
          }}
        />
      </Box>

      {/* Action Buttons */}
      {/* <Box sx={{ textAlign: 'right', marginBottom: 3 }}>
        <Button variant='contained' sx={{ marginRight: 2 }}>
          Edit Employee
        </Button>
        <Button variant='outlined' color='error'>
          Export to Excel
        </Button>
      </Box> */}

      {/* Employee Details */}
      <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Employee Details
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant='body1'>
            <strong>Employee Code:</strong> {employee.employeeCode}
          </Typography>
          <Typography variant='body1'>
            <strong>Employment Type:</strong> {employee.employmentType}
          </Typography>
          <Typography variant='body1'>
            <strong>Date of Joining:</strong> {employee.dateOfJoining}
          </Typography>
          <Typography variant='body1'>
            <strong>Notice Period:</strong> {employee.noticePeriod}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant='body1'>
            <strong>Designation:</strong> {employee.designation}
          </Typography>
          <Typography variant='body1'>
            <strong>Branch:</strong> {employee.branch} ({employee.branchCode})
          </Typography>
          <Typography variant='body1'>
            <strong>State:</strong> {employee.state}
          </Typography>
          <Typography variant='body1'>
            <strong>City Classification:</strong> {employee.cityClassification}
          </Typography>
        </Grid>
      </Grid>

      {/* Contact Information */}
      <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: 4, marginBottom: 2 }}>
        Contact Information
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant='body1'>
            <Email sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Personal Email: {employee.personalEmail}
          </Typography>
          <Typography variant='body1'>
            <Phone sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Mobile: {employee.mobileNumber}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body1'>
            <Email sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Office Email: {employee.officeEmail}
          </Typography>
        </Grid>
      </Grid>

      {/* Resignation Details */}
      <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: 4, marginBottom: 2 }}>
        Resignation Details
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant='body1'>
            <CalendarToday sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Date of Resignation: {employee.dateOfResignation}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body1'>
            <CalendarToday sx={{ verticalAlign: 'middle', marginRight: 1 }} />
            Last Working Day: {employee.lastWorkingDay || 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      {/* Additional Details */}
      <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: 4, marginBottom: 2 }}>
        Additional Details
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      <Typography variant='body1'>{employee.additionalDetails}</Typography>
    </Paper>
  )
}

export default ViewEmployee
