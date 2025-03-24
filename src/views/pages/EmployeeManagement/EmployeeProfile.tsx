'use client'
import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material'

import { employeesTableData } from '@/utils/sampleData/EmployeeManagement/EmployeeManagementData'

const EmployeeProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id

  const employee = employeesTableData.find(emp => emp.id === Number(employeeId))

  if (!employee) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Typography variant='h5' color='error'>
          Employee not found
        </Typography>
        <Button variant='contained' onClick={() => router.push('/employee-management')} sx={{ mt: 2 }}>
          Back to Employee List
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Smaller padding on mobile
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
        gap: { xs: 2, sm: 4 } // Responsive gap
      }}
    >
      {/* Sidebar */}
      <Card
        sx={{
          flex: { xs: '1 1 100%', md: '1 1 30%' }, // Full width on mobile, 30% on desktop
          p: 2,
          bgcolor: '#ffffff',
          maxWidth: { md: '400px' } // Limit width on larger screens
        }}
      >
        <CardContent>
          <Typography
            variant='h5'
            color='primary.main'
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 'bold' }} // Responsive font size
          >
            {employee.title} {employee.firstName} {employee.middleName || ''} {employee.lastName}
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            <strong>Employee code:</strong> {employee.employeeCode}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='body2'>
            <strong>Designation:</strong> {employee.designation}
          </Typography>
          <Typography variant='body2'>
            <strong>Department:</strong> {employee.department}
          </Typography>
          <Typography variant='body2'>
            <strong>Status:</strong> {employee.status}
          </Typography>
          {/* <Button variant='outlined' fullWidth onClick={() => router.push('/employee-management')} sx={{ mt: 2 }}>
            Back to List
          </Button> */}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card
        sx={{
          flex: { xs: '1 1 100%', md: '1 1 70%' }, // Full width on mobile, 70% on desktop
          width: '100%'
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h6'
              color='text.primary'
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} // Responsive font size
            >
              Employee Details
            </Typography>
          </Box>

          {/* Employment Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              color='primary.main'
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              Employment Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 } // Smaller gap on mobile
              }}
            >
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Employee Type:</strong> {employee.employeeType}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Company:</strong> {employee.company}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Business Unit:</strong> {employee.businessUnit}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Date of Joining:</strong> {employee.dateOfJoining}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Grade:</strong> {employee.grade}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Band:</strong> {employee.band}
              </Typography>
            </Box>
          </Box>

          {/* Location Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              color='primary.main'
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              Location Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 }
              }}
            >
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Territory:</strong> {employee.territory}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Zone:</strong> {employee.zone}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Region:</strong> {employee.region}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Area:</strong> {employee.area}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Cluster:</strong> {employee.cluster}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Branch:</strong> {employee.branch}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Branch Code:</strong> {employee.branchCode}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>City Classification:</strong> {employee.cityClassification}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>State:</strong> {employee.state}
              </Typography>
            </Box>
          </Box>

          {/* Management Information */}
          <Box>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              color='primary.main'
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              Management Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 }
              }}
            >
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>L1 Manager:</strong> {employee.l1Manager} ({employee.l1ManagerCode})
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>L2 Manager:</strong> {employee.l2Manager} ({employee.l2ManagerCode})
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>HR Manager:</strong> {employee.hrManager} ({employee.hrManagerCode})
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Function Head:</strong> {employee.functionHead}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Practice Head:</strong> {employee.practiceHead}
              </Typography>
              <Typography variant='body2' sx={{ flex: '1 1 45%', minWidth: { xs: '150px', sm: '250px' } }}>
                <strong>Job Role:</strong> {employee.jobRole}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EmployeeProfilePage
