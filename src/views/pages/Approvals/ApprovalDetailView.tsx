'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { Box, Card, Typography, Stack, Divider } from '@mui/material'
import {
  DescriptionOutlined as DescriptionIcon,
  CheckCircleOutline as ApprovedIcon,
  CancelOutlined as RejectedIcon,
  HourglassEmptyOutlined as PendingIcon,
  EventBusy as OverdueIcon,
  ArrowForwardOutlined as MoveToIcon
} from '@mui/icons-material'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import type { Approvals } from '@/types/approvalDashboard'

// Sample data for approvals
const sampleApprovals: Approvals[] = [
  {
    id: '1',
    categoryName: 'Vacancy Approval',
    description: 'Approval for new software engineer position in Q3 2025',
    approvedCount: 5,
    rejectedCount: 1,
    pendingCount: 2,
    overdue: '2025-06-15',
    moveTo: 'HR Review'
  },
  {
    id: '2',
    categoryName: 'Budget Approval',
    description: 'Approval for marketing campaign budget increase',
    approvedCount: 3,
    rejectedCount: 0,
    pendingCount: 4,
    overdue: null,
    moveTo: 'Finance Department'
  },
  {
    id: '3',
    categoryName: 'Project Approval',
    description: 'Approval for new AI product development project',
    approvedCount: 8,
    rejectedCount: 2,
    pendingCount: 1,
    overdue: '2025-07-01',
    moveTo: 'Executive Review'
  },
  {
    id: '4',
    categoryName: 'Travel Approval',
    description: 'Approval for team offsite in Singapore',
    approvedCount: 2,
    rejectedCount: 3,
    pendingCount: 0,
    overdue: null,
    moveTo: null
  }
]

const ApprovalDetail = () => {
  const params = useParams()
  const id = params.id as string
  const approval = sampleApprovals.find(approval => approval.id === id)

  //   const handleBackClick = () => {
  //     router.push(ROUTES.HIRING_MANAGEMENT.APPROVALS)
  //   }

  //   if (!approval) {
  //     return (
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           height: '100vh'
  //         }}
  //       >
  //         <Typography color='text.secondary' variant='h6'>
  //           No approval data found
  //         </Typography>
  //       </Box>
  //     )
  //   }

  return (
    <Box>
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
        theme='colored'
      />

      {/* Back button (commented out as per original) */}
      {/* <Button 
        variant='outlined' 
        startIcon={<BackIcon />} 
        onClick={handleBackClick} 
        sx={{ mb: 3 }}
      >
        Back to Approvals
      </Button> */}

      <Card
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid',
          borderLeftColor: 'primary.main'
        }}
      >
        <Typography
          variant='h5'
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Approval Category: {approval?.categoryName}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          <Box>
            <Typography
              variant='subtitle2'
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary'
              }}
            >
              <DescriptionIcon color='info' />
              Description
            </Typography>
            <Typography variant='body1' sx={{ pl: 4 }}>
              {approval?.description || 'No description provided'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <StatusChip icon={<ApprovedIcon />} color='success' label='Approved' value={approval?.approvedCount} />
            <StatusChip icon={<RejectedIcon />} color='error' label='Rejected' value={approval?.rejectedCount} />
            <StatusChip icon={<PendingIcon />} color='warning' label='Pending' value={approval?.pendingCount} />
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <DetailItem
              icon={<OverdueIcon />}
              label='Overdue'
              value={approval?.overdue ? new Date(approval.overdue).toLocaleDateString() : 'Not set'}
              color={approval?.overdue ? 'error' : 'text.secondary'}
            />
            <DetailItem
              icon={<MoveToIcon />}
              label='Move To'
              value={approval?.moveTo || 'Not specified'}
              color={approval?.moveTo ? 'info' : 'text.secondary'}
            />
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}

// Reusable Status Chip Component
const StatusChip = ({
  icon,
  color,
  label,
  value
}: {
  icon: React.ReactNode
  color: 'success' | 'error' | 'warning' | 'info'
  label: string
  value: number
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {React.cloneElement(icon as React.ReactElement, { color, fontSize: 'medium' })}
    <Box>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='h6' color={`${color}.main`} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  </Box>
)

// Reusable Detail Item Component
const DetailItem = ({
  icon,
  label,
  value,
  color = 'text.secondary'
}: {
  icon: React.ReactNode
  label: string
  value: string
  color?: 'success' | 'error' | 'warning' | 'info' | 'text.secondary'
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {React.cloneElement(icon as React.ReactElement, {
      color: color === 'text.secondary' ? 'action' : color,
      fontSize: 'medium'
    })}
    <Box>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      <Typography
        variant='body1'
        color={color === 'text.secondary' ? 'text.primary' : `${color}.main`}
        fontWeight={500}
      >
        {value}
      </Typography>
    </Box>
  </Box>
)

export default ApprovalDetail
