'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Divider
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState, AppDispatch } from '@/redux/store'
import { fetchResignedEmployees } from '@/redux/ResignationDataListing/ResignationDataListingSlice'
import type { ResignedEmployee } from '@/types/resignationDataListing'

// Interface for approval history entries (simulated for now)
interface ApprovalHistoryEntry {
  employeeName: string
  stage: string
  status: string
  role: string
  resignationDate: string
  approvedRelievingDate: string
  actionDate: string
  resignationType: string
  reasonForSeparation: string
  absconding: boolean
  comment: string
  attachment: string
  attachmentCRIF: string
  actionName: string
}

const ResignationDetailsPage = () => {
  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()
  const { id } = useParams() // Get the employee ID from the URL

  const { employees, loading, error } = useAppSelector((state: RootState) => state.resignationDataListingReducer)

  const [employee, setEmployee] = useState<ResignedEmployee | null>(null)
  const [tabValue, setTabValue] = useState(0)

  // Fetch employee details by ID
  useEffect(() => {
    if (id) {
      // Assuming fetchResignedEmployees can fetch a single employee by ID
      dispatch(fetchResignedEmployees({ id: id as string }))
        .unwrap()
        .then(response => {
          // Assuming the response contains the employee data
          const fetchedEmployee = response.employees?.find((emp: ResignedEmployee) => emp.id === id)
          if (fetchedEmployee) {
            setEmployee(fetchedEmployee)
          } else {
            console.error('Employee not found')
            setEmployee(null)
          }
        })
        .catch(err => {
          console.error('Error fetching employee details:', err)
          setEmployee(null)
        })
    }
  }, [dispatch, id])

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Simulated data for tabs and approval history (replace with actual API data as needed)
  const relievingInfo = {
    relievingDate: employee?.resignationDetails.relievingDateAsPerNotice?.split('T')[0] || '-',
    noticePeriodServed: employee?.resignationDetails.noticePeriod || '-',
    lastWorkingDay: employee?.resignationDetails.lwd?.split('T')[0] || '-'
  }

  const noDuesClearance = {
    departmentClearance: 'Cleared',
    itClearance: 'Cleared',
    financeClearance: 'Pending'
  }

  const finalSettlement = {
    settlementAmount: '$5000',
    settlementDate: '2025-06-01',
    status: 'Processed'
  }

  const history = [
    { action: 'Resignation Submitted', date: '2025-05-01', by: 'Employee' },
    { action: 'Resignation Approved', date: '2025-05-05', by: 'L1 Manager' },
    { action: 'Final Settlement Processed', date: '2025-06-01', by: 'HR' }
  ]

  const surveyInfo = {
    surveyName: 'Exit Survey',
    assignee: 'HR Team',
    initialDate: '2025-05-10',
    viewLink: '#' // Replace with actual survey link
  }

  const approvalHistory: ApprovalHistoryEntry[] = [
    {
      employeeName: `${employee?.firstName} ${employee?.lastName || ''}`,
      stage: 'Initiated',
      status: 'Approved',
      role: 'L1 Manager',
      resignationDate: employee?.resignationDetails.dateOfResignation?.split('T')[0] || '-',
      approvedRelievingDate: employee?.resignationDetails.relievingDateAsPerNotice?.split('T')[0] || '-',
      actionDate: '2025-05-05',
      resignationType: 'Voluntary',
      reasonForSeparation: 'Personal Reasons',
      absconding: false,
      comment: 'Approved without issues',
      attachment: 'attachment1.pdf',
      attachmentCRIF: 'crif1.pdf',
      actionName: 'Approve'
    },
    {
      employeeName: `${employee?.firstName} ${employee?.lastName || ''}`,
      stage: 'In Process',
      status: 'On Hold',
      role: 'HR Manager',
      resignationDate: employee?.resignationDetails.dateOfResignation?.split('T')[0] || '-',
      approvedRelievingDate: employee?.resignationDetails.relievingDateAsPerNotice?.split('T')[0] || '-',
      actionDate: '2025-05-10',
      resignationType: 'Voluntary',
      reasonForSeparation: 'Personal Reasons',
      absconding: false,
      comment: 'Pending no-dues clearance',
      attachment: 'attachment2.pdf',
      attachmentCRIF: 'crif2.pdf',
      actionName: 'Hold'
    }
  ]

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='h6' color='text.secondary'>
          Loading...
        </Typography>
      </Box>
    )
  }

  if (error || !employee) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='h6' color='error'>
          {error || 'Employee not found'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Back Button */}
      <Button variant='outlined' onClick={() => router.push('/resignation-data-listing')} sx={{ mb: 3 }}>
        Back to Listing
      </Button>

      {/* 1. Resignation Information */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }}>
          Resignation Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Resignation Code
            </Typography>
            <Typography variant='body1'>
              {employee.resignationDetails.resignationCode || 'RES-001'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Creation Date
            </Typography>
            <Typography variant='body1'>
              {employee.resignationDetails.dateOfResignation?.split('T')[0] || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Stage
            </Typography>
            <Typography variant='body1'>
              {employee.resignationDetails.stage || 'In Process'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Status
            </Typography>
            <Chip
              label={employee.resignationDetails.status || 'Approved'} /* Simulated */
              color={
                employee.resignationDetails.status === 'Approved'
                  ? 'success'
                  : employee.resignationDetails.status === 'Rejected'
                    ? 'error'
                    : 'warning'
              }
              size='small'
            />
          </Box>
        </Box>
      </Card>

      {/* 2. Employee Information */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }}>
          Employee Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Employee Code
            </Typography>
            <Typography variant='body1'>{employee.employeeCode}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Employee Name
            </Typography>
            <Typography variant='body1'>
              {employee.firstName} {employee.middleName || ''} {employee.lastName}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Date of Joining
            </Typography>
            <Typography variant='body1'>
              {employee.dateOfJoining?.split('T')[0] || '2023-01-01'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Group Date of Joining
            </Typography>
            <Typography variant='body1'>
              {employee.groupDateOfJoining?.split('T')[0] || '2023-01-01'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Designation
            </Typography>
            <Typography variant='body1'>{employee.designation.name}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Spurious
            </Typography>
            <Typography variant='body1'>
              {employee.spurious ? 'Yes' : 'No'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Grade
            </Typography>
            <Typography variant='body1'>
              {employee.grade || 'A'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Band
            </Typography>
            <Typography variant='body1'>
              {employee.band || 'B1'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Notice Period
            </Typography>
            <Typography variant='body1'>{employee.resignationDetails.noticePeriod}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Location
            </Typography>
            <Typography variant='body1'>
              {employee.location || 'New York'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Organization Unit
            </Typography>
            <Typography variant='body1'>{employee.department.name}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              L1 Manager
            </Typography>
            <Typography variant='body1'>
              {employee.l1Manager || 'John Doe'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              L2 Manager
            </Typography>
            <Typography variant='body1'>
              {employee.l2Manager || 'Jane Smith'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              HR Manager
            </Typography>
            <Typography variant='body1'>
              {employee.hrManager || 'Emily Davis'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Official Email ID
            </Typography>
            <Typography variant='body1'>
              {employee.officialEmail || 'employee@company.com'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Personal Email ID
            </Typography>
            <Typography variant='body1'>
              {employee.personalEmail || 'employee.personal@gmail.com'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Confirmation Status
            </Typography>
            <Typography variant='body1'>
              {employee.confirmationStatus || 'Confirmed'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Relieving Date as per Policy
            </Typography>
            <Typography variant='body1'>
              {employee.resignationDetails.relievingDateAsPerNotice?.split('T')[0] || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Leave Balance on LWD
            </Typography>
            <Typography variant='body1'>
              {employee.leaveBalanceOnLWD || '10 days'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Correspondence Email
            </Typography>
            <Typography variant='body1'>
              {employee.correspondenceEmail || 'correspondence@company.com'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Correspondence Number
            </Typography>
            <Typography variant='body1'>
              {employee.correspondenceNumber || '+1234567890'} {/* Simulated */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Correspondence Address
            </Typography>
            <Typography variant='body1'>
              {employee.correspondenceAddress || '123 Main St, New York, NY 10001'} {/* Simulated */}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 3. Tab Section */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }}>
          Details
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label='Relieving Info' />
          <Tab label='No Dues Clearance' />
          <Tab label='F&F Settlement' />
          <Tab label='History' />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            <Typography variant='body1'>
              <strong>Relieving Date:</strong> {relievingInfo.relievingDate}
            </Typography>
            <Typography variant='body1'>
              <strong>Notice Period Served:</strong> {relievingInfo.noticePeriodServed}
            </Typography>
            <Typography variant='body1'>
              <strong>Last Working Day:</strong> {relievingInfo.lastWorkingDay}
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <Typography variant='body1'>
              <strong>Department Clearance:</strong> {noDuesClearance.departmentClearance}
            </Typography>
            <Typography variant='body1'>
              <strong>IT Clearance:</strong> {noDuesClearance.itClearance}
            </Typography>
            <Typography variant='body1'>
              <strong>Finance Clearance:</strong> {noDuesClearance.financeClearance}
            </Typography>
          </Box>
        )}
        {tabValue === 2 && (
          <Box>
            <Typography variant='body1'>
              <strong>Settlement Amount:</strong> {finalSettlement.settlementAmount}
            </Typography>
            <Typography variant='body1'>
              <strong>Settlement Date:</strong> {finalSettlement.settlementDate}
            </Typography>
            <Typography variant='body1'>
              <strong>Status:</strong> {finalSettlement.status}
            </Typography>
          </Box>
        )}
        {tabValue === 3 && (
          <Box>
            {history.map((entry, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant='body1'>
                  <strong>{entry.action}</strong> on {entry.date} by {entry.by}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Card>

      {/* 4. Survey Info */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }}>
          Survey Info
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Survey Name
            </Typography>
            <Typography variant='body1'>{surveyInfo.surveyName}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Assignee
            </Typography>
            <Typography variant='body1'>{surveyInfo.assignee}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Initial Date
            </Typography>
            <Typography variant='body1'>{surveyInfo.initialDate}</Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              View Link
            </Typography>
            <Button variant='text' color='primary' href={surveyInfo.viewLink}>
              View Survey
            </Button>
          </Box>
        </Box>
      </Card>

      {/* 5. Approval History Table */}
      <Card sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }}>
          Approval History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Resignation Date</TableCell>
                <TableCell>Approved Relieving Date</TableCell>
                <TableCell>Action Date</TableCell>
                <TableCell>Resignation Type</TableCell>
                <TableCell>Reason for Separation</TableCell>
                <TableCell>Absconding</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Attachment</TableCell>
                <TableCell>Attachment CRIF</TableCell>
                <TableCell>Action Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvalHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.employeeName}</TableCell>
                  <TableCell>{entry.stage}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      color={
                        entry.status === 'Approved' ? 'success' : entry.status === 'Rejected' ? 'error' : 'warning'
                      }
                      size='small'
                    />
                  </TableCell>
                  <TableCell>{entry.role}</TableCell>
                  <TableCell>{entry.resignationDate}</TableCell>
                  <TableCell>{entry.approvedRelievingDate}</TableCell>
                  <TableCell>{entry.actionDate}</TableCell>
                  <TableCell>{entry.resignationType}</TableCell>
                  <TableCell>{entry.reasonForSeparation}</TableCell>
                  <TableCell>{entry.absconding ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{entry.comment}</TableCell>
                  <TableCell>
                    <Button variant='text' color='primary' href={entry.attachment}>
                      Download
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant='text' color='primary' href={entry.attachmentCRIF}>
                      Download
                    </Button>
                  </TableCell>
                  <TableCell>{entry.actionName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default ResignationDetailsPage
