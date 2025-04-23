'use client'
import React, { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { Box, Typography, Card, CardContent, Divider, Chip } from '@mui/material'

//import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchEmployeeById } from '@/redux/EmployeeManagement/employeeManagementSlice'

const EmployeeProfilePage = () => {
  //const params = useParams()
  const searchParams = useSearchParams()

  //const router = useRouter()
  const dispatch = useAppDispatch()

  //const employeeId = params.id as string
  const employeeId = searchParams.get('id')

  //console.log('employee id: ', employeeId, searchParams)

  const { selectedEmployee, selectedEmployeeStatus, selectedEmployeeError } = useAppSelector(
    state => state.employeeManagementReducer
  )

  // Fetch employee data on mount
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId))
    }
  }, [dispatch, employeeId])

  // Map API data to UI format
  const employee = selectedEmployee
    ? {
        id: selectedEmployee.id,
        employeeCode: selectedEmployee.employeeCode,
        title: selectedEmployee.title || '-',
        firstName: selectedEmployee.firstName,
        middleName: selectedEmployee.middleName || '-',
        lastName: selectedEmployee.lastName,
        employeeType: selectedEmployee.employeeDetails.employmentType,
        status: selectedEmployee.employeeDetails.employmentStatus,
        company: selectedEmployee.companyStructure.company,
        businessUnit: selectedEmployee.businessUnit.name,
        department: selectedEmployee.department.name,
        territory: '-', // Not in API response
        zone: '-', // Not in API response
        region: '-', // Not in API response
        //area: selectedEmployee.designation.type || '-', // Using designation.type as a proxy
        cluster: '-', // Not in API response
        branch: selectedEmployee.companyStructure.branchCode || '-',
        branchCode: selectedEmployee.companyStructure.branchCode || '-',
        cityClassification: selectedEmployee.address.cityClassification,
        state: selectedEmployee.address.state,
        dateOfJoining: selectedEmployee.employeeDetails.dateOfJoining,
        groupDOJ: selectedEmployee.employeeDetails.groupDOJ,
        grade: selectedEmployee.grade.name,
        band: selectedEmployee.band.name,
        designation: selectedEmployee.designation.name,
        employeeCategory: '-', // Not in API response
        employeeCategoryType: '-', // Not in API response
        l1ManagerCode: selectedEmployee.managementHierarchy.l1ManagerCode,
        l1Manager: '-', // Not in API response
        l2ManagerCode: selectedEmployee.managementHierarchy.l2ManagerCode,
        l2Manager: '-', // Not in API response
        hrManagerCode: selectedEmployee.managementHierarchy.hrManagerCode,
        hrManager: '-', // Not in API response
        functionHead: '-', // Not in API response
        practiceHead: '-', // Not in API response
        jobRole: '-' // Not in API response
      }
    : null

  if (selectedEmployeeStatus === 'loading') {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', bgcolor: '#ffffff', minHeight: '100vh' }}>
        <Typography variant='body1' color='text.secondary'>
          Loading...
        </Typography>
      </Box>
    )
  }

  if (selectedEmployeeStatus === 'failed' || !employee) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', bgcolor: '#ffffff', minHeight: '100vh' }}>
        <Typography variant='body1' color='error'>
          {selectedEmployeeError || 'Employee not found'}
        </Typography>
        {/* <Button variant='contained' onClick={() => router.push('/employee-management')} sx={{ mt: 2 }}>
          Back to Employee List
        </Button> */}
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mb: 4,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.light',
            color: 'white',
            fontSize: '2.5rem'
          }}
        >
          {employee.firstName[0]}
          {employee.lastName[0]}
        </Avatar> */}
        <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 1 }}>
          {employee.title} {employee.firstName} {employee.middleName || ''} {employee.lastName}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
          Employee Code: {employee.employeeCode}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip label={`Designation: ${employee.designation}`} color='primary' variant='tonal' size='small' />
          <Chip label={`Department: ${employee.department}`} color='secondary' variant='tonal' size='small' />
          <Chip
            label={`${employee.status}`}
            color={employee.status === 'Active' ? 'success' : 'error'}
            variant='tonal'
            size='small'
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Employment Information */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <CardContent>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold', mb: 2 }}>
              Employment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}
            >
              <Typography variant='body1'>
                <strong>Employee Type:</strong> {employee.employeeType}
              </Typography>
              <Typography variant='body1'>
                <strong>Company:</strong> {employee.company}
              </Typography>
              <Typography variant='body1'>
                <strong>Business Unit:</strong> {employee.businessUnit}
              </Typography>
              <Typography variant='body1'>
                <strong>Date of Joining:</strong> {employee.dateOfJoining.split('T')[0]}
              </Typography>
              <Typography variant='body1'>
                <strong>Grade:</strong> {employee.grade}
              </Typography>
              <Typography variant='body1'>
                <strong>Band:</strong> {employee.band}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <CardContent>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold', mb: 2 }}>
              Location Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}
            >
              {/* <Typography variant='body1'>
                <strong>Territory:</strong> {employee.territory}
              </Typography>
              <Typography variant='body1'>
                <strong>Zone:</strong> {employee.zone}
              </Typography>
              <Typography variant='body1'>
                <strong>Region:</strong> {employee.region}
              </Typography>
              <Typography variant='body1'>
                <strong>Area:</strong> {employee.area}
              </Typography>
              <Typography variant='body1'>
                <strong>Cluster:</strong> {employee.cluster}
              </Typography> */}
              <Typography variant='body1'>
                <strong>Branch:</strong> {employee.branch}
              </Typography>
              <Typography variant='body1'>
                <strong>Branch Code:</strong> {employee.branchCode}
              </Typography>
              <Typography variant='body1'>
                <strong>City Classification:</strong> {employee.cityClassification}
              </Typography>
              <Typography variant='body1'>
                <strong>State:</strong> {employee.state}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Management Information */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }
          }}
        >
          <CardContent>
            <Typography variant='h6' color='primary.main' sx={{ fontWeight: 'bold', mb: 2 }}>
              Management Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}
            >
              <Typography variant='body1'>
                <strong>L1 Manager:</strong> {employee.l1Manager} ({employee.l1ManagerCode})
              </Typography>
              <Typography variant='body1'>
                <strong>L2 Manager:</strong> {employee.l2Manager} ({employee.l2ManagerCode})
              </Typography>
              <Typography variant='body1'>
                <strong>HR Manager:</strong> {employee.hrManager} ({employee.hrManagerCode})
              </Typography>
              <Typography variant='body1'>
                <strong>Function Head:</strong> {employee.functionHead}
              </Typography>
              <Typography variant='body1'>
                <strong>Practice Head:</strong> {employee.practiceHead}
              </Typography>
              <Typography variant='body1'>
                <strong>Job Role:</strong> {employee.jobRole}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Floating Action Button for Back Navigation */}
      {/* <Fab
        color='primary'
        onClick={() => router.push('/employee-management')}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}
      >
        <ArrowBackIcon />
      </Fab> */}
    </Box>
  )
}

export default EmployeeProfilePage
