'use client'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

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
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

//import PersonIcon from '@mui/icons-material/Person'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

//import InfoIcon from '@mui/icons-material/Info'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

//import AssignmentIcon from '@mui/icons-material/Assignment'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HistoryIcon from '@mui/icons-material/History'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState, AppDispatch } from '@/redux/store'
import { fetchResignedEmployeeById } from '@/redux/ResignationDataListing/ResignationDataListingSlice'
import type { ResignedEmployee } from '@/types/resignationDataListing'

// Interface for approval history entries (updated to use API data where possible)
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

  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Get the employee ID from the URL query params

  const {
    selectedEmployee: employee,
    loading,
    error
  } = useAppSelector((state: RootState) => state.resignationDataListingReducer)

  const [tabValue, setTabValue] = useState(0)

  // Fetch employee details by ID
  useEffect(() => {
    if (id) {
      dispatch(fetchResignedEmployeeById(id))
    }
  }, [dispatch, id])

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Map API data to tab content (use API data where available, simulate the rest)
  const relievingInfo = {
    relievingDate: employee?.resignationDetails?.relievingDateAsPerNotice?.split('T')[0] || '-',
    noticePeriodServed: employee?.resignationDetails?.noticePeriod || '-',
    lastWorkingDay: employee?.resignationDetails?.lwd?.split('T')[0] || '-'
  }

  const noDuesClearance = {
    departmentClearance: 'Cleared', // Simulate as API doesn't provide this
    itClearance: 'Cleared',
    financeClearance: 'Pending'
  }

  const finalSettlement = {
    settlementAmount: '$5000', // Simulate as API doesn't provide this
    settlementDate: '2025-06-01',
    status: 'Processed'
  }

  const history = [
    {
      action: 'Resignation Submitted',
      date: employee?.resignationDetails?.dateOfResignation?.split('T')[0] || '2025-05-01',
      by: 'Employee'
    },
    { action: 'Resignation Approved', date: '2025-05-05', by: 'L1 Manager' }, // Simulate remaining entries
    { action: 'Final Settlement Processed', date: '2025-06-01', by: 'HR' }
  ]

  const surveyInfo = {
    surveyName: 'Exit Survey', // Simulate as API doesn't provide this
    assignee: 'HR Team',
    initialDate: '2025-05-10',
    viewLink: '#' // Replace with actual survey link if available
  }

  const approvalHistory: ApprovalHistoryEntry[] = [
    {
      employeeName: `${employee?.firstName} ${employee?.lastName || ''}`,
      stage: 'Initiated',
      status: 'Approved',
      role: 'L1 Manager',
      resignationDate: employee?.resignationDetails?.dateOfResignation?.split('T')[0] || '-',
      approvedRelievingDate: employee?.resignationDetails?.relievingDateAsPerNotice?.split('T')[0] || '-',
      actionDate: '2025-05-05',
      resignationType: 'Voluntary',
      reasonForSeparation: 'Personal Reasons', // Simulate as API doesn't provide this
      absconding: false,
      comment: 'Approved without issues',
      attachment: 'attachment1.pdf', // Simulate
      attachmentCRIF: 'crif1.pdf', // Simulate
      actionName: 'Approve'
    },
    {
      employeeName: `${employee?.firstName} ${employee?.lastName || ''}`,
      stage: 'In Process',
      status: 'On Hold',
      role: 'HR Manager',
      resignationDate: employee?.resignationDetails?.dateOfResignation?.split('T')[0] || '-',
      approvedRelievingDate: employee?.resignationDetails?.relievingDateAsPerNotice?.split('T')[0] || '-',
      actionDate: '2025-05-10',
      resignationType: 'Voluntary',
      reasonForSeparation: 'Personal Reasons', // Simulate as API doesn't provide this
      absconding: false,
      comment: 'Pending no-dues clearance',
      attachment: 'attachment2.pdf', // Simulate
      attachmentCRIF: 'crif2.pdf', // Simulate
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
          {error || 'No data found'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Back Button */}
      {/* <Box sx={{ mb: 3 }}>
        <Tooltip title='Back to Listing'>
          <IconButton
            onClick={() => router.push('/resignation-data-listing')}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              mr: 2
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant='h4' component='span' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Resignation Details
        </Typography>
      </Box> */}

      {/* 1. Resignation Information */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main', fontSize: 'medium' }} />
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Resignation Information
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mt: 3 }}>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Resignation Code
            </Typography>
            <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
              {employee?.resignationDetails?.resignationCode || 'RES-001'} {/* API doesn't provide, simulate */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Creation Date
            </Typography>
            <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
              {employee?.resignationDetails.dateOfResignation?.split('T')[0] || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Stage
            </Typography>
            <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
              {employee?.resignationDetails?.stage || 'In Process'} {/* API doesn't provide, simulate */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Status
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color:
                  (employee?.resignationDetails?.status || 'Approved') === 'Approved'
                    ? 'success.main'
                    : (employee?.resignationDetails?.status || 'Approved') === 'Rejected'
                      ? 'error.main'
                      : 'warning.main',
                mt: 0.5
              }}
              fontWeight='bold'
            >
              {employee?.resignationDetails?.status || 'Approved'} {/* API doesn't provide, simulate */}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 2. Employee Information */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonOutlineOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Employee Information
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Employee Code
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.employeeCode}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Employee Name
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.firstName} {employee?.middleName || ''} {employee?.lastName}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Date of Joining
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.employeeDetails?.dateOfJoining?.split('T')[0] || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Group Date of Joining
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.employeeDetails?.groupDOJ?.split('T')[0] || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Designation
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.designation?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Spurious
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.employeeDetails?.employmentType === 'ESI No' ? 'No' : 'Yes'} {/* Based on employmentType */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Grade
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.grade?.name || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Band
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.band?.name || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Notice Period
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.resignationDetails?.noticePeriod}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Location
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.companyStructure?.branchCode || '-'} {/* Using branchCode as location */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Organization Unit
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.department?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              L1 Manager
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.managementHierarchy?.l1Manager || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              L2 Manager
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.managementHierarchy?.l2Manager || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              HR Manager
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.managementHierarchy?.hrManager || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Official Email ID
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.officeEmailAddress || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Personal Email ID
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.personalEmailAddress || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Confirmation Status
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.employeeDetails?.confirmationStatus || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Relieving Date as per Policy
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.resignationDetails?.relievingDateAsPerNotice?.split('T')[0] || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Leave Balance on LWD
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.leaveBalanceOnLWD || '10 days'} {/* API doesn't provide, simulate */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Correspondence Email
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.personalEmailAddress || '-'} {/* Use personalEmailAddress as correspondence */}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Correspondence Number
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {employee?.emergencyContact?.emergencyContactMobilePhone || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Correspondence Address
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {[
                employee?.address?.residenceAddressLine1,
                employee?.address?.residenceAddressLine2,
                employee?.address?.residenceCity,
                employee?.address?.residenceState,
                employee?.address?.residenceCountry,
                employee?.address?.residencePostalCode // Fixed typo: resignationPostalCode to residencePostalCode
              ]
                .filter(Boolean)
                .join(', ') || '-'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 3. Tab Section */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Details
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '.MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            },
            '.MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab label='Relieving Info' />
          <Tab label='No Dues Clearance' />
          <Tab label='F&F Settlement' />
          <Tab label='History' />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant='body1' sx={{ mb: 1, color: 'text.primary' }}>
              <strong>Relieving Date:</strong> {relievingInfo.relievingDate}
            </Typography>
            <Typography variant='body1' sx={{ mb: 1, color: 'text.primary' }}>
              <strong>Notice Period Served:</strong> {relievingInfo.noticePeriodServed}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.primary' }}>
              <strong>Last Working Day:</strong> {relievingInfo.lastWorkingDay}
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant='body1' sx={{ mb: 1, color: 'text.primary' }}>
              <strong>Department Clearance:</strong> {noDuesClearance.departmentClearance}
            </Typography>
            <Typography variant='body1' sx={{ mb: 1, color: 'text.primary' }}>
              <strong>IT Clearance:</strong> {noDuesClearance.itClearance}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.primary' }}>
              <strong>Finance Clearance:</strong> {noDuesClearance.financeClearance}
            </Typography>
          </Box>
        )}
        {tabValue === 2 && (
          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant='body1' sx={{ mb: 1, color: 'text.primary' }}>
              <strong>Settlement Amount:</strong> {finalSettlement.settlementAmount}
            </Typography>
            <Typography variant='body1' sx={{ mb: 1, color: 'text.primary' }}>
              <strong>Settlement Date:</strong> {finalSettlement.settlementDate}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.primary' }}>
              <strong>Status:</strong> {finalSettlement.status}
            </Typography>
          </Box>
        )}
        {tabValue === 3 && (
          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            {history.map((entry, index) => (
              <Box key={index} sx={{ mb: 2, borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}>
                <Typography variant='body1' sx={{ color: 'text.primary' }}>
                  <strong>{entry.action}</strong> on {entry.date} by {entry.by}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Card>

      {/* 4. Survey Info */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Survey Info
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Survey Name
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {surveyInfo.surveyName}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Assignee
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {surveyInfo.assignee}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              Initial Date
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
              {surveyInfo.initialDate}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
              View Link
            </Typography>
            <Button
              // variant='contained'
              // color='primary'
              href={surveyInfo.viewLink}

              // sx={{
              //   mt: 0.5,
              //   textTransform: 'none',
              //   borderRadius: 1,
              //   boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              //   '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }
              // }}
            >
              View Survey
            </Button>
          </Box>
        </Box>
      </Card>

      {/* 5. Approval History Table */}
      <Card
        sx={{
          p: 3,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Approval History
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Employee Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Stage</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Resignation Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Approved Relieving Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Action Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Resignation Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Reason for Separation</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Absconding</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Comment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Attachment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Attachment CRIF</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Action Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvalHistory.map((entry, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <TableCell sx={{ color: 'text.primary' }}>{entry.employeeName}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.stage}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      color={
                        entry.status === 'Approved' ? 'success' : entry.status === 'Rejected' ? 'error' : 'warning'
                      }
                      size='small'
                      sx={{
                        color: 'white', // Set the text color to white
                        // Ensure the background color contrast is maintained
                        bgcolor:
                          entry.status === 'Approved'
                            ? 'success.main'
                            : entry.status === 'Rejected'
                              ? 'error.main'
                              : 'warning.main'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.role}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.resignationDate}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.approvedRelievingDate}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.actionDate}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.resignationType}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.reasonForSeparation}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.absconding ? 'Yes' : 'No'}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.comment}</TableCell>
                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      href={entry.attachment}
                      sx={{
                        textTransform: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Download
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      href={entry.attachmentCRIF}
                      sx={{
                        textTransform: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Download
                    </Button>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{entry.actionName}</TableCell>
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
