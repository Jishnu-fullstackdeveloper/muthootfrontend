import React from 'react'
import { Box, Typography, Grid, Divider, Button, Paper, Chip } from '@mui/material'
import { Email, Phone, Business, CalendarToday, LocationCity, ArrowBack, Edit } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

type Props = {
  mode: string
  id: string
}

const ViewEmployee: React.FC<Props> = ({ mode, id }) => {
  // Sample employee data
  const router = useRouter()
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
    additionalDetails: 'Relocating to another city for personal reasons.'
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
        {/* <Button variant='contained' startIcon={<Edit />}>
          Edit Employee
        </Button> */}
      </Box>
      <Box sx={{ backgroundColor: '#f0f4f7', padding: 3, borderRadius: 3, marginBottom: 4 }}>
        <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333' }}>
          {employee.title} {employee.employeeName}
        </Typography>
        <Typography variant='body1' sx={{ color: '#666' }}>
          {employee.designation} - {employee.department}
        </Typography>
        <Typography variant='body2' sx={{ color: '#888' }}>
          {employee.company}
        </Typography>
        <Chip
          label={employee.employmentStatus}
          color={employee.employmentStatus === 'Resigned' ? 'error' : 'success'}
          sx={{ marginTop: 1 }}
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
