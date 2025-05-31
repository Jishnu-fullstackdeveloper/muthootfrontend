'use client'

// React Imports
import React, { useEffect, useMemo } from 'react'

// Next Imports
import { useRouter, usePathname } from 'next/navigation'

// Redux Imports
import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  Tooltip,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material'

import { ArrowBack, Business, People, CalendarToday, Work } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getPermissionRenderConfig, getUserId } from '@/utils/functions'
import {
  fetchBudgetIncreaseRequestById,
  approveRejectBudgetIncreaseRequest
} from '@/redux/BudgetManagement/BudgetManagementSlice'
import { fetchUser } from '@/redux/Approvals/approvalsSlice'
import type { RootState } from '@/redux/store'

// MUI Imports

// Types
import type { Budget } from '@/types/budget'
import { BudgetData } from '@/utils/sampleData/BudgetManagement/BudgetDetailsData'

// HOC for Permissions
import withPermission from '@/hocs/withPermission'
import Department from './Department'

type Props = {
  mode: string
  id: string
  jobTitle: string
}

const ViewBudget: React.FC<Props> = ({ mode, id, jobTitle }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  jobTitle

  const permissions = getPermissionRenderConfig()

  // Redux State
  const {
    fetchBudgetIncreaseRequestByIdLoading,
    fetchBudgetIncreaseRequestByIdData,
    fetchBudgetIncreaseRequestByIdFailure,
    fetchBudgetIncreaseRequestByIdFailureMessage
  } = useAppSelector((state: RootState) => state.budgetManagementReducer) as any

  const { fetchUserData } = useAppSelector((state: RootState) => state.approvalsReducer) as any

  const userId = getUserId()
  const approverDesignation = fetchUserData?.designation || ''

  // Check if the last segment of the path is "department"
  const isDepartmentRoute = pathname.split('/').pop() === 'department'

  mode
  id

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchBudgetIncreaseRequestById({ id }))
  }, [dispatch, id])

  // Memoized budget data
  const budget = useMemo((): Budget => {
    // Use API data if available, fallback to mock data if loading or failed
    return fetchBudgetIncreaseRequestByIdData?.data || BudgetData
  }, [fetchBudgetIncreaseRequestByIdData])

  // Fetch user data
  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId as string))
    }
  }, [userId, dispatch])

  // Handle Approve
  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      if (!budget?.approvalRequestId) throw new Error('No approval request ID found')
      await dispatch(
        approveRejectBudgetIncreaseRequest({
          approvalRequestId: budget.approvalRequestId,
          status: 'APPROVED',
          approverId: userId,
          approverDesignation: approverDesignation.toUpperCase()
        })
      ).unwrap()
      dispatch(fetchBudgetIncreaseRequestById({ id })) // Refetch data after approval
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  // Handle Reject
  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      if (!budget?.approvalRequestId) throw new Error('No approval request ID found')
      await dispatch(
        approveRejectBudgetIncreaseRequest({
          approvalRequestId: budget.approvalRequestId,
          status: 'REJECTED',
          approverId: userId,
          approverDesignation: approverDesignation.toUpperCase()
        })
      ).unwrap()
      dispatch(fetchBudgetIncreaseRequestById({ id })) // Refetch data after rejection
      router.push('/budget-management')
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  // Determine active step based on approvalStatus
  const activeStep = budget?.approvalStatusLevel?.findIndex(step => step.status === 'Pending') ?? 0

  // Conditionally render based on route
  if (isDepartmentRoute) {
    return <Department />
  }

  // Render loading or error state if applicable
  if (fetchBudgetIncreaseRequestByIdLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (fetchBudgetIncreaseRequestByIdFailure) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant='h6' color='error'>
          {fetchBudgetIncreaseRequestByIdFailureMessage || 'Failed to load budget details'}
        </Typography>
      </Box>
    )
  }

  return (
    <Paper
      sx={{
        minHeight: '80vh',
        padding: { xs: 2, md: 4 },
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Header Section */}
      <Box display='flex' alignItems='center' justifyContent='space-between' mb={3}>
        <Button
          startIcon={<ArrowBack />}
          variant='text'
          onClick={() => router.back()}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          Back to Budget List
        </Button>
      </Box>

      {/* Budget Overview Section */}
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
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', md: 'center' }}
          mb={2}
        >
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              {budget?.jobTitle || 'N/A'}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary', mb: 1 }}>
              Department: {budget?.department || 'N/A'}
            </Typography>
            <Chip
              label={budget?.status || 'N/A'}
              size='small'
              sx={{
                fontWeight: 500,
                textTransform: 'uppercase',
                bgcolor:
                  budget?.status === 'APPROVED'
                    ? 'success.light'
                    : budget?.status === 'REJECTED'
                      ? 'error.light'
                      : 'warning.light',
                color: 'white'
              }}
            />
          </Box>
          {withPermission(() => (
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
              <Tooltip title='Approve Budget Request'>
                <Button
                  variant='outlined'
                  color='success'
                  onClick={handleApprove}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1,
                    px: 3,
                    py: 1,
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                  startIcon={<i className='tabler-check' />}
                >
                  Approve
                </Button>
              </Tooltip>
              <Tooltip title='Reject Budget Request'>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={handleReject}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1,
                    px: 3,
                    py: 1,
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                  }}
                  startIcon={<i className='tabler-playstation-x' />}
                >
                  Reject
                </Button>
              </Tooltip>
            </Box>
          ))({ individualPermission: permissions?.HIRING_BUDGET_APPROVAL })}
        </Box>
      </Card>

      {/* Budget Details Section */}
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
          Budget Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Work sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Job Title:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.jobTitle || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <People sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                No. of Openings:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.openings || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Business sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Department:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.department || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Start Date:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.startingDate ? new Date(budget.startingDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Closing Date:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.closingDate ? new Date(budget.closingDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Experience Range:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.experienceMin && budget?.experienceMax
                  ? `${budget.experienceMin} - ${budget.experienceMax} years`
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Hiring Manager:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.hiringManager || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Employee Type:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.employeeType || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Budget Year:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.yearOfBudget || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Location Details Section */}
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
          Location Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Company:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.company || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Branch:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.branchName} ({budget?.branchCode || 'N/A'})
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                State:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.state || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Territory:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.territory || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Zone:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.zone || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Region:
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {budget?.region || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Approval Status Section (only if approvalStatus is not empty) */}
      {budget?.approvalStatus?.length > 0 && (
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
              {budget?.approvalStatusLevel?.map((step, index) => (
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
            {budget?.approvalStatusLevel?.map((approver, index) => (
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
      )}

      {/* Additional Details Section */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'white'
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
          Additional Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant='body1' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {budget?.additionalDetails || 'No additional details provided.'}
        </Typography>
      </Card>
    </Paper>
  )
}

export default ViewBudget
