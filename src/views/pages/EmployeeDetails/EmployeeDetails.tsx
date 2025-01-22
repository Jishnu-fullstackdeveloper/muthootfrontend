import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'
import sampleEmployeeData from '@/utils/sampleData/sampleEmployeeData.json'

const EmployeeDetails = () => {
  const employee = sampleEmployeeData[0] // Assuming you load the first employee for demonstration.

  return (
    <Box sx={{ padding: 0, margin: 0, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Card
        sx={{
          borderRadius: 0,
          boxShadow: 3,
          margin: 0
        }}
      >
        <CardContent>
          {/* Header Section */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant='h4' fontWeight='bold' gutterBottom>
              Employee Details
            </Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              Detailed information about the employee
            </Typography>
          </Box>

          {/* Basic Details Grid */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant='h6' gutterBottom>
                Personal Information
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell variant='head'>Employee Code</TableCell>
                      <TableCell>{employee.employeeCode}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Name</TableCell>
                      <TableCell>{employee['Employee Name']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Date of Birth</TableCell>
                      <TableCell>{employee['Date Of Birth']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Gender</TableCell>
                      <TableCell>{employee.Gender}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Marital Status</TableCell>
                      <TableCell>{employee['Marital Status']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Personal Email</TableCell>
                      <TableCell>{employee['Personal Email Address']}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant='h6' gutterBottom>
                Employment Details
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell variant='head'>Company</TableCell>
                      <TableCell>{employee.Company}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Title</TableCell>
                      <TableCell>{employee.Title}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Employment Type</TableCell>
                      <TableCell>{employee['Employment Type']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Department</TableCell>
                      <TableCell>{employee.Department}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Joining Date</TableCell>
                      <TableCell>{employee['Date of Joining']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Grade</TableCell>
                      <TableCell>{employee.Grade}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Address Information */}
          <Box sx={{ marginTop: 4 }}>
            <Typography variant='h6' gutterBottom>
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                  <Table size='small'>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>Residence Address</TableCell>
                        <TableCell>
                          {employee['Residence - Address Line 1']}, {employee['Residence - City']},{' '}
                          {employee['Residence - State']} - {employee['Residence Postal Code']}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>Mobile</TableCell>
                        <TableCell>{employee['Residence - Mobile']}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                  <Table size='small'>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>Permanent Address</TableCell>
                        <TableCell>
                          {employee['Permanent - Address Line 1']}, {employee['Permanent - City']},{' '}
                          {employee['Permanent - State']} - {employee['Permanent Postal Code']}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>Mobile</TableCell>
                        <TableCell>{employee['Permanent - Mobile']}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EmployeeDetails
