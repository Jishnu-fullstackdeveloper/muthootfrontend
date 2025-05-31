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
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  row,
  handleOpenDialog,
  handleViewEmployeeDetails,
  updateVacancyRequestStatusLoading
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {row.original.status === 'PENDING' && (
        <>
          <Tooltip title='Approve'>
            <IconButton
              color='success'
              onClick={() => handleOpenDialog(row.original.id, 'APPROVED')}
              disabled={updateVacancyRequestStatusLoading}
            >
              <CheckCircleOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Reject'>
            <IconButton
              color='error'
              onClick={() => handleOpenDialog(row.original.id, 'REJECTED')}
              disabled={updateVacancyRequestStatusLoading}
            >
              <CancelOutlinedIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Freeze'>
            <IconButton
              color='info'
              onClick={() => handleOpenDialog(row.original.id, 'FREEZED')}
              disabled={updateVacancyRequestStatusLoading}
            >
              <PauseCircleOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Transfer'>
            <IconButton
              color='primary'
              onClick={() => handleOpenDialog(row.original.id, 'TRANSFER')}
              disabled={updateVacancyRequestStatusLoading}
            >
              <SwapHorizIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </>
      )}
      {row.original.status === 'FREEZED' && (
        <Tooltip title='Un-Freeze'>
          <IconButton
            color='warning'
            onClick={() => handleOpenDialog(row.original.id, 'UNFREEZED')}
            disabled={updateVacancyRequestStatusLoading}
          >
            <PlayCircleOutlineIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title='View Employee Details'>
        <IconButton color='primary' onClick={() => handleViewEmployeeDetails(row.original.employeeId)}>
          <VisibilityIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ActionButtons
