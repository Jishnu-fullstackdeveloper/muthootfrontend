'use client'
import React, { useState } from 'react'
import { Box, Card, Typography, TableCell, IconButton } from '@mui/material'
import { useRouter } from 'next/navigation'
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import DynamicTable from '@/components/Table/dynamicTable'
import { ColumnDef } from '@tanstack/react-table'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import MyRequestCard from './RequestID'
import { approvalData } from '@/shared/approvalData'

const ApprovalManagement = () => {
  const router = useRouter()
  const statusColors: any = {
    Completed: '#059669',
    Pending: '#D97706',
    Overdue: '#F00'
  }
  const [approvals] = useState([
    {
      id: 1,
      title: 'Completed Approvals',
      icon: <LibraryAddCheckIcon color='success' />,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Pending Approvals',
      icon: <PendingActionsIcon color='warning' />,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Overdue Approvals',
      icon: <RunningWithErrorsIcon color='error' />,
      status: 'overdue'
    }
  ])

  const getOverdueCount = () => {
    const currentDate = new Date()
    return approvalData.filter(item => {
      const approvalDueDate = new Date(item.approvalDueDate)
      return item.status.toLowerCase() === 'overdue' && approvalDueDate < currentDate
    }).length
  }

  const getStatusCount = (status: string) => {
    return approvalData.filter(item => item.status.toLowerCase() === status).length
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'startDate', header: 'Start Date' },
    {
      accessorKey: 'approvalDueDate',
      header: 'Approval Due Date',
      cell: ({ row }) => {
        const currentDate = new Date()
        const approvalDueDate = new Date(row.original.approvalDueDate)
        const isOverdue = approvalDueDate < currentDate

        return <TableCell style={{ color: isOverdue ? 'red' : 'inherit' }}>{row.original.approvalDueDate}</TableCell>
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const color = statusColors[status.charAt(0).toUpperCase() + status.slice(1)] || 'inherit'

        return <TableCell style={{ color }}>{status}</TableCell>
      }
    },
    {
      header: 'Actions',
      meta: { className: 'sticky right-0' },
      cell: (info: any) => (
        <div>
          <IconButton aria-label='view' sx={{ fontSize: 18 }}>
            <VisibilityIcon />
          </IconButton>
          <IconButton aria-label='edit' sx={{ fontSize: 18 }}>
            <EditIcon />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <div className='min-h-screen'>
      <Box className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
        {approvals.map(approval => (
          <Card
            key={approval.id}
            sx={{
              cursor: 'pointer',
              padding: 2,
              boxShadow: 1,
              borderBottom: `4px solid ${statusColors[approval.status.charAt(0).toUpperCase() + approval.status.slice(1)] || 'inherit'}`
            }}
          >
            <Box className='flex justify-between items-center mb-2'>
              <Typography variant='h6' component='div'>
                {approval.title}
              </Typography>
              {approval.icon}
            </Box>
            <Typography variant='body2' color='textSecondary'>
              {approval.status === 'overdue'
                ? getOverdueCount() + ' Overdue Approvals'
                : approval.status === 'pending'
                  ? getStatusCount('pending') + ' Pending Approvals'
                  : getStatusCount(approval.status) + ' Approvals'}
            </Typography>
          </Card>
        ))}
      </Box>
      <Box className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
        <MyRequestCard /> {/* Add MyRequestCard here */}
      </Box>
      <Box className='p-4'>
        <DynamicTable columns={columns} data={approvalData} />
      </Box>
    </div>
  )
}

export default ApprovalManagement
