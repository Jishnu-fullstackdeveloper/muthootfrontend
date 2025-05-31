'use client'
import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  TextField,
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
  Tooltip,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HistoryIcon from '@mui/icons-material/History'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getPermissionRenderConfig } from '@/utils/functions'
import withPermission from '@/hocs/withPermission'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import type { RootState, AppDispatch } from '@/redux/store'
import { fetchEmployeeById } from '@/redux/ResignationDataListing/ResignationDataListingSlice' // Still needed for main employee
import { fetchUserById } from '@/redux/UserManagment/userManagementSlice' // New import for approver details
import type { ResignedEmployee } from '@/types/resignationDataListing'
import type { VacancyManagementState, VacancyRequest } from '@/types/vacancyManagement'
import { fetchVacancyRequests, updateVacancyRequestStatus } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'

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

// Interface for approver details (to store fetched user data)
interface ApproverDetails {
  approverId: string
  name: string
  employeeCode: string
}

const ResignationDetailsPage = () => {
  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()

  const searchParams = useSearchParams()
  const employeeId = searchParams.get('id') // Get the employee ID from the URL query params
  const permissions = getPermissionRenderConfig()

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const [selectedAction, setSelectedAction] = useState<
    'APPROVED' | 'REJECTED' | 'FREEZED' | 'UNFREEZED' | 'TRANSFER' | null
  >(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<string>('')

  const {
    selectedEmployee: employee,
    loading,
    error
  } = useAppSelector((state: RootState) => state.resignationDataListingReducer)

  const {
    vacancyRequestListLoading = false,
    vacancyRequestListSuccess = false,
    vacancyRequestListData = null,
    vacancyRequestListTotal = 0,
    vacancyRequestListFailure = false,
    vacancyRequestListFailureMessage = '',
    updateVacancyRequestStatusLoading = false,
    autoApproveVacancyRequestsLoading = false
  } = useAppSelector((state: RootState) => state.vacancyManagementReducer) as VacancyManagementState

  // Add selector for userManagementReducer to access fetchUserById state (though not directly used here)
  const { userManagementData, isUserManagementLoading } = useAppSelector(
    (state: RootState) => state.UserManagementReducer
  )

  const vacancyRequestList = vacancyRequestListData?.data[0] || {}

  const [tabValue, setTabValue] = useState(0)
  const [approverDetails, setApproverDetails] = useState<ApproverDetails[]>([])

  // Fetch employee details by ID (this still uses fetchResignedEmployeeById)
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId))
    }
  }, [dispatch, employeeId])

  // Fetch vacancy requests with employeeId
  useEffect(() => {
    if (employeeId) {
      const params: {
        page: number
        limit: number
        search?: string
        employeeId?: string
      } = {
        page: 1, // Fixed page
        limit: 10, // Fixed limit
        employeeId: employeeId,
        search: '' // Empty search as not needed
      }

      dispatch(fetchVacancyRequests(params))
    }
  }, [dispatch, employeeId])

  // Fetch approver details for each approverId in approvalStatus using fetchUserById
  useEffect(() => {
    if (vacancyRequestListData?.data?.length) {
      const approvalStatusArray = vacancyRequestListData.data[0]?.approvalStatus || []

      const approverIds = approvalStatusArray.map((status: any, index: number) => {
        const level = Object.keys(status)[0]

        return status[level].approverId
      })

      // Fetch user details for each approverId using fetchUserById
      const fetchApprovers = async () => {
        const details: ApproverDetails[] = []

        for (const approverId of approverIds) {
          try {
            const res = await dispatch(fetchUserById(approverId)).unwrap()
            const userData = res.data

            // Assuming fetchUserById returns user data with firstName, lastName, and employeeCode
            details.push({
              approverId,
              name: `${userData.firstName} ${userData.lastName || ''}`,
              employeeCode: userData.employeeCode || 'N/A'
            })
          } catch (err) {
            console.error(`Failed to fetch user details for approverId ${approverId}:`, err)
            details.push({
              approverId,
              name: 'Unknown',
              employeeCode: 'N/A'
            })
          }
        }

        setApproverDetails(details)
      }

      fetchApprovers()
    }
  }, [dispatch, vacancyRequestListData])

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle opening the confirmation dialog
  const handleOpenDialog = (id: string, action: 'APPROVED' | 'REJECTED' | 'FREEZED' | 'UNFREEZED' | 'TRANSFER') => {
    setSelectedId(id)
    setSelectedAction(action)
    setNotes('') // Reset notes when opening the dialog
    setIsDialogOpen(true)
  }

  // Handle closing the confirmation dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedId(null)
    setSelectedAction(null)
    setNotes('')
  }

  // Consolidated handler for all status actions
  const handleConfirmAction = async () => {
    if (!selectedId || !selectedAction) return

    if (selectedAction === 'TRANSFER') {
      toast.info('Transfer action initiated', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      handleCloseDialog()

      return
    }

    // const newStatus = selectedAction === 'UNFREEZED' ? 'PENDING' : selectedAction
    const newStatus = selectedAction

    try {
      await dispatch(
        updateVacancyRequestStatus({
          id: selectedId,
          approverId: '71d82781-4cd1-4260-abdb-a4955e789bea', // Replace with actual approverId
          status: newStatus,
          notes // Include the notes from the text field
        })
      ).unwrap()

      // If the dispatch is successful, refresh the list and show success toast
      if (employeeId) {
        const params: {
          page: number
          limit: number
          search?: string
          employeeId?: string
        } = {
          page: 1, // Fixed page
          limit: 10, // Fixed limit
          employeeId: employeeId,
          search: '' // Empty search as not needed
        }

        dispatch(fetchVacancyRequests(params))
      }

      toast.success(`Vacancy request ${newStatus.toLowerCase()} successfully`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      handleCloseDialog()
    } catch (err: any) {
      // If the dispatch fails, show error toast
      console.log('Error updating status:', err)
      toast.error(`Failed to update status to ${newStatus}: ${err}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      handleCloseDialog()
    }
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
        <CircularProgress color='primary' />
      </Box>
    )
  }

  if (error || !employee) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='h6' color='secondary'>
          {'No resigned employee data found'}
        </Typography>
      </Box>
    )
  }

  // Prepare approval status data for the stepper and approver details
  const approvalStatus = vacancyRequestListData?.data?.[0]?.approvalStatus || []

  const budget = {
    approvalStatusLevel: approvalStatus.map((status: any, index: number) => {
      const level = Object.keys(status)[0]
      const approverInfo = status[level]
      const approverDetail = approverDetails.find(detail => detail.approverId === approverInfo.approverId)

      return {
        label: approverInfo.approver,
        status: approverInfo.status,
        designation: `${approverInfo.approver} Approval`,
        approverName: approverDetail?.name || 'Unknown',
        employeeCode: approverDetail?.employeeCode || 'N/A'
      }
    })
  }

  // Calculate activeStep based on the approval status
  const activeStep =
    budget.approvalStatusLevel?.reduce((acc: number, step: any, index: number) => {
      if (step.status === 'PENDING') return acc

      return index + 1
    }, 0) || 0

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          {/* {selectedAction && (
                 <Typography color='warning.main' gutterBottom>
                   This is ok for {selectedAction === 'UNFREEZED' ? 'PENDING' : selectedAction}?
                 </Typography>
               )} */}
          {/* {selectedAction !== 'TRANSFER' && ( */}
          <TextField
            label='Reason/Notes'
            variant='outlined'
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
          {/* )} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color='primary' disabled={updateVacancyRequestStatusLoading}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main', fontSize: 'medium' }} />
            <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Resignation Information
            </Typography>
          </Box>
          {withPermission(() => (
            <Box>
              {vacancyRequestList?.status === 'PENDING' && (
                <>
                  <Tooltip title='Approve'>
                    <IconButton
                      color='success'
                      onClick={() => handleOpenDialog(vacancyRequestList?.id, 'APPROVED')}
                      disabled={updateVacancyRequestStatusLoading}
                    >
                      <CheckCircleOutlineIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Reject'>
                    <IconButton
                      color='error'
                      onClick={() => handleOpenDialog(vacancyRequestList?.id, 'REJECTED')}
                      disabled={updateVacancyRequestStatusLoading}
                    >
                      <CancelOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Freeze'>
                    <IconButton
                      color='info'
                      onClick={() => handleOpenDialog(vacancyRequestList?.id, 'FREEZED')}
                      disabled={updateVacancyRequestStatusLoading}
                    >
                      <PauseCircleOutlineIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Transfer'>
                    <IconButton
                      color='primary'
                      onClick={() => handleOpenDialog(vacancyRequestList?.id, 'TRANSFER')}
                      disabled={updateVacancyRequestStatusLoading}
                    >
                      <SwapHorizIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {vacancyRequestList?.status === 'FREEZED' && (
                <Tooltip title='Un-Freeze'>
                  <IconButton
                    color='warning'
                    onClick={() => handleOpenDialog(vacancyRequestList?.id, 'UNFREEZED')}
                    disabled={updateVacancyRequestStatusLoading}
                  >
                    <PlayCircleOutlineIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))({ individualPermission: permissions?.HIRING_VACANCY_VACANCYREQUEST_APPROVAL })}
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
              {employee?.resignationDetails?.dateOfResignation?.split('T')[0] || '-'}
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
                  (vacancyRequestList?.status || 'APPROVED') === 'APPROVED'
                    ? 'success.main'
                    : (vacancyRequestList?.status || 'AUTO APPROVED') === 'AUTO APPROVED'
                      ? 'success.main'
                      : (vacancyRequestList?.status || 'REJECTED') === 'REJECTED'
                        ? 'error.main'
                        : 'warning.main',
                mt: 0.5
              }}
              fontWeight='bold'
            >
              {vacancyRequestList?.status || 'Approved'} {/* API doesn't provide, simulate */}
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
                employee?.address?.residencePostalCode
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
            <Button href={surveyInfo.viewLink}>View Survey</Button>
          </Box>
        </Box>
      </Card>

      {/* 5. Approval Status Section */}

      {budget?.approvalStatusLevel?.length > 0 &&
        withPermission(() => (
          <Card
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white'
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              Approval Status
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ px: { xs: 2, md: 5 }, py: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {budget?.approvalStatusLevel?.map((step: any, index: number) => (
                  <Step key={index}>
                    <StepLabel
                      error={step.status === 'Rejected'}
                      sx={{
                        '& .MuiStepLabel-label': {
                          color:
                            step.status === 'Completed'
                              ? 'success.main'
                              : step.status === 'Rejected'
                                ? 'error.main'
                                : 'warning.main',
                          fontWeight: 500
                        }
                      }}
                    >
                      Level {index + 1}: {step.label} - {step.status}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Approver Details */}
            <Box
              sx={{
                mt: 4,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(250px, 1fr))' },
                gap: 2
              }}
            >
              {budget?.approvalStatusLevel?.map((approver: any, index: number) => (
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Level {index + 1}: {approver.designation}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <strong>Name:</strong> {approver.approverName}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <strong>Employee Code:</strong> {approver.employeeCode}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        color:
                          approver.status === 'Rejected'
                            ? '#d32f2f'
                            : approver.status === 'Completed'
                              ? '#2e7d32'
                              : '#ed6c02',
                        fontWeight: 500
                      }}
                    >
                      {approver.status}
                    </span>
                  </Typography>
                </Card>
              ))}
            </Box>
          </Card>
        ))({ individualPermission: permissions?.HIRING_VACANCY_VACANCYREQUEST_APPROVAL })}

      {/* 6. Approval History Table (Commented Out) */}
      {/* <Card
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
      </Card> */}
    </Box>
  )
}

export default ResignationDetailsPage
