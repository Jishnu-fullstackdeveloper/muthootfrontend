'use client'

import React, { useState, useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import {
  Box,
  Paper,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  DialogActions,
  Button,
  TextField,
  Card
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ApprovalIcon from '@mui/icons-material/Approval'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchVacancyById, updateVacancyStatus } from '@/redux/VacancyManagementAPI/vacancyManagementSlice'
import { fetchResignedEmployees } from '@/redux/ResignationDataListing/ResignationDataListingSlice'
import { fetchUserById } from '@/redux/UserManagment/userManagementSlice'
import type { VacancyManagementState } from '@/types/vacancyManagement'

// import type { ResignedEmployeesState } from '@/types/resignationDataListing'
// import type { UserManagementState } from '@/types/users'
import { getUserId, getPermissionRenderConfig } from '@/utils/functions'
import withPermission from '@/hocs/withPermission'

interface Props {
  vacancyTab: 'vacancy-details' | 'jd-details'
}

interface ApproverDetails {
  approverId: string
  name: string
  employeeCode: string
}

const tabMapping: { [key: string]: number } = {
  'vacancy-details': 0,
  'jd-details': 1
}

const JobVacancyView: React.FC<Props> = ({ vacancyTab }) => {
  // const router = useRouter()
  const searchParams = useSearchParams()
  const vacancyId = searchParams.get('id')
  const dispatch = useAppDispatch()
  const userId = getUserId()
  const permissions = getPermissionRenderConfig()

  const [activeTab] = useState<number>(tabMapping[vacancyTab] || 0)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<'APPROVED' | 'FREEZED' | null>(null)
  const [notes, setNotes] = useState<string>('')
  const [approverDetails, setApproverDetails] = useState<ApproverDetails[]>([])
  const [resignedEmployee, setResignedEmployee] = useState<any | null>(null)

  // Redux selectors
  const { vacancyDetailsData, vacancyDetailsLoading, vacancyDetailsFailureMessage, updateVacancyStatusLoading } =
    useAppSelector(state => state.vacancyManagementReducer) as VacancyManagementState

  // const { resignedEmployeesData, resignedEmployeesLoading, resignedEmployeesFailureMessage } = useAppSelector(
  //   state => state.resignationDataListingReducer
  // ) as ResignedEmployeesState

  // const { userManagementData, isUserManagementLoading } = useAppSelector(
  //   state => state.UserManagementReducer
  // ) as UserManagementState

  const vacancy = vacancyDetailsData?.data

  // Fetch vacancy data
  useEffect(() => {
    if (vacancyId) {
      dispatch(fetchVacancyById({ id: vacancyId }))
    } else {
      console.warn('No vacancy ID provided in URL')
      toast.error('Invalid vacancy ID', { position: 'top-right', autoClose: 3000 })
    }
  }, [dispatch, vacancyId])

  useEffect(() => {
    if (vacancy?.employeeCode) {
      dispatch(
        fetchResignedEmployees({
          page: 1,
          limit: 10,
          employeeCode: vacancy.employeeCode
        })
      )
        .unwrap()
        .then(res => {
          console.log(res.employees[0])
          setResignedEmployee(res.employees[0]) // ✅ store in state
        })
    }
  }, [dispatch, vacancy?.employeeCode])

  // Fetch approver details for approvalStatus
  useEffect(() => {
    if (vacancy?.approvalStatus?.length) {
      const approverIds = vacancy.approvalStatus.map(status => status.approverId)

      const fetchApprovers = async () => {
        const details: ApproverDetails[] = []

        for (const approverId of approverIds) {
          try {
            const res = await dispatch(fetchUserById(approverId)).unwrap()
            const userData = res.data

            details.push({
              approverId,
              name: `${userData.firstName} ${userData.lastName || ''}`.trim(),
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
  }, [dispatch, vacancy?.approvalStatus])

  // // Handle tab change
  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setActiveTab(newValue)
  //   const paths = ['vacancy-details', 'jd-details']

  //   router.push(`${paths[newValue]}?id=${vacancyId}`)
  // }

  // Handle dialog open for actions
  const handleOpenDialog = (action: 'APPROVED' | 'FREEZED') => {
    if (!vacancyId) return
    setSelectedAction(action)
    setNotes('')
    setIsDialogOpen(true)
  }

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedAction(null)
    setNotes('')
  }

  // Handle status update
  const handleConfirmAction = async () => {
    if (!vacancyId || !selectedAction) return

    try {
      await dispatch(
        updateVacancyStatus({
          ids: [vacancyId],
          status: selectedAction
        })
      ).unwrap()
      toast.success(`Vacancy ${selectedAction.toLowerCase()} successfully`, {
        position: 'top-right',
        autoClose: 3000
      })
      dispatch(fetchVacancyById({ id: vacancyId })) // Refresh vacancy data
    } catch (err: any) {
      toast.error(`Failed to update vacancy: ${err}`, { position: 'top-right', autoClose: 3000 })
    } finally {
      handleCloseDialog()
    }
  }

  // Check if user can take action
  const canTakeAction =
    vacancy?.approvalStatus?.some(status => status.approverId === userId && status.approvalStatus === 'PENDING') &&
    (vacancy?.status === 'PENDING' || vacancy?.status === 'FREEZED')

  // Approval status for stepper
  const approvalStatus = vacancy?.approvalStatus || []
  const sortedApprovalStatus = [...approvalStatus].sort((a, b) => a.level - b.level)

  const budget = {
    approvalStatusLevel: sortedApprovalStatus.map(status => {
      const approverDetail = approverDetails.find(detail => detail.approverId === status.approverId)
      const formattedApprover = status.approver.replace(/_/g, ' ')

      return {
        label: `Level ${status.level}: ${formattedApprover}`,
        status: status.approvalStatus,
        designation: `${formattedApprover} Approval`,
        approverName: approverDetail?.name || 'Unknown',
        employeeCode: approverDetail?.employeeCode || 'N/A'
      }
    })
  }

  const activeStep =
    budget.approvalStatusLevel?.reduce((acc: number, step: any, index: number) => {
      if (step.status === 'PENDING') return acc

      return index + 1
    }, 0) || 0

  // Loading and error states
  if (vacancyDetailsLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress color='primary' />
        <Typography variant='h6' mt={2}>
          Loading vacancy details...
        </Typography>
      </Box>
    )
  }

  if (vacancyDetailsFailureMessage) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant='h6' color='error'>
          Error: {vacancyDetailsFailureMessage}
        </Typography>
        <Button
          variant='text'
          onClick={() => {
            if (vacancyId) dispatch(fetchVacancyById({ id: vacancyId }))
            if (vacancy?.employeeCode)
              dispatch(fetchResignedEmployees({ page: 1, limit: 1, employeeCode: vacancy.employeeCode }))
          }}
        >
          Retry
        </Button>
      </Box>
    )
  }

  if (!vacancy) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant='h6'>No vacancy data available</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ToastContainer position='top-right' autoClose={3000} />
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2, bgcolor: 'white' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h4' fontWeight='bold' color='primary'>
              {vacancy.jobTitle}
            </Typography>
            <Chip
              label={vacancy.status}
              size='small'
              variant='tonal'
              color={
                vacancy.status === 'Open'
                  ? 'success'
                  : vacancy.status === 'Closed'
                    ? 'error'
                    : vacancy.status === 'FREEZED'
                      ? 'info'
                      : vacancy.status === 'PENDING'
                        ? 'warning'
                        : 'default'
              }
              sx={{ ml: 2, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}
            />
          </Box>
          {withPermission(() =>
            canTakeAction ? (
              <Box>
                <Tooltip title='Approve'>
                  <IconButton
                    color='success'
                    onClick={() => handleOpenDialog('APPROVED')}
                    disabled={updateVacancyStatusLoading}
                  >
                    <CheckCircleOutlineIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Freeze'>
                  <IconButton
                    color='info'
                    onClick={() => handleOpenDialog('FREEZED')}
                    disabled={updateVacancyStatusLoading}
                  >
                    <PauseCircleOutlineIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : null
          )({ individualPermission: permissions?.HIRING_VACANCY_VACANCYREQUEST_APPROVAL })}
        </Box>

        {/* Tabs */}
        {/* <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              '&.Mui-selected': { color: 'primary.main' }
            },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' }
          }}
        >
          <Tab label='Vacancy Details' />
          <Tab label='JD Details' />
        </Tabs> */}

        {/* Confirmation Dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color='primary' disabled={updateVacancyStatusLoading}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {/* Application Details Accordion */}
            <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant='h6' fontWeight='bold'>
                    Vacancy Details
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Designation: <strong>{vacancy.designation}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Job Role: <strong>{vacancy.jobRole}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Grade: <strong>{vacancy.grade}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Band: <strong>{vacancy.band}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Openings: <strong>{vacancy.openings}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Campus/Lateral: <strong>{vacancy.campusOrLateral}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Employee Category: <strong>{vacancy.employeeCategory}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Employee Type: <strong>{vacancy.employeeType}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Hiring Manager: <strong>{vacancy.hiringManager}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Company: <strong>{vacancy.company}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Business Unit: <strong>{vacancy.businessUnit}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Department: <strong>{vacancy.department}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Starting Date: <strong>{vacancy.startingDate?.split('T')[0]}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Closing Date: <strong>{vacancy.closingDate?.split('T')[0]}</strong>
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Location Details Accordion */}
            <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant='h6' fontWeight='bold'>
                    Location Details
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Territory: <strong>{vacancy.territory}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Region: <strong>{vacancy.region}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Area: <strong>{vacancy.area}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Cluster: <strong>{vacancy.cluster}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Branch: <strong>{vacancy.branch}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Branch Code: <strong>{vacancy.branchCode}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    City: <strong>{vacancy.city}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    State: <strong>{vacancy.state}</strong>
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Origin: <strong>{vacancy.origin}</strong>
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Resigned Employee Accordion */}
            <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonOutlineOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant='h6' fontWeight='bold'>
                    Resigned Employee
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 3 }} />
                {resignedEmployee ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Employee Code
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee?.employeeCode}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Employee Name
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.firstName} {resignedEmployee.middleName || ''} {resignedEmployee.lastName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Date of Joining
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.employeeDetails?.dateOfJoining?.split('T')[0] || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Group Date of Joining
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.employeeDetails?.groupDOJ?.split('T')[0] || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Designation
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.designation?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Spurious
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.employeeDetails?.employmentType === 'ESI No' ? 'No' : 'Yes'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Grade
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.grade?.name || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Band
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.band?.name || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Notice Period
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.resignationDetails?.noticePeriod || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Location
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.companyStructure?.branchCode || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Organization Unit
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.department?.name || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        L1 Manager
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.managementHierarchy?.l1Manager?.replace(/_/g, ' ') || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        L2 Manager
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.managementHierarchy?.l2Manager?.replace(/_/g, ' ') || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        HR Manager
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.managementHierarchy?.hrManager?.replace(/_/g, ' ') || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Official Email ID
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.officeEmailAddress || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Personal Email ID
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.personalEmailAddress || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Confirmation Status
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.employeeDetails?.confirmationStatus || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Relieving Date as per Policy
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.resignationDetails?.relievingDateAsPerNotice?.split('T')[0] || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Leave Balance on LWD
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.leaveBalanceOnLWD || '10 days'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Correspondence Email
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.personalEmailAddress || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Correspondence Number
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {resignedEmployee.emergencyContact?.emergencyContactMobilePhone || '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.9rem' }}>
                        Correspondence Address
                      </Typography>
                      <Typography variant='body1' fontWeight='bold' sx={{ color: 'text.primary', mt: 0.5 }}>
                        {[
                          resignedEmployee.address?.residenceAddressLine1,
                          resignedEmployee.address?.residenceAddressLine2,
                          resignedEmployee.address?.residenceCity,
                          resignedEmployee.address?.residenceState,
                          resignedEmployee.address?.residenceCountry,
                          resignedEmployee.address?.residencePostalCode
                        ]
                          .filter(Boolean)
                          .join(', ') || '-'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant='body1' color='text.secondary'>
                    No resigned employee data available
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Approval Status Accordion */}
            {budget.approvalStatusLevel?.length > 0 &&
              withPermission(() => (
                <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ApprovalIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant='h6' fontWeight='bold'>
                        Approval Status
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ px: { xs: 2, md: 5 }, py: 3 }}>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {budget.approvalStatusLevel.map((step: any, index: number) => (
                          <Step key={index}>
                            <StepLabel
                              error={step.status === 'REJECTED'}
                              sx={{
                                '& .MuiStepLabel-label': {
                                  color:
                                    step.status === 'APPROVED'
                                      ? 'success.main'
                                      : step.status === 'REJECTED'
                                        ? 'error.main'
                                        : 'warning.main',
                                  fontWeight: 500
                                }
                              }}
                            >
                              {step.label} - {step.status}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                    <Box
                      sx={{
                        mt: 4,
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(250px, 1fr))' },
                        gap: 2
                      }}
                    >
                      {budget.approvalStatusLevel.map((approver: any, index: number) => (
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
                            {approver.designation}
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
                                  approver.status === 'REJECTED'
                                    ? '#d32f2f'
                                    : approver.status === 'APPROVED'
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
                  </AccordionDetails>
                </Accordion>
              ))({ individualPermission: permissions?.HIRING_VACANCY_VACANCYREQUEST_APPROVAL })}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant='h6' fontWeight='bold' color='primary' gutterBottom>
              Job Description
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {vacancy.jobDescription || 'Not provided'}
            </Typography>
            <Typography mt={2} variant='h6' fontWeight='bold' gutterBottom>
              Role Summary
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {vacancy.roleSummary || 'Not provided'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default JobVacancyView
