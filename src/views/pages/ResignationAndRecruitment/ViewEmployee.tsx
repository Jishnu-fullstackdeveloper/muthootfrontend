import React from 'react'
import { Box, Typography, Grid, Divider, Button, Paper, Chip, Stepper, Step, StepLabel, Card } from '@mui/material'
import { Email, Phone, Business, CalendarToday, LocationCity, ArrowBack, Edit } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import ChartSample from './ChartSample'
import BubblePositionTable from './BubblePositionTable'
import DesignationResignedReport from './BubblePositionTable'

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
      'Relocating to another city for personal reasons. Leaving your job might seem like a daunting task. However, under certain circumstances, quitting might be beneficial for you. As of 2024, 88% of professionals in India are considering a new job.* Some of the common reasons are work-life balance and higher compensation. Several professionals also consider leaving their jobs to upskill themselves. Education not only adds more skills but can also help one find their purpose. As per one LinkedIn study, 8 out of 10 people say that learning adds purpose to their work.',
    approvalStatus: [
      {
        designation: 'Branch Manager',
        label: 'HR Approval',
        approverName: 'John Doe',
        employeeCode: 'E1234',
        status: 'Completed'
      },
      {
        designation: 'HR Manager',
        label: 'HR Manager Approval',
        approverName: 'Jane Smith',
        employeeCode: 'E5678',
        status: 'Pending'
      },
      {
        designation: 'Director',
        label: 'Director Approval',
        approverName: 'Alice Johnson',
        employeeCode: 'E9012',
        status: 'Rejected'
      }
    ]
  }

  const activeStep = employee?.approvalStatus?.findIndex(step => step.status === 'Pending')

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
        <Button startIcon={<ArrowBack />} variant='text' onClick={() => router.back()}>
          Back
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
              paddingY: 1,
              textTransform: 'capitalize'
            }}
          >
            {employee.title} {employee.employeeName}
          </Typography>
          <Typography variant='body1' sx={{ color: '#555', marginBottom: 0.5, fontWeight: '500', paddingY: 1 }}>
            {employee.designation} - {employee.department}
          </Typography>
          {/* <Typography
            variant="body2"
            sx={{ color: '#777', marginBottom: 1 }}
          >
            {employee.company}
          </Typography> */}
          <Box
            sx={{
              fontWeight: '600',
              paddingY: 1,
              fontSize: 15,
              textTransform: 'capitalize',
              color: employee.employmentStatus === 'Resigned' ? '#d32f2f' : '#388e3c',
              maxWidth: '120px'
            }}
          >
            {employee.employmentStatus}
          </Box>
        </Box>

        {/* <Chip
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
        /> */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            marginTop: 2
          }}
        >
          <Button
            variant='contained'
            color='success'
            onClick={e => {
              e.stopPropagation()
            }}
            sx={{ padding: '6px 16px' }}
            startIcon={<i className='tabler-check' />}
          >
            Approve
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={e => {
              e.stopPropagation()
            }}
            sx={{ padding: '6px 16px' }}
            startIcon={<i className='tabler-playstation-x' />}
          >
            Reject
          </Button>
        </Box>
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
        <DesignationResignedReport />
        <ChartSample />
      </Box>

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
      {/* Approval Status Stepper */}
      <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: 4, marginBottom: 2 }}>
        Approval Status
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      <Box sx={{ p: 10 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {employee.approvalStatus.map((step, index) => (
            <Step key={index}>
              <StepLabel
                error={step.status === 'Rejected'}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: step.status === 'Completed' ? 'green' : step.status === 'Rejected' ? 'red' : 'orange'
                  }
                }}
              >
                Level {index + 1}: {step.label} - {step.status}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {/* Approver Details Section */}
      <Box
        sx={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}
      >
        {employee.approvalStatus.map((approver, index) => (
          <Card
            key={index}
            sx={{
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography variant='h6' sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 3 }}>
              Level {index + 1}: <strong>{approver.designation}</strong>
            </Typography>
            <Typography variant='body1'>
              <strong>Name:</strong> {approver.approverName}
            </Typography>
            <Typography variant='body1'>
              <strong>Employee Code:</strong> {approver.employeeCode}
            </Typography>
            <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
              <strong>Status:</strong>&nbsp;
              <span
                style={{
                  color:
                    approver.status === 'Rejected'
                      ? '#d32f2f'
                      : approver.status === 'Completed'
                        ? '#2e7d32'
                        : '#ed6c02',
                  fontWeight: 'bold'
                }}
              >
                {approver.status}
              </span>
            </Typography>
          </Card>
        ))}
      </Box>
      <Divider sx={{ marginBottom: 3 }} />
      {/* Additional Details */}
      <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: 8, marginBottom: 2 }}>
        Additional Details
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      <Typography variant='body1'>{employee.additionalDetails}</Typography>
    </Paper>
  )
}

export default ViewEmployee
