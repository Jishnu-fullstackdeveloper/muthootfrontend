import React from 'react'

import { Box, Tooltip, IconButton } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import VisibilityIcon from '@mui/icons-material/Visibility'

import type { VacancyRequest } from '@/types/vacancyManagement'

interface ActionButtonsProps {
  row: { original: VacancyRequest }
  handleOpenDialog: (id: string, action: 'APPROVED' | 'REJECTED' | 'FREEZED' | 'UNFREEZED' | 'TRANSFER') => void
  handleViewEmployeeDetails: (employeeId: string) => void
  updateVacancyRequestStatusLoading: boolean
  userId: string
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  row,
  handleOpenDialog,
  handleViewEmployeeDetails,
  updateVacancyRequestStatusLoading,
  userId
}) => {
  const { status, approvalStatus, id, employeeId } = row.original

  // Find the current approver's status where approverId matches userId
  const currentApprover = (approvalStatus || []).find((status: any) => {
    const level = status.id ? status : Object.values(status)[0]

    return level.approverId === userId
  })

  const approverStatus = currentApprover
    ? currentApprover.id
      ? currentApprover.approvalStatus
      : Object.values(currentApprover)[0].status
    : null

  // Determine if actions should be enabled:
  // - approverStatus must be "PENDING"
  // - Overall status must be "PENDING" for Approve/Reject/Freeze/Transfer, or "FREEZED" for Un-Freeze
  const canTakeAction =
    approverStatus === 'PENDING' && (status === 'PENDING' || (status === 'FREEZED' && approverStatus === 'PENDING'))

  // Check if the first level of approval is pending (to decide which buttons to show)
  const firstLevelStatus = approvalStatus?.[0]
    ? approvalStatus[0].id
      ? approvalStatus[0].approvalStatus
      : Object.values(approvalStatus[0])[0].status
    : null

  const showPendingActions = firstLevelStatus === 'PENDING' || status === 'PENDING'
  // const showUnfreezeAction = status === 'FREEZED'

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {/* Always show Approve, Reject, Freeze, and Transfer buttons if first level is PENDING or status is PENDING */}
      {showPendingActions && (
        <>
          <Tooltip title='Approve'>
            <span>
              <IconButton
                color='success'
                onClick={() => handleOpenDialog(id, 'APPROVED')}
                disabled={updateVacancyRequestStatusLoading || !canTakeAction}
              >
                <CheckCircleOutlineIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Reject'>
            <span>
              <IconButton
                color='error'
                onClick={() => handleOpenDialog(id, 'REJECTED')}
                disabled={updateVacancyRequestStatusLoading || !canTakeAction}
              >
                <CancelOutlinedIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
          {/* <Tooltip title='Freeze'>
            <span>
              <IconButton
                color='info'
                onClick={() => handleOpenDialog(id, 'FREEZED')}
                disabled={updateVacancyRequestStatusLoading || !canTakeAction}
              >
                <PauseCircleOutlineIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Transfer'>
            <span>
              <IconButton
                color='primary'
                onClick={() => handleOpenDialog(id, 'TRANSFER')}
                disabled={updateVacancyRequestStatusLoading || !canTakeAction}
              >
                <SwapHorizIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip> */}
        </>
      )}

      {/* Always show Un-Freeze button if status is FREEZED */}
      {/* {showUnfreezeAction && (
        <Tooltip title='Un-Freeze'>
          <span>
            <IconButton
              color='warning'
              onClick={() => handleOpenDialog(id, 'UNFREEZED')}
              disabled={updateVacancyRequestStatusLoading || !canTakeAction}
            >
              <PlayCircleOutlineIcon fontSize='small' />
            </IconButton>
          </span>
        </Tooltip>
      )} */}

      {/* Always show View Employee Details button */}
      <Tooltip title='View Employee Details'>
        <IconButton color='primary' onClick={() => handleViewEmployeeDetails(employeeId)}>
          <VisibilityIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ActionButtons
